"use client";

import StoreGate from "@/components/Store/StoreGate";
import { ThemedPage } from "@/themes/ThemedPage";

export default function StoreCartPage() {
  return (
    <StoreGate>
      <ThemedPage page="cart" />
    </StoreGate>
  );
}
