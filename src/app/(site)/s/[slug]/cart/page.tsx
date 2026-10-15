"use client";
import StoreGate from "@/components/Store/StoreGate";
import StoreCart from "@/components/Store/StoreCart";

export default function StoreCartPage() {
  return (
    <StoreGate>
      <StoreCart />
    </StoreGate>
  );
}
