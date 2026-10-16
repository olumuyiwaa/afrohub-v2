import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { updateCartItemQuantity } from "@/redux/features/cart-slice";
import type { AppDispatch } from "@/redux/store";
import ProductThumb from "../ProductThumb";
import { useStoreHref, useStoreMoney } from "@/app/context/StoreContext";

export interface CartLine {
  id: number | string;
  title: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  imgs?: { thumbnails: string[]; previews: string[] };
  storeId?: string;
  stock?: number;
  color?: string;
  productId?: string;
  variantId?: string;
}

const stepBtn =
  "flex h-8 w-8 items-center justify-center text-lg leading-none text-dark ease-out duration-200 hover:bg-gray-2 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent";

const SingleItem = ({ item, onRemove }: { item: CartLine; onRemove: (item: CartLine) => void }) => {
  const dispatch = useDispatch<AppDispatch>();
  const href = useStoreHref();
  const fmt = useStoreMoney();

  // variant lines are titled "<product> · <option>"; show the option on its own line
  const sep = item.variantId ? item.title.lastIndexOf(" · ") : -1;
  const name = sep > -1 ? item.title.slice(0, sep) : item.title;
  const option = sep > -1 ? item.title.slice(sep + 3) : "";

  const max = item.stock ?? Infinity;
  const atMax = item.quantity >= max;
  const setQty = (quantity: number) => dispatch(updateCartItemQuantity({ id: item.id, quantity }));
  const productHref = href(`/product/${item.productId ?? item.id}`);

  return (
    <li className="flex gap-4 py-5">
      <div className="h-24 w-[72px] shrink-0 overflow-hidden rounded-xl bg-gray-3">
        {item.storeId ? (
          <Link href={productHref} aria-label={`View ${name}`} className="block h-full w-full">
            <ProductThumb item={item} variant="thumbnail" size={90} />
          </Link>
        ) : item.imgs?.thumbnails[0] ? (
          <Image src={item.imgs.thumbnails[0]} alt={item.title} width={100} height={100} />
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-medium text-dark">
              {item.storeId ? <Link href={productHref} className="ease-out duration-200 hover:underline">{name}</Link> : name}
            </h3>
            {option && <p className="text-custom-sm">{option}</p>}
            <p className="text-custom-sm">{fmt(item.discountedPrice)} each</p>
          </div>
          <p className="shrink-0 font-medium text-dark">{fmt(item.discountedPrice * item.quantity)}</p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center overflow-hidden rounded-full ring-1 ring-inset ring-gray-3">
              <button type="button" className={stepBtn} aria-label={`Decrease quantity of ${item.title}`} disabled={item.quantity <= 1} onClick={() => setQty(item.quantity - 1)}>
                −
              </button>
              <span className="w-8 text-center text-custom-sm font-medium text-dark" aria-live="polite">{item.quantity}</span>
              <button type="button" className={stepBtn} aria-label={`Increase quantity of ${item.title}`} disabled={atMax} onClick={() => setQty(item.quantity + 1)}>
                +
              </button>
            </div>
            {atMax && Number.isFinite(max) && <p className="mt-1 text-custom-xs text-[#b42318]">Only {max} available</p>}
          </div>
          <button type="button" onClick={() => onRemove(item)} className="text-custom-sm underline underline-offset-4 ease-out duration-200 hover:text-dark">
            Remove
          </button>
        </div>
      </div>
    </li>
  );
};

export default SingleItem;
