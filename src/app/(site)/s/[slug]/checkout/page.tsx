"use client";
import StoreGate from "@/components/Store/StoreGate";
import StoreCheckout from "@/components/Store/StoreCheckout";

export default function StoreCheckoutPage() {
  return (
    <StoreGate>
      <StoreCheckout />
    </StoreGate>
  );
}
