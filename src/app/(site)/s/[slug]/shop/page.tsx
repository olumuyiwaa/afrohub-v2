"use client";
import { Suspense } from "react";
import StoreGate from "@/components/Store/StoreGate";
import { ThemedPage } from "@/themes/ThemedPage";

export default function StoreShopPage() {
  return (
    <StoreGate>
      <Suspense fallback={null}>
        <ThemedPage page="shop" />
      </Suspense>
    </StoreGate>
  );
}
