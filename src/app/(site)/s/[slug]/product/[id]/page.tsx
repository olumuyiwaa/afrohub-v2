"use client";
import { useParams } from "next/navigation";
import StoreGate from "@/components/Store/StoreGate";
import { ThemedPage } from "@/themes/ThemedPage";

export default function StoreProductPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <StoreGate>
      <ThemedPage page="product" productId={decodeURIComponent(id)} />
    </StoreGate>
  );
}
