"use client";

import StoreGate from "@/components/Store/StoreGate";
import { ThemedPage } from "@/themes/ThemedPage";

export default function StoreHomePage() {
  return (
    <StoreGate>
      <ThemedPage page="home" />
    </StoreGate>
  );
}
