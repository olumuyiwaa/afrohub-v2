// Public storefront services (what a shopper at /s/[slug] can do).
// Like the other services these only touch the mock db and can be replaced
// by real API calls later.
import type { Coupon, Order, OrderItem, PaymentMethod, Product, PublicStore } from "@/types/saas";
import { db, delay, ServiceError, uid } from "./db";

export const STORE_UNAVAILABLE = "STORE_UNAVAILABLE";

const toPublic = (b: (typeof db.businesses)[number]): PublicStore => ({
  id: b.id,
  name: b.name,
  slug: b.slug,
  category: b.category,
  description: b.description,
  phone: b.phone,
  city: b.city,
  country: b.country,
  brandColor: b.brandColor,
});

/** Only businesses that are live (active or on trial) have a public store. */
export async function getStoreBySlug(slug: string): Promise<PublicStore> {
  await delay(200);
  const biz = db.businesses.find((b) => b.slug === slug);
  if (!biz || (biz.status !== "active" && biz.status !== "trial")) {
    throw new ServiceError(STORE_UNAVAILABLE);
  }
  return toPublic(biz);
}

/** Draft products are hidden; sold-out products stay visible but can't be bought. */
export async function listStoreProducts(businessId: string): Promise<Product[]> {
  await delay(200);
  return db.products
    .filter((p) => p.businessId === businessId && p.status !== "draft")
    .map((p) => ({ ...p }));
}

/** Why a coupon can't be used for this subtotal, or the discount it gives. */
function evaluateCoupon(c: Coupon | undefined, subtotal: number): { discount: number } | { error: string } {
  if (!c || c.status !== "active") return { error: "That code isn't valid." };
  if (c.expiresAt && new Date(c.expiresAt).getTime() < Date.now()) return { error: "That code has expired." };
  if (c.maxUses != null && c.usedCount >= c.maxUses) return { error: "That code has been fully used." };
  if (c.minOrder && subtotal < c.minOrder) return { error: `Spend at least $${c.minOrder} to use this code.` };
  const raw = c.type === "percent" ? (subtotal * c.value) / 100 : c.value;
  return { discount: Math.round(Math.min(raw, subtotal) * 100) / 100 };
}

const findCoupon = (businessId: string, code: string) =>
  db.coupons.find((c) => c.businessId === businessId && c.code.toLowerCase() === code.trim().toLowerCase());

/** Checks a code against the cart subtotal without using it up. */
export async function validateCoupon(businessId: string, code: string, subtotal: number): Promise<{ code: string; discount: number }> {
  await delay(300);
  const c = findCoupon(businessId, code);
  const r = evaluateCoupon(c, subtotal);
  if ("error" in r) throw new ServiceError(r.error);
  return { code: c!.code, discount: r.discount };
}

export interface PlaceOrderInput {
  businessId: string;
  customer: { name: string; email: string; phone: string };
  shippingAddress: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  items: { productId: string | number; qty: number }[];
}

export async function placeOrder(input: PlaceOrderInput): Promise<Order> {
  await delay(700);
  const biz = db.businesses.find((b) => b.id === input.businessId);
  if (!biz || (biz.status !== "active" && biz.status !== "trial")) {
    throw new ServiceError("This store isn't available right now.");
  }
  if (input.items.length === 0) throw new ServiceError("Your cart is empty.");

  // plan limit: orders per month
  const plan = db.plans.find((p) => p.id === biz.planId);
  if (plan && plan.limits.ordersPerMonth !== -1) {
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const thisMonth = db.orders.filter(
      (o) => o.businessId === biz.id && new Date(o.placedAt) >= monthStart
    ).length;
    if (thisMonth >= plan.limits.ordersPerMonth) {
      throw new ServiceError("This store isn't taking new orders right now. Please try again later.");
    }
  }

  // validate every line against current stock BEFORE changing anything
  const lines: { product: (typeof db.products)[number]; qty: number }[] = [];
  for (const it of input.items) {
    const product = db.products.find((p) => p.id === String(it.productId) && p.businessId === biz.id);
    if (!product || product.status === "draft") {
      throw new ServiceError("One of the items in your cart is no longer available.");
    }
    if (product.status === "out_of_stock" || product.stock <= 0) {
      throw new ServiceError(`${product.name} is sold out.`);
    }
    if (!Number.isInteger(it.qty) || it.qty < 1) throw new ServiceError("Invalid quantity.");
    if (it.qty > product.stock) {
      throw new ServiceError(`Only ${product.stock} of ${product.name} left in stock.`);
    }
    lines.push({ product, qty: it.qty });
  }

  const items: OrderItem[] = lines.map(({ product, qty }) => ({
    productId: product.id,
    name: product.name,
    qty,
    price: product.price,
  }));
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  let discount = 0;
  let coupon: Coupon | undefined;
  if (input.couponCode) {
    coupon = findCoupon(biz.id, input.couponCode);
    const r = evaluateCoupon(coupon, subtotal);
    if ("error" in r) throw new ServiceError(r.error);
    discount = r.discount;
  }
  const total = Math.round((subtotal - discount) * 100) / 100;
  const paid = input.paymentMethod === "card"; // demo card flow succeeds instantly

  // customer: reuse by email, otherwise create
  const email = input.customer.email.trim().toLowerCase();
  let customer = db.customers.find((c) => c.businessId === biz.id && c.email.toLowerCase() === email);
  if (!customer) {
    customer = {
      id: uid("cus"),
      businessId: biz.id,
      name: input.customer.name.trim(),
      email,
      phone: input.customer.phone.trim(),
      city: "",
      orders: 0,
      totalSpent: 0,
      joinedAt: new Date().toISOString(),
    };
    db.customers.unshift(customer); // newest first, like orders
    biz.stats.customers += 1;
  }
  // the proxy returns stable objects, so re-read to mutate the stored record
  const stored = db.customers.find((c) => c.id === customer!.id)!;

  // next order number for this business, e.g. #AD1180
  const prefix = biz.slug.slice(0, 2).toUpperCase();
  const last = db.orders
    .filter((o) => o.businessId === biz.id)
    .reduce((max, o) => Math.max(max, parseInt(o.number.replace(/\D/g, ""), 10) || 0), 999);
  const number = `#${prefix}${last + 1}`;

  const order: Order = {
    id: uid("ord"),
    businessId: biz.id,
    number,
    customerId: stored.id,
    customerName: input.customer.name.trim(),
    items,
    total,
    status: "pending",
    paymentStatus: paid ? "paid" : "unpaid",
    placedAt: new Date().toISOString(),
    customerEmail: email,
    customerPhone: input.customer.phone.trim(),
    shippingAddress: input.shippingAddress.trim(),
    notes: input.notes?.trim() || undefined,
    paymentMethod: input.paymentMethod,
    ...(coupon ? { couponCode: coupon.code, discount } : {}),
  };
  db.orders.unshift(order);

  // inventory + stats
  for (const { product, qty } of lines) {
    product.stock -= qty;
    product.sold += qty;
    if (product.stock <= 0) product.status = "out_of_stock";
  }
  if (coupon) coupon.usedCount += 1;
  biz.stats.orders += 1;
  if (paid) {
    biz.stats.revenue += total;
    stored.orders += 1;
    stored.totalSpent += total;
  }
  return { ...order };
}

export async function getOrderForConfirmation(businessId: string, orderId: string): Promise<Order> {
  await delay(200);
  const o = db.orders.find((x) => x.id === orderId && x.businessId === businessId);
  if (!o) throw new ServiceError("Order not found.");
  return { ...o };
}
