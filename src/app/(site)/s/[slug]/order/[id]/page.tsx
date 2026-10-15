"use client";
import { useParams } from "next/navigation";
import StoreGate from "@/components/Store/StoreGate";
import OrderConfirmation from "@/components/Store/OrderConfirmation";

export default function StoreOrderPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <StoreGate>
      <OrderConfirmation orderId={id} />
    </StoreGate>
  );
}
