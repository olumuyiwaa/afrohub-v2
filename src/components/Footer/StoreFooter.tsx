"use client";
import React from "react";
import Link from "next/link";
import { useStore } from "@/app/context/StoreContext";

// Footer for a business storefront. Same layout classes as the template footer,
// but with the business's own details instead of placeholder company info.
const StoreFooter = () => {
  const ctx = useStore();
  const store = ctx?.store;
  const href = ctx?.href ?? ((p: string) => p);
  const year = new Date().getFullYear();
  if (!store) return null;

  return (
    <footer className="overflow-hidden">
      <div className="store-container mx-auto px-4 sm:px-8 xl:px-8">
        <div className="flex flex-wrap xl:flex-nowrap gap-10 xl:gap-19 xl:justify-between pt-17.5 xl:pt-22.5 pb-10 xl:pb-15">
          <div className="max-w-[420px] w-full">
            <h2 className="mb-7.5 text-custom-1 font-medium text-dark">About {store.name}</h2>
            <p className="mb-5">{store.description || `${store.name} — ${store.category}.`}</p>
            <ul className="flex flex-col gap-3">
              <li>
                {store.city}, {store.country}
              </li>
              {store.phone && (
                <li>
                  <a className="ease-out duration-200 hover:text-blue" href={`tel:${store.phone.replace(/\s/g, "")}`}>
                    {store.phone}
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div className="w-full sm:w-auto">
            <h2 className="mb-7.5 text-custom-1 font-medium text-dark">Shop</h2>
            <ul className="flex flex-col gap-3.5">
              <li><Link className="ease-out duration-200 hover:text-blue" href={href("/")}>Home</Link></li>
              <li><Link className="ease-out duration-200 hover:text-blue" href={href("/shop")}>All products</Link></li>
              <li><Link className="ease-out duration-200 hover:text-blue" href={href("/cart")}>Cart</Link></li>
              <li><Link className="ease-out duration-200 hover:text-blue" href={href("/checkout")}>Checkout</Link></li>
            </ul>
          </div>

          {ctx && ctx.categories.length > 0 && (
            <div className="w-full sm:w-auto">
              <h2 className="mb-7.5 text-custom-1 font-medium text-dark">Categories</h2>
              <ul className="flex flex-col gap-3.5">
                {ctx.categories.map((c) => (
                  <li key={c}>
                    <Link className="ease-out duration-200 hover:text-blue" href={href(`/shop?category=${encodeURIComponent(c)}`)}>
                      {c}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="py-5 xl:py-7.5 bg-gray-1">
        <div className="store-container mx-auto px-4 sm:px-8 xl:px-8">
          <div className="flex gap-5 flex-wrap items-center justify-between">
            <p className="text-dark font-medium">
              &copy; {year} {store.name}. All rights reserved.
            </p>
            <p className="text-custom-sm">
              Store powered by{" "}
              <Link href="/" className="font-medium text-dark hover:text-blue">
                AfroHub
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default StoreFooter;
