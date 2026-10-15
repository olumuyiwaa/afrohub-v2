"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Common/Breadcrumb";
import ProductItem from "@/components/Common/ProductItem";
import { useStore } from "@/app/context/StoreContext";

const PAGE_SIZE = 12;

type Sort = "latest" | "best" | "price-asc" | "price-desc";

export default function StoreShop() {
  const ctx = useStore();
  const router = useRouter();
  const params = useSearchParams();
  const [sort, setSort] = useState<Sort>("latest");
  const [page, setPage] = useState(1);

  const q = (params.get("q") ?? "").trim();
  const category = params.get("category") ?? "";

  const filtered = useMemo(() => {
    let list = ctx?.products ?? [];
    if (category) list = list.filter((p) => p.category === category);
    if (q) {
      const needle = q.toLowerCase();
      list = list.filter((p) => `${p.title} ${p.category ?? ""} ${p.description ?? ""}`.toLowerCase().includes(needle));
    }
    const by = [...list];
    if (sort === "latest") by.sort((a, b) => +new Date(b.createdAt ?? 0) - +new Date(a.createdAt ?? 0));
    if (sort === "best") by.sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0));
    if (sort === "price-asc") by.sort((a, b) => a.discountedPrice - b.discountedPrice);
    if (sort === "price-desc") by.sort((a, b) => b.discountedPrice - a.discountedPrice);
    return by;
  }, [ctx?.products, category, q, sort]);

  if (!ctx?.store) return null;
  const { href, categories, products } = ctx;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const setCategory = (c: string) => {
    setPage(1);
    const sp = new URLSearchParams();
    if (c) sp.set("category", c);
    if (q) sp.set("q", q);
    const qs = sp.toString();
    router.push(href(`/shop${qs ? `?${qs}` : ""}`));
  };

  const chip = (active: boolean) =>
    `inline-flex font-medium text-custom-sm py-2 px-5 rounded-md border ease-out duration-200 ${
      active ? "bg-blue border-blue text-white" : "border-gray-3 bg-gray-1 text-dark hover:bg-dark hover:text-white hover:border-transparent"
    }`;

  return (
    <>
      <Breadcrumb title={category || (q ? `Results for “${q}”` : "All Products")} pages={["shop"]} />
      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28 bg-[#f3f4f6]">
        <div className="store-container w-full mx-auto px-4 sm:px-8 xl:px-8">
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-3 mb-6">
              <button className={chip(!category)} onClick={() => setCategory("")}>All</button>
              {categories.map((c) => (
                <button key={c} className={chip(category === c)} onClick={() => setCategory(c)}>{c}</button>
              ))}
            </div>
          )}

          <div className="rounded-lg bg-white shadow-1 pl-4 pr-3 py-2.5 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p>
                Showing <span className="text-dark">{filtered.length}</span> of {products.length} products
                {q && (
                  <>
                    {" "}for “{q}”{" "}
                    <Link href={href("/shop")} className="text-blue ml-1">clear</Link>
                  </>
                )}
              </p>
              <label className="flex items-center gap-2.5">
                <span className="text-custom-sm">Sort by</span>
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value as Sort); setPage(1); }}
                  className="rounded-md border border-gray-3 bg-gray-1 py-2 pl-3 pr-8 text-dark outline-none"
                >
                  <option value="latest">Latest</option>
                  <option value="best">Best selling</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                </select>
              </label>
            </div>
          </div>

          {visible.length === 0 ? (
            <div className="rounded-lg bg-white shadow-1 py-16 text-center">
              <p className="font-medium text-dark mb-1">
                {products.length === 0 ? "No products yet" : "No products match your search"}
              </p>
              <p className="mb-5">
                {products.length === 0 ? "This shop is still being set up." : "Try a different search or category."}
              </p>
              {products.length > 0 && (
                <Link href={href("/shop")} className="inline-flex font-medium text-white bg-blue py-2.5 px-7 rounded-md hover:bg-blue-dark">
                  See all products
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-7.5 gap-y-9">
              {visible.map((item) => (
                <ProductItem item={item} key={item.id} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center mt-15">
              <div className="bg-white shadow-1 rounded-md p-2">
                <ul className="flex items-center">
                  <li>
                    <button
                      disabled={current === 1}
                      onClick={() => setPage(current - 1)}
                      className="flex items-center justify-center px-3 h-9 ease-out duration-200 rounded-[3px] disabled:text-gray-4"
                    >
                      Prev
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <li key={n}>
                      <button
                        onClick={() => setPage(n)}
                        className={`flex py-1.5 px-3.5 duration-200 rounded-[3px] ${n === current ? "bg-blue text-white" : "hover:text-white hover:bg-blue"}`}
                      >
                        {n}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      disabled={current === totalPages}
                      onClick={() => setPage(current + 1)}
                      className="flex items-center justify-center px-3 h-9 ease-out duration-200 rounded-[3px] disabled:text-gray-4"
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
