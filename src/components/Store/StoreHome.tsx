"use client";
import React from "react";
import Link from "next/link";
import ProductItem from "@/components/Common/ProductItem";
import { useStore } from "@/app/context/StoreContext";

const SectionTitle = ({ eyebrow, title, href, cta = "View All" }: { eyebrow: string; title: string; href: string; cta?: string }) => (
  <div className="mb-7 flex items-center justify-between">
    <div>
      <span className="flex items-center gap-2.5 font-medium text-dark mb-1.5">{eyebrow}</span>
      <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">{title}</h2>
    </div>
    <Link
      href={href}
      className="inline-flex font-medium text-custom-sm py-2.5 px-7 rounded-md border-gray-3 border bg-gray-1 text-dark ease-out duration-200 hover:bg-dark hover:text-white hover:border-transparent"
    >
      {cta}
    </Link>
  </div>
);

export default function StoreHome() {
  const ctx = useStore();
  if (!ctx?.store) return null;
  const { store, products, categories, href } = ctx;

  const live = products.filter((p) => p.stock === undefined || p.stock > 0);
  const newest = [...products]
    .sort((a, b) => +new Date(b.createdAt ?? 0) - +new Date(a.createdAt ?? 0))
    .slice(0, 8);
  const bestSellers = [...live].filter((p) => (p.sold ?? 0) > 0).sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0)).slice(0, 4);

  return (
    <main>
      {/* hero */}
      <section className="overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-57.5 sm:pt-45 lg:pt-30 xl:pt-51.5 bg-[#E5EAF4]">
        <div className="store-container w-full mx-auto px-4 sm:px-8 xl:px-8">
          <div className="relative rounded-[10px] bg-white overflow-hidden px-4 sm:px-10 lg:px-16 py-12 sm:py-16 xl:py-20">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-blue opacity-10" aria-hidden />
            <div className="absolute right-24 bottom-[-60px] h-44 w-44 rounded-full bg-blue opacity-10" aria-hidden />
            <div className="relative max-w-[620px]">
              <span className="inline-block font-medium text-blue text-custom-sm mb-3">{store.category}</span>
              <h1 className="font-semibold text-dark text-3xl sm:text-4xl xl:text-heading-3 mb-4">
                Welcome to {store.name}
              </h1>
              <p className="mb-8">
                {store.description || `Shop ${store.name} — based in ${store.city}, ${store.country}.`}
              </p>
              <Link
                href={href("/shop")}
                className="inline-flex font-medium text-white text-custom-sm rounded-md bg-blue py-3 px-9 ease-out duration-200 hover:bg-blue-dark"
              >
                Shop now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {products.length === 0 ? (
        <section className="py-20 text-center">
          <div className="store-container w-full mx-auto px-4 sm:px-8 xl:px-8">
            <h2 className="font-semibold text-xl text-dark mb-2">Products are coming soon</h2>
            <p>{store.name} is still setting up its shop. Check back shortly.</p>
          </div>
        </section>
      ) : (
        <>
          {categories.length > 1 && (
            <section className="overflow-hidden pt-15">
              <div className="store-container w-full mx-auto px-4 sm:px-8 xl:px-8">
                <h2 className="font-semibold text-xl xl:text-heading-5 text-dark mb-7">Browse by category</h2>
                <div className="flex flex-wrap gap-3">
                  {categories.map((c) => (
                    <Link
                      key={c}
                      href={href(`/shop?category=${encodeURIComponent(c)}`)}
                      className="inline-flex font-medium text-custom-sm py-2.5 px-6 rounded-md border border-gray-3 bg-gray-1 text-dark ease-out duration-200 hover:bg-dark hover:text-white hover:border-transparent"
                    >
                      {c}
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section className="overflow-hidden pt-15">
            <div className="store-container w-full mx-auto px-4 sm:px-8 xl:px-8">
              <SectionTitle eyebrow="Just in" title="New Arrivals" href={href("/shop")} />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-7.5 gap-y-9">
                {newest.map((item) => (
                  <ProductItem item={item} key={item.id} />
                ))}
              </div>
            </div>
          </section>

          {bestSellers.length > 0 && (
            <section className="overflow-hidden pt-15 pb-20">
              <div className="store-container w-full mx-auto px-4 sm:px-8 xl:px-8">
                <SectionTitle eyebrow="This month" title="Best Sellers" href={href("/shop")} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-7.5 gap-y-9">
                  {bestSellers.map((item) => (
                    <ProductItem item={item} key={item.id} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}
