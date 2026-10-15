"use client";
import StoreGate from "@/components/Store/StoreGate";
import Cart from "@/components/Cart";

// Reuses the template's cart page; its links, images and totals adapt to the current store.
export default function StoreCartPage() {
  return (
    <StoreGate>
      <Cart />
    </StoreGate>
  );
}
