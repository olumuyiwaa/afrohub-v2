// Business admin (tenant) services. Every call is scoped by businessId, which
// is exactly how the real API will authorise requests.
import type {
  Business,
  Coupon,
  BusinessOverview,
  BusinessUsage,
  Customer,
  Invoice,
  Order,
  OrderStatus,
  Plan,
  Product,
  Subscription,
  TeamMember,
  TimeSeriesPoint,
} from "@/types/saas";
import { db, delay, ServiceError, uid } from "./db";

const DAY = 86400000;
const inRange = (iso: string, fromDaysAgo: number, toDaysAgo: number) => {
  const t = Date.now() - new Date(iso).getTime();
  return t >= toDaysAgo * DAY && t < fromDaysAgo * DAY;
};

export async function getBusinessOverview(businessId: string): Promise<BusinessOverview> {
  await delay();
  const orders = db.orders.filter((o) => o.businessId === businessId);
  const paid = orders.filter((o) => o.paymentStatus === "paid");

  const cur = paid.filter((o) => inRange(o.placedAt, 30, 0));
  const prev = paid.filter((o) => inRange(o.placedAt, 60, 30));
  const sum = (xs: Order[]) => xs.reduce((s, o) => s + o.total, 0);
  const change = (a: number, b: number) => (b === 0 ? (a > 0 ? 100 : 0) : ((a - b) / b) * 100);

  const series: TimeSeriesPoint[] = [];
  for (let d = 29; d >= 0; d--) {
    const day = new Date(Date.now() - d * DAY);
    series.push({
      label: day.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: paid
        .filter((o) => inRange(o.placedAt, d + 1, d))
        .reduce((s, o) => s + o.total, 0),
    });
  }

  const statuses: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled", "refunded"];
  const customers = db.customers.filter((c) => c.businessId === businessId);
  const products = db.products.filter((p) => p.businessId === businessId);

  return {
    revenue30d: sum(cur),
    revenueChangePct: change(sum(cur), sum(prev)),
    orders30d: cur.length,
    ordersChangePct: change(cur.length, prev.length),
    customers: customers.length,
    newCustomers30d: customers.filter((c) => inRange(c.joinedAt, 30, 0)).length,
    avgOrderValue: cur.length ? sum(cur) / cur.length : 0,
    revenueSeries: series,
    ordersByStatus: statuses.map((status) => ({
      status,
      count: orders.filter((o) => o.status === status).length,
    })),
    topProducts: [...products].sort((a, b) => b.sold - a.sold).slice(0, 5),
    lowStock: products.filter((p) => p.status !== "draft" && p.stock <= 6).slice(0, 5),
    recentOrders: orders.slice(0, 6),
    ...operational(orders, products, db.team.filter((t) => t.businessId === businessId).length),
  };
}

function operational(orders: Order[], products: Product[], teamSize: number) {
  const live = orders.filter((o) => o.status !== "cancelled" && o.status !== "refunded");
  const unpaid = live.filter((o) => o.paymentStatus === "unpaid");
  const sellable = products.filter((p) => p.status !== "draft");
  return {
    pendingOrders: orders.filter((o) => o.status === "pending").length,
    unpaidOrders: unpaid.length,
    unpaidAmount: unpaid.reduce((s, o) => s + o.total, 0),
    fulfilmentRatePct: live.length ? (live.filter((o) => o.status === "delivered").length / live.length) * 100 : 0,
    cancelRatePct: orders.length ? (orders.filter((o) => o.status === "cancelled").length / orders.length) * 100 : 0,
    outOfStock: sellable.filter((p) => p.stock <= 0).length,
    lowStockCount: sellable.filter((p) => p.stock > 0 && p.stock <= 6).length,
    totalOrders: orders.length,
    productsTotal: products.length,
    activeProducts: products.filter((p) => p.status === "active").length,
    teamSize,
  };
}

// ---------- products ----------

export async function listProducts(businessId: string): Promise<Product[]> {
  await delay();
  return db.products.filter((p) => p.businessId === businessId);
}

export type ProductInput = Pick<Product, "name" | "sku" | "category" | "description" | "price" | "stock" | "status"> & {
  /** data URL to set, null to remove, undefined to leave unchanged */
  image?: string | null;
  variants?: Product["variants"];
};

function cleanVariants(input?: Product["variants"]): Product["variants"] {
  if (!input || input.length === 0) return undefined;
  const seen = new Set<string>();
  return input.map((v) => {
    const name = v.name.trim();
    if (!name) throw new ServiceError("Every variant needs a name.");
    if (seen.has(name.toLowerCase())) throw new ServiceError(`Two variants are both called "${name}".`);
    seen.add(name.toLowerCase());
    if (!Number.isInteger(v.stock) || v.stock < 0) throw new ServiceError(`Stock for "${name}" must be a whole number, 0 or more.`);
    if (v.price !== undefined && !(v.price >= 0)) throw new ServiceError(`Enter a valid price for "${name}".`);
    return { id: v.id || uid("var"), name, stock: v.stock, ...(v.price !== undefined ? { price: v.price } : {}) };
  });
}

