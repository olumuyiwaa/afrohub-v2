"use client";
import { useParams } from "next/navigation";
import StoreGate from "@/components/Store/StoreGate";
import StoreProductDetails from "@/components/Store/StoreProductDetails";

export default function StoreProductPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <StoreGate>
      <StoreProductDetails productId={decodeURIComponent(id)} />
    </StoreGate>
  );
}
