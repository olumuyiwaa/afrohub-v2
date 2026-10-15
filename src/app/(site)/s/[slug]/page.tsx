"use client";
import StoreGate from "@/components/Store/StoreGate";
import StoreHome from "@/components/Store/StoreHome";

export default function StoreHomePage() {
  return (
    <StoreGate>
      <StoreHome />
    </StoreGate>
  );
}
