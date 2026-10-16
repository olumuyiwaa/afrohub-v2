"use client";
import { useParams } from "next/navigation";
import StoreGate from "@/components/Store/StoreGate";
import StoreInvoice from "@/components/Store/StoreInvoice";

export default function StoreInvoicePage() {
  const { id } = useParams<{ id: string }>();
  return (
    <StoreGate>
      <StoreInvoice orderId={id} />
    </StoreGate>
  );
}
