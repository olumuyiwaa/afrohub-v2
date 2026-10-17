"use client";

import StoreGate from "@/components/Store/StoreGate";
import { ThemedPage } from "@/themes/ThemedPage";

export default function StoreCheckoutPage() {
  return (
    <StoreGate>
      <ThemedPage page="checkout" />
    </StoreGate>
  );
}
