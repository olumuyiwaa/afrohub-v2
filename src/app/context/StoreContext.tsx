"use client";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import type { Product as StoreProductRow, PublicStore } from "@/types/saas";
import type { Product } from "@/types/product";
import { getStoreBySlug, listStoreProducts, STORE_UNAVAILABLE } from "@/services/store";
import { syncCartToStore } from "@/redux/features/cart-slice";
import type { AppDispatch } from "@/redux/store";

interface StoreContextValue {
  store: PublicStore | null;
  products: Product[];
  categories: string[];
  status: "loading" | "ready" | "unavailable" | "error";
  /** Prefix a storefront path with this store's base URL, e.g. "/shop" -> "/s/adire-hub/shop". */
  href: (path: string) => string;
  reload: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

/** null when rendered outside a business storefront (e.g. the /storefront template preview). */
export const useStore = () => useContext(StoreContext);

/** Slug-aware link builder; identity function outside a storefront. */
export const useStoreHref = () => useContext(StoreContext)?.href ?? ((p: string) => p);

export const storeBase = (slug: string) => `/s/${slug}`;

// Convert an admin product row into the shape the template's product components use.
export const toTemplateProduct = (p: StoreProductRow): Product => ({
  id: p.id,
  title: p.name,
  reviews: 0,
  price: p.price,
  discountedPrice: p.price,
  storeId: p.businessId,
  category: p.category,
  description: p.description,
  stock: p.status === "out_of_stock" ? 0 : p.stock,
  color: p.imageColor,
  sku: p.sku,
  createdAt: p.createdAt,
  sold: p.sold,
});

function readableOn(hex: string) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return "#ffffff";
  const n = parseInt(m[1], 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  // perceived luminance; dark text on light brand colours keeps buttons legible
  return 0.299 * r + 0.587 * g + 0.114 * b > 170 ? "#1C274C" : "#ffffff";
}

export function StoreProvider({ slug, children }: { slug?: string; children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const [store, setStore] = useState<PublicStore | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<StoreContextValue["status"]>("loading");
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setStatus((s) => (s === "ready" ? s : "loading"));
    (async () => {
      try {
        const s = await getStoreBySlug(slug);
        const rows = await listStoreProducts(s.id);
        if (cancelled) return;
        setStore(s);
        setProducts(rows.map(toTemplateProduct));
        setStatus("ready");
        dispatch(syncCartToStore(s.id));
      } catch (e) {
        if (cancelled) return;
        setStore(null);
        setStatus(e instanceof Error && e.message === STORE_UNAVAILABLE ? "unavailable" : "error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, nonce, dispatch]);

  const value = useMemo<StoreContextValue | null>(() => {
    if (!slug) return null;
    return {
      store,
      products,
      categories: Array.from(new Set(products.map((p) => p.category).filter(Boolean) as string[])).sort(),
      status,
      href: (path: string) => `${storeBase(slug)}${path === "/" ? "" : path}`,
      reload: () => setNonce((n) => n + 1),
    };
  }, [slug, store, products, status]);

  if (!slug) return <>{children}</>;

  const brand = store?.brandColor ?? "#3C50E0";
  return (
    <StoreContext.Provider value={value}>
      <div
        className="store-themed"
        style={{ ["--brand" as string]: brand, ["--brand-fg" as string]: readableOn(brand) }}
      >
        {/* Re-skin the template's blue accent with the business's brand colour */}
        <style>{`
          .store-themed .bg-blue{background-color:var(--brand)!important;color:var(--brand-fg)!important}
          .store-themed .hover\\:bg-blue-dark:hover{background-color:var(--brand)!important;filter:brightness(.9)}
          .store-themed .text-blue,.store-themed .hover\\:text-blue:hover,.store-themed .last\\:text-blue:last-child{color:var(--brand)!important}
          .store-themed .border-blue{border-color:var(--brand)!important}
          .store-themed .before\\:bg-blue::before{background-color:var(--brand)!important}
          .store-themed .focus\\:ring-blue\\/20:focus{--tw-ring-color:color-mix(in srgb,var(--brand) 20%,transparent)!important}
        `}</style>
        {children}
      </div>
    </StoreContext.Provider>
  );
}
