"use client";
import React from "react";
import ProductArt from "./ProductArt";
import { useStore } from "@/app/context/StoreContext";

/**
 * Fills its (positioned, overflow-hidden) parent with a category's cover picture.
 * Falls back to the first product photo in the category, then to generated artwork.
 */
export default function CategoryPicture({ name, className = "" }: { name: string; className?: string }) {
  const ctx = useStore();
  const inCat = ctx?.products.filter((p) => p.category === name) ?? [];
  const src = ctx?.categoryImages[name] ?? inCat.find((p) => p.imgs?.previews?.length)?.imgs?.previews[0];
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="" loading="lazy" className={`absolute inset-0 h-full w-full object-cover ${className}`} />;
  }
  return (
    <div className={`absolute inset-0 ${className}`}>
      <ProductArt seed={name} color={inCat[0]?.color ?? "#E5E7EB"} showInitial={false} />
    </div>
  );
}
