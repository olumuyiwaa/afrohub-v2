import React from "react";
import Image from "next/image";

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
    <div
      role="img"
      aria-label={item.title}
      className={`flex items-center justify-center w-full h-full min-h-[inherit] select-none font-semibold text-dark/40 ${className}`}
      style={{ background: item.color ?? "#E5E7EB", fontSize: Math.max(18, size / 4) }}
    >
      {item.title.trim().charAt(0).toUpperCase()}
    </div>
  );
};

export default ProductThumb;
