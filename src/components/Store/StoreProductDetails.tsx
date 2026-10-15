"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Breadcrumb from "@/components/Common/Breadcrumb";
import ProductItem from "@/components/Common/ProductItem";
import ProductThumb from "@/components/Common/ProductThumb";
import { useStore } from "@/app/context/StoreContext";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import { addItemToCart } from "@/redux/features/cart-slice";
import { AppDispatch, useAppSelector } from "@/redux/store";

export default function StoreProductDetails({ productId }: { productId: string }) {
  const ctx = useStore();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { openCartModal } = useCartModalContext();
  const cartItems = useAppSelector((s) => s.cartReducer.items);
  const [qty, setQty] = useState(1);

  if (!ctx?.store) return null;
  const { products, href } = ctx;
  const product = products.find((p) => String(p.id) === productId);

  if (!product) {
    return (
      <>
        <Breadcrumb title="Product not found" pages={["product"]} />
        <section className="py-20 text-center">
          <p className="mb-6">This product doesn&apos;t exist or is no longer available.</p>
          <Link href={href("/shop")} className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md hover:bg-blue-dark">
            Back to shop
          </Link>
        </section>
      </>
    );
  }

  const stock = product.stock ?? Infinity;
  const soldOut = stock <= 0;
  const inCart = cartItems.find((i) => i.id === product.id)?.quantity ?? 0;
  const room = Math.max(0, stock - inCart); // how many more can still be added
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const add = () => {
    if (room <= 0) return;
    dispatch(addItemToCart({ ...product, quantity: Math.min(qty, room) }));
  };

  return (
    <>
      <Breadcrumb title={product.title} pages={["shop", product.title]} />
      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 xl:pt-28">
        <div className="store-container w-full mx-auto px-4 sm:px-8 xl:px-8">
          <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-17.5">
            <div className="lg:max-w-[570px] w-full">
              <div className="lg:min-h-[512px] h-[340px] lg:h-[512px] rounded-lg shadow-1 overflow-hidden">
                <ProductThumb item={product} size={400} />
              </div>
            </div>

            <div className="max-w-[539px] w-full">
              <div className="flex items-center justify-between mb-3">
                <h1 className="font-semibold text-xl sm:text-2xl xl:text-custom-3 text-dark">{product.title}</h1>
              </div>

              <div className="flex flex-wrap items-center gap-4.5 mb-4.5">
                {product.category && (
                  <Link
                    href={href(`/shop?category=${encodeURIComponent(product.category)}`)}
                    className="text-custom-sm hover:text-blue"
                  >
                    {product.category}
                  </Link>
                )}
                {product.sku && <span className="text-custom-sm">SKU: {product.sku}</span>}
                <span className={soldOut ? "text-red" : "text-green"}>
                  {soldOut ? "Sold out" : stock <= 5 ? `Only ${stock} left` : "In stock"}
                </span>
              </div>

              <h3 className="font-medium text-custom-1 mb-4.5">
                <span className="text-xl text-dark">${product.discountedPrice}</span>
              </h3>

              {product.description && <p className="mb-6">{product.description}</p>}

              <div className="flex flex-col gap-4.5 border-y border-gray-3 mt-7.5 mb-9 py-9">
                <div className="flex items-center gap-4">
                  <div className="min-w-[65px]">
                    <h4 className="font-medium text-dark">Quantity:</h4>
                  </div>
                  <div className="flex items-center rounded-md border border-gray-3">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      disabled={qty <= 1 || soldOut}
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="flex items-center justify-center w-12 h-12 text-xl ease-out duration-200 hover:text-blue disabled:opacity-40"
                    >
                      −
                    </button>
                    <span className="flex items-center justify-center w-16 h-12 border-x border-gray-4" aria-live="polite">
                      {soldOut ? 0 : Math.min(qty, Math.max(room, 1))}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      disabled={soldOut || qty >= room}
                      onClick={() => setQty((q) => Math.min(room, q + 1))}
                      className="flex items-center justify-center w-12 h-12 text-xl ease-out duration-200 hover:text-blue disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>
                  {inCart > 0 && <span className="text-custom-sm">{inCart} already in your cart</span>}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4.5">
                <button
                  type="button"
                  disabled={soldOut || room <= 0}
                  onClick={() => { add(); openCartModal(); }}
                  className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {soldOut ? "Sold out" : room <= 0 ? "Max in cart" : "Add to cart"}
                </button>
                <button
                  type="button"
                  disabled={soldOut || (room <= 0 && inCart === 0)}
                  onClick={() => { add(); router.push(href("/checkout")); }}
                  className="inline-flex font-medium text-white bg-dark py-3 px-7 rounded-md ease-out duration-200 hover:bg-opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Buy now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="overflow-hidden pb-20">
          <div className="store-container w-full mx-auto px-4 sm:px-8 xl:px-8">
            <h2 className="font-semibold text-xl xl:text-heading-5 text-dark mb-7">You may also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-7.5 gap-y-9">
              {related.map((item) => (
                <ProductItem item={item} key={item.id} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
