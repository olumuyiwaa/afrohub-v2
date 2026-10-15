"use client";
import { Suspense } from "react";
import StoreGate from "@/components/Store/StoreGate";
import StoreShop from "@/components/Store/StoreShop";

export default function StoreShopPage() {
  return (
    <StoreGate>
      <Suspense fallback={null}>
        <StoreShop />
      </Suspense>
    </StoreGate>
  );
}
