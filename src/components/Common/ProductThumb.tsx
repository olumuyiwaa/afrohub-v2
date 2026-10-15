import React from "react";
import Image from "next/image";
import ProductArt from "@/components/Store/ProductArt";

type Thumbable = {
  title: string;
  imgs?: { thumbnails: string[]; previews: string[] };
  color?: string;
};

/**
 * Product picture for the storefront. Template products have real images;
 * business products don't have photos yet, so they get a coloured tile with
 * the product's initial instead of a broken image.
 */
const ProductThumb = ({
  item,
  variant = "preview",
  size = 250,
  className = "",
}: {
  item: Thumbable;
  variant?: "preview" | "thumbnail";
  size?: number;
  className?: string;
}) => {
  const src = variant === "thumbnail" ? item.imgs?.thumbnails?.[0] : item.imgs?.previews?.[0];
  if (src) {
    return <Image src={src} alt={item.title} width={size} height={size} className={className} />;
  }
  return (
    <div className={`w-full h-full min-h-[inherit] ${className}`}>
      <ProductArt seed={item.title} label={item.title} color={item.color} />
    </div>
  );
};

export default ProductThumb;
