"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useStore } from "@/app/context/StoreContext";
import { getOrderForConfirmation } from "@/services/store";
import type { Order } from "@/types/saas";

const NEXT_STEPS: Record<string, string> = {
  cod: "Please have the exact amount ready — you'll pay when your order is delivered.",
  bank: "The business will contact you shortly with their bank details so you can complete payment.",
  card: "Your demo card payment went through. No real money was taken.",
};

export default function OrderConfirmation({ orderId }: { orderId: string }) {
  const ctx = useStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing">("loading");
  const storeId = ctx?.store?.id;

  useEffect(() => {
    if (!storeId) return;
    let cancelled = false;
    getOrderForConfirmation(storeId, orderId)
      .then((o) => { if (!cancelled) { setOrder(o); setState("ready"); } })
      .catch(() => { if (!cancelled) setState("missing"); });
    return () => { cancelled = true; };
  }, [storeId, orderId]);

  if (!ctx?.store) return null;
  const { store, href } = ctx;

  if (state === "loading") {
    return (
      <>
        <Breadcrumb title="Order" pages={["order"]} />
        <section className="py-20 text-center" aria-busy="true"><p>Loading your order…</p></section>
      </>
    );
  }
  if (state === "missing" || !order) {
    return (
      <>
        <Breadcrumb title="Order not found" pages={["order"]} />
        <section className="py-20 text-center">
          <p className="mb-6">We couldn&apos;t find that order.</p>
          <Link href={href("/shop")} className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md hover:bg-blue-dark">Back to shop</Link>
        </section>
      </>
    );
  }

  return (
    <>
      <Breadcrumb title="Order confirmed" pages={["order confirmed"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="store-container w-full mx-auto px-4 sm:px-8 xl:px-8">
          <div className="mx-auto max-w-[720px] bg-white shadow-1 rounded-[10px] p-6 sm:p-10">
            <div className="text-center mb-8">
              <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-light-6 text-green text-3xl" aria-hidden>✓</span>
              <h1 className="font-semibold text-dark text-2xl xl:text-custom-2 mb-2">Thank you, {order.customerName.split(" ")[0]}!</h1>
              <p>
                Your order <span className="font-medium text-dark">{order.number}</span> has been placed with {store.name}.
              </p>
            </div>

            <div className="rounded-lg border border-gray-3 mb-6">
              {order.items.map((i) => (
                <div key={i.productId} className="flex items-center justify-between px-5 py-4 border-b border-gray-3">
                  <p className="text-dark">{i.name} <span className="text-dark-4">× {i.qty}</span></p>
                  <p className="text-dark">${i.qty * i.price}</p>
                </div>
              ))}
              <div className="flex items-center justify-between px-5 py-4">
                <p className="font-medium text-dark">Total</p>
                <p className="font-medium text-dark">${order.total}</p>
              </div>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-8 text-custom-sm">
              <div><dt className="text-dark-4">Deliver to</dt><dd className="text-dark">{order.shippingAddress}</dd></div>
              <div><dt className="text-dark-4">Contact</dt><dd className="text-dark">{order.customerEmail} · {order.customerPhone}</dd></div>
              <div className="sm:col-span-2"><dt className="text-dark-4">What happens next</dt><dd className="text-dark">{order.paymentMethod ? NEXT_STEPS[order.paymentMethod] : ""}</dd></div>
            </dl>

            <div className="text-center">
              <Link href={href("/shop")} className="inline-flex font-medium text-white bg-blue py-3 px-9 rounded-md ease-out duration-200 hover:bg-blue-dark">
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