export async function saveProduct(
  businessId: string,
  input: ProductInput,
  id?: string
): Promise<Product> {
  await delay(400);
  const { image, variants: rawVariants, ...fields } = input;
  const variants = cleanVariants(rawVariants);
  if (variants) fields.stock = variants.reduce((s, v) => s + v.stock, 0);
  input = fields as ProductInput;
  if (id) {
    const p = db.products.find((x) => x.id === id && x.businessId === businessId);
    if (!p) throw new ServiceError("Product not found.");
    Object.assign(p, input, {
      status: input.stock === 0 && input.status === "active" ? "out_of_stock" : input.status,
    });
    p.variants = variants;
    if (image === null) p.image = undefined;
    else if (image) p.image = image;
    return { ...p };
  }
  const biz = db.businesses.find((b) => b.id === businessId);
  const plan = db.plans.find((p) => p.id === biz?.planId);
  const count = db.products.filter((p) => p.businessId === businessId).length;
  if (plan && plan.limits.products !== -1 && count >= plan.limits.products) {
    throw new ServiceError(`Your ${plan.name} plan is limited to ${plan.limits.products} products. Upgrade to add more.`);
  }
  const colors = ["#c3ceff", "#ffd9a8", "#b7ebd0", "#fecdca", "#d9d6fe", "#b2e9f5"];
  const product: Product = {
    ...input,
    id: uid("prd"),
    businessId,
    sold: 0,
    imageColor: colors[count % colors.length],
    createdAt: new Date().toISOString(),
    ...(image ? { image } : {}),
    ...(variants ? { variants } : {}),
    status: input.stock === 0 && input.status === "active" ? "out_of_stock" : input.status,
  };
  db.products.unshift(product);
  if (biz) biz.stats.products += 1;
  return product;
}

export async function deleteProduct(businessId: string, id: string): Promise<void> {
  await delay(300);
  const i = db.products.findIndex((p) => p.id === id && p.businessId === businessId);
  if (i === -1) throw new ServiceError("Product not found.");
  db.products.splice(i, 1);
  const biz = db.businesses.find((b) => b.id === businessId);
  if (biz) biz.stats.products = Math.max(0, biz.stats.products - 1);
}

// ---------- orders & customers ----------

export async function listOrders(businessId: string): Promise<Order[]> {
  await delay();
  return db.orders.filter((o) => o.businessId === businessId);
}

export async function updateOrderStatus(
  businessId: string,
  id: string,
  status: OrderStatus
): Promise<Order> {
  await delay(300);
  const o = db.orders.find((x) => x.id === id && x.businessId === businessId);
  if (!o) throw new ServiceError("Order not found.");
  o.status = status;
  if (status === "refunded") o.paymentStatus = "refunded";
  else if (status === "cancelled") o.paymentStatus = "unpaid";
  else if (o.paymentStatus === "unpaid" && status !== "pending") o.paymentStatus = "paid";
  return { ...o };
}

export async function listCustomers(businessId: string): Promise<Customer[]> {
  await delay();
  return db.customers.filter((c) => c.businessId === businessId);
}

// ---------- team ----------

export async function listTeam(businessId: string): Promise<TeamMember[]> {
  await delay(250);
  return db.team.filter((t) => t.businessId === businessId);
}

export async function inviteTeamMember(
  businessId: string,
  input: { name: string; email: string; role: "manager" | "staff" }
): Promise<TeamMember> {
  await delay(400);
  const biz = db.businesses.find((b) => b.id === businessId);
  const plan = db.plans.find((p) => p.id === biz?.planId);
  const count = db.team.filter((t) => t.businessId === businessId).length;
  if (plan && count >= plan.limits.staff) {
    throw new ServiceError(`Your ${plan.name} plan allows ${plan.limits.staff} team members. Upgrade to invite more.`);
  }
  if (db.team.some((t) => t.businessId === businessId && t.email.toLowerCase() === input.email.toLowerCase())) {
    throw new ServiceError("That person is already on your team.");
  }
  const m: TeamMember = {
    id: uid("tm"),
    businessId,
    ...input,
    status: "invited",
    joinedAt: new Date().toISOString(),
  };
  db.team.push(m);
  return m;
}

export async function removeTeamMember(businessId: string, id: string): Promise<void> {
  await delay(300);
  const m = db.team.find((t) => t.id === id && t.businessId === businessId);
  if (!m) throw new ServiceError("Team member not found.");
  if (m.role === "owner") throw new ServiceError("The owner cannot be removed.");
  db.team.splice(db.team.indexOf(m), 1);
}

// ---------- billing ----------

export interface BillingInfo {
  plan: Plan;
  subscription?: Subscription;
  usage: BusinessUsage;
  invoices: Invoice[];
  plans: Plan[];
}

