"use client";
import { useParams } from "next/navigation";
import StoreGate from "@/components/Store/StoreGate";
import { ThemedPage } from "@/themes/ThemedPage";

export default function StoreOrderPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <StoreGate>
      <ThemedPage page="order" orderId={id} />
    </StoreGate>
  );
}
