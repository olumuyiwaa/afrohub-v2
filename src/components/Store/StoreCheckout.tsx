"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Breadcrumb from "@/components/Common/Breadcrumb";
import ProductThumb from "@/components/Common/ProductThumb";
import { useStore } from "@/app/context/StoreContext";
import { removeAllItemsFromCart, selectTotalPrice } from "@/redux/features/cart-slice";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { useSelector } from "react-redux";
import { placeOrder } from "@/services/store";
import type { PaymentMethod } from "@/types/saas";

const input =
  "rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20";

const METHODS: { id: PaymentMethod; title: string; hint: string }[] = [
  { id: "cod", title: "Pay on delivery", hint: "Pay in cash when your order arrives." },
  { id: "bank", title: "Direct bank transfer", hint: "The business will contact you with their bank details." },
  { id: "card", title: "Card (demo)", hint: "Demo only — no real payment is taken." },
];

export default function StoreCheckout() {
  const ctx = useStore();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const items = useAppSelector((s) => s.cartReducer.items);
  const total = useSelector(selectTotalPrice);

  const [f, setF] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", country: ctx?.store?.country ?? "", notes: "",
  });
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!ctx?.store) return null;
  const { store, href } = ctx;
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setF((v) => ({ ...v, [k]: e.target.value }));

  if (items.length === 0) {
    return (
      <>
        <Breadcrumb title="Checkout" pages={["checkout"]} />
        <section className="py-20 text-center">
          <p className="pb-6">Your cart is empty — add something before checking out.</p>
          <Link href={href("/shop")} className="inline-flex font-medium text-white bg-dark py-3 px-9 rounded-md hover:bg-opacity-95">
            Continue Shopping
          </Link>
        </section>
      </>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!f.firstName.trim() || !f.lastName.trim()) return setError("Please enter your first and last name.");
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) return setError("Please enter a valid email address.");
    if (f.phone.replace(/\D/g, "").length < 7) return setError("Please enter a valid phone number.");
    if (!f.address.trim() || !f.city.trim() || !f.country.trim()) return setError("Please enter your full delivery address.");

    setBusy(true);
    try {
      const order = await placeOrder({
        businessId: store.id,
        customer: { name: `${f.firstName.trim()} ${f.lastName.trim()}`, email: f.email, phone: f.phone },
        shippingAddress: `${f.address.trim()}, ${f.city.trim()}, ${f.country.trim()}`,
        notes: f.notes,
        paymentMethod: payment,
        items: items.map((i) => ({ productId: i.id, qty: i.quantity })),
      });
      dispatch(removeAllItemsFromCart());
      ctx.reload(); // refresh stock levels shown in the store
      router.push(href(`/order/${order.id}`));
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't place your order. Please try again.");
      setBusy(false);
    }
  };

  return (
    <>
      <Breadcrumb title="Checkout" pages={["checkout"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="store-container w-full mx-auto px-4 sm:px-8 xl:px-8">
          <form onSubmit={submit} noValidate>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
              <div className="lg:max-w-[920px] w-full">
                <h2 className="font-medium text-dark text-xl sm:text-2xl mb-5.5">Delivery details</h2>
                <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
                  <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
                    <div className="w-full">
                      <label htmlFor="firstName" className="block mb-2.5">First Name <span className="text-red">*</span></label>
                      <input id="firstName" className={input} value={f.firstName} onChange={set("firstName")} autoComplete="given-name" />
                    </div>
                    <div className="w-full">
                      <label htmlFor="lastName" className="block mb-2.5">Last Name <span className="text-red">*</span></label>
                      <input id="lastName" className={input} value={f.lastName} onChange={set("lastName")} autoComplete="family-name" />
                    </div>
                  </div>
                  <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
                    <div className="w-full">
                      <label htmlFor="email" className="block mb-2.5">Email <span className="text-red">*</span></label>
                      <input id="email" type="email" className={input} value={f.email} onChange={set("email")} autoComplete="email" />
                    </div>
                    <div className="w-full">
                      <label htmlFor="phone" className="block mb-2.5">Phone <span className="text-red">*</span></label>
                      <input id="phone" type="tel" className={input} value={f.phone} onChange={set("phone")} autoComplete="tel" />
                    </div>
                  </div>
                  <div className="mb-5">
                    <label htmlFor="address" className="block mb-2.5">Street address <span className="text-red">*</span></label>
                    <input id="address" className={input} value={f.address} onChange={set("address")} placeholder="House number and street name" autoComplete="street-address" />
                  </div>
                  <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
                    <div className="w-full">
                      <label htmlFor="city" className="block mb-2.5">Town / City <span className="text-red">*</span></label>
                      <input id="city" className={input} value={f.city} onChange={set("city")} autoComplete="address-level2" />
                    </div>
                    <div className="w-full">
                      <label htmlFor="country" className="block mb-2.5">Country <span className="text-red">*</span></label>
                      <input id="country" className={input} value={f.country} onChange={set("country")} autoComplete="country-name" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="notes" className="block mb-2.5">Order notes (optional)</label>
                    <textarea id="notes" rows={4} className={input} value={f.notes} onChange={set("notes")} placeholder="Notes about your order, e.g. special notes for delivery." />
                  </div>
                </div>
              </div>

              <div className="max-w-[455px] w-full">
                <div className="bg-white shadow-1 rounded-[10px]">
                  <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                    <h3 className="font-medium text-xl text-dark">Your Order</h3>
                  </div>
                  <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <h4 className="font-medium text-dark">Product</h4>
                      <h4 className="font-medium text-dark text-right">Subtotal</h4>
                    </div>
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-3 py-5 border-b border-gray-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="block h-11 w-11 flex-shrink-0 overflow-hidden rounded">
                            <ProductThumb item={item} variant="thumbnail" size={44} />
                          </span>
                          <p className="text-dark truncate">{item.title} <span className="text-dark-4">× {item.quantity}</span></p>
                        </div>
                        <p className="text-dark text-right">${item.discountedPrice * item.quantity}</p>
                      </div>
                    ))}
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <p className="text-dark">Delivery</p>
                      <p className="text-dark text-right">Arranged by {store.name}</p>
                    </div>
                    <div className="flex items-center justify-between pt-5">
                      <p className="font-medium text-lg text-dark">Total</p>
                      <p className="font-medium text-lg text-dark text-right">${total}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
                  <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                    <h3 className="font-medium text-xl text-dark">Payment Method</h3>
                  </div>
                  <div className="p-4 sm:p-8.5">
                    <div className="flex flex-col gap-3" role="radiogroup" aria-label="Payment method">
                      {METHODS.map((m) => (
                        <label key={m.id} className="flex cursor-pointer select-none items-start gap-4">
                          <input
                            type="radio"
                            name="payment"
                            value={m.id}
                            checked={payment === m.id}
                            onChange={() => setPayment(m.id)}
                            className="sr-only"
                          />
                          <span
                            aria-hidden
                            className={`mt-4 flex h-4 w-4 flex-shrink-0 rounded-full ${payment === m.id ? "border-4 border-blue" : "border border-gray-4"}`}
                          />
                          <span
                            className={`w-full rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent ${
                              payment === m.id ? "border-transparent bg-gray-2" : "border-gray-4 shadow-1"
                            }`}
                          >
                            <span className="block text-dark">{m.title}</span>
                            <span className="block text-custom-sm text-dark-4">{m.hint}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {error && (
                  <p role="alert" className="mt-5 rounded-md bg-red-light-6 border border-red-light-4 px-4 py-3 text-red-dark">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5 disabled:opacity-60"
                >
                  {busy ? "Placing your order…" : `Place order · $${total}`}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
