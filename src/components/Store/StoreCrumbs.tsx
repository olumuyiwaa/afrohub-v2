"use client";
import React from "react";
import Link from "next/link";
import { useStore } from "@/app/context/StoreContext";

/** Compact breadcrumb trail for storefront inner pages. */
export default function StoreCrumbs({ trail }: { trail: { label: string; to?: string }[] }) {
  const ctx = useStore();
  const href = ctx?.href ?? ((p: string) => p);
  const all = [{ label: "Home", to: href("/") }, ...trail];
  return (
    <nav aria-label="Breadcrumb" className="text-custom-sm">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {all.map((c, i) => (
          <li key={`${c.label}-${i}`} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden className="opacity-50">/</span>}
            {c.to && i < all.length - 1 ? (
              <Link href={c.to} className="ease-out duration-200 hover:text-dark">
                {c.label}
              </Link>
            ) : (
              <span aria-current={i === all.length - 1 ? "page" : undefined} className={i === all.length - 1 ? "text-dark" : ""}>
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