export async function getBilling(businessId: string): Promise<BillingInfo> {
  await delay();
  const biz = db.businesses.find((b) => b.id === businessId);
  if (!biz) throw new ServiceError("Business not found.");
  const plan = db.plans.find((p) => p.id === biz.planId)!;
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const ordersThisMonth = db.orders.filter(
    (o) => o.businessId === businessId && new Date(o.placedAt) >= monthStart
  ).length;
  const productCount = db.products.filter((p) => p.businessId === businessId).length;
  return {
    plan,
    subscription: db.subscriptions.find((s) => s.businessId === businessId),
    usage: {
      products: { used: productCount, limit: plan.limits.products },
      staff: { used: db.team.filter((t) => t.businessId === businessId).length, limit: plan.limits.staff },
      ordersThisMonth: { used: ordersThisMonth, limit: plan.limits.ordersPerMonth },
      storageGb: { used: Math.round((0.3 + productCount * 0.08) * 10) / 10, limit: plan.limits.storageGb },
    },
    invoices: db.invoices.filter((i) => i.businessId === businessId),
    plans: db.plans.filter((p) => p.isActive),
  };
}

export async function changePlan(
  businessId: string,
  planId: string,
  cycle: "monthly" | "yearly"
): Promise<void> {
  await delay(700);
  const biz = db.businesses.find((b) => b.id === businessId);
  const plan = db.plans.find((p) => p.id === planId);
  const sub = db.subscriptions.find((s) => s.businessId === businessId);
  if (!biz || !plan || !sub) throw new ServiceError("Could not change plan.");
  biz.planId = plan.id;
  sub.planId = plan.id;
  sub.cycle = cycle;
  sub.amount = cycle === "yearly" ? plan.priceYearly : plan.priceMonthly;
  if (sub.amount === 0) {
    sub.status = "active";
    sub.trialEndsAt = undefined;
  }
}

// ---------- store profile ----------

export async function getBusinessProfile(businessId: string): Promise<Business> {
  await delay(250);
  const biz = db.businesses.find((b) => b.id === businessId);
  if (!biz) throw new ServiceError("Business not found.");
  return { ...biz };
}

export async function updateBusinessProfile(
  businessId: string,
  patch: Partial<Pick<Business, "name" | "description" | "phone" | "country" | "city" | "brandColor" | "category" | "currency">>
): Promise<Business> {
  await delay(450);
  const biz = db.businesses.find((b) => b.id === businessId);
  if (!biz) throw new ServiceError("Business not found.");
  Object.assign(biz, patch);
  return { ...biz };
}

// ---------- discounts & coupons ----------

export type CouponInput = Pick<Coupon, "code" | "type" | "value" | "minOrder" | "maxUses" | "expiresAt">;

export async function listCoupons(businessId: string): Promise<Coupon[]> {
  await delay(250);
  return db.coupons.filter((c) => c.businessId === businessId).map((c) => ({ ...c }));
}

export async function saveCoupon(businessId: string, id: string | null, input: CouponInput): Promise<Coupon> {
  await delay(400);
  const code = input.code.trim().toUpperCase();
  if (!/^[A-Z0-9-]{3,20}$/.test(code)) throw new ServiceError("Use 3–20 letters, numbers or dashes for the code.");
  if (!(input.value > 0)) throw new ServiceError("Enter a discount greater than zero.");
  if (input.type === "percent" && input.value > 100) throw new ServiceError("A percentage can't be more than 100.");
  if (db.coupons.some((c) => c.businessId === businessId && c.code === code && c.id !== id)) {
    throw new ServiceError("You already have a code with that name.");
  }
  if (id) {
    const c = db.coupons.find((x) => x.id === id && x.businessId === businessId);
    if (!c) throw new ServiceError("Coupon not found.");
    Object.assign(c, input, { code });
    return { ...c };
  }
  const c: Coupon = { id: uid("cpn"), businessId, ...input, code, usedCount: 0, status: "active", createdAt: new Date().toISOString() };
  db.coupons.unshift(c);
  return { ...c };
}

export async function setCouponStatus(businessId: string, id: string, status: Coupon["status"]): Promise<void> {
  await delay(250);
  const c = db.coupons.find((x) => x.id === id && x.businessId === businessId);
  if (!c) throw new ServiceError("Coupon not found.");
  c.status = status;
}

export async function deleteCoupon(businessId: string, id: string): Promise<void> {
  await delay(250);
  const i = db.coupons.findIndex((x) => x.id === id && x.businessId === businessId);
  if (i >= 0) db.coupons.splice(i, 1);
}

// ---------- receipts ----------

export async function markReceiptSent(businessId: string, orderId: string): Promise<Order> {
  await delay(500);
  const o = db.orders.find((x) => x.id === orderId && x.businessId === businessId);
  if (!o) throw new ServiceError("Order not found.");
  o.receiptSentAt = new Date().toISOString();
  return { ...o };
}
