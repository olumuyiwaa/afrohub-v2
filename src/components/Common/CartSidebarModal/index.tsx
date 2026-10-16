"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useCartModalContext } from "@/app/context/CartSidebarModalContext";
import { addItemToCart, removeAllItemsFromCart, removeItemFromCart, selectTotalPrice } from "@/redux/features/cart-slice";
import { useAppSelector, type AppDispatch } from "@/redux/store";
import { useStoreHref, useStoreMoney } from "@/app/context/StoreContext";
import { useOverlay } from "@/hooks/useOverlay";
import { useConfirm } from "@/components/ui/confirm";
import SingleItem, { type CartLine } from "./SingleItem";
import EmptyCart from "./EmptyCart";

const UNDO_MS = 6000;

const CartSidebarModal = () => {
  const { isCartModalOpen: open, closeCartModal } = useCartModalContext();
  const dispatch = useDispatch<AppDispatch>();
  const confirm = useConfirm();
  const cartItems = useAppSelector((state) => state.cartReducer.items) as CartLine[];
  const totalPrice = useSelector(selectTotalPrice);
  const href = useStoreHref();
  const fmt = useStoreMoney();

  const panelRef = useRef<HTMLDivElement>(null);
  const [removed, setRemoved] = useState<CartLine | null>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const count = cartItems.reduce((n, i) => n + i.quantity, 0);

  const clearUndo = useCallback(() => {
    if (undoTimer.current) clearTimeout(undoTimer.current);
    undoTimer.current = null;
    setRemoved(null);
  }, []);

  const onRemove = (item: CartLine) => {
    dispatch(removeItemFromCart(item.id));
    setRemoved(item);
    if (undoTimer.current) clearTimeout(undoTimer.current);
    undoTimer.current = setTimeout(() => setRemoved(null), UNDO_MS);
  };

  const undo = () => {
    if (!removed) return;
    dispatch(addItemToCart({ ...removed }));
    clearUndo();
  };

  // Escape, Tab trap, scroll lock and focus in/out: shared with modals so stacked popups behave
  useOverlay({ open, onClose: closeCartModal, panelRef });

  // forget the undo offer when the drawer closes
  useEffect(() => {
    if (!open) clearUndo();
  }, [open, clearUndo]);
  useEffect(() => () => { if (undoTimer.current) clearTimeout(undoTimer.current); }, []);

  const accent = { background: "var(--brand, #3c50e0)", color: "var(--brand-fg, #fff)" } as React.CSSProperties;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
      aria-hidden={!open}
      inert={!open}
      className={`fixed inset-0 z-99999 ${open ? "visible" : "invisible [transition:visibility_0s_linear_.3s]"}`}
    >
      <div
        onClick={() => closeCartModal()}
        aria-hidden
        className={`absolute inset-0 bg-dark/60 backdrop-blur-[2px] ease-out duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        className={`outline-none absolute right-0 top-0 flex h-full w-full max-w-[460px] flex-col bg-white shadow-1 ease-out duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-gray-3 px-5 py-5 sm:px-7">
          <h2 id="cart-drawer-title" className="font-display text-xl font-bold text-dark sm:text-2xl">
            Your cart{count > 0 && <span className="ml-2 text-base font-medium text-dark-4">({count} {count === 1 ? "item" : "items"})</span>}
          </h2>
          <button
            type="button"
            onClick={() => closeCartModal()}
            aria-label="Close cart"
            className="flex h-10 w-10 items-center justify-center rounded-full text-dark-5 ease-in duration-150 hover:bg-gray-2 hover:text-dark"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 sm:px-7">
          {cartItems.length > 0 ? (
            <>
              <ul className="divide-y divide-gray-3">
                {cartItems.map((item) => (
                  <SingleItem key={item.id} item={item} onRemove={onRemove} />
                ))}
              </ul>
              <div className="py-4 text-right">
                <button
                  type="button"
                  onClick={async () => {
                    if (await confirm({ title: "Clear your cart?", message: "All items will be removed.", confirmLabel: "Clear cart", tone: "danger" })) dispatch(removeAllItemsFromCart());
                  }}
                  className="text-custom-sm underline underline-offset-4 ease-out duration-200 hover:text-dark"
                >
                  Clear cart
                </button>
              </div>
            </>
          ) : (
            <div className="py-12">
              <EmptyCart />
            </div>
          )}
        </div>

        {removed && (
          <div role="status" className="mx-5 mb-3 flex items-center justify-between gap-3 rounded-xl bg-dark px-4 py-3 text-custom-sm text-white sm:mx-7">
            <span className="min-w-0 truncate">Removed {removed.title}</span>
            <button type="button" onClick={undo} className="shrink-0 font-medium underline underline-offset-4">Undo</button>
          </div>
        )}

        {cartItems.length > 0 && (
          <div className="border-t border-gray-3 bg-white px-5 pb-5 pt-5 sm:px-7 sm:pb-7">
            <div className="flex items-center justify-between gap-5">
              <p className="font-medium text-dark">Subtotal</p>
              <p className="font-display text-2xl font-bold text-dark">{fmt(totalPrice)}</p>
            </div>
            <p className="mb-5 mt-1 text-custom-xs">Delivery and any discount code are handled at checkout.</p>

            <div className="flex flex-col gap-3">
              <Link
                onClick={() => closeCartModal()}
                href={href("/checkout")}
                style={accent}
                className="flex w-full justify-center rounded-full px-6 py-[13px] font-medium ease-out duration-200 hover:opacity-90"
              >
                Checkout · {fmt(totalPrice)}
              </Link>
              <div className="flex items-center justify-between gap-4 text-custom-sm">
                <Link onClick={() => closeCartModal()} href={href("/cart")} className="font-medium text-dark underline underline-offset-4">
                  View full cart
                </Link>
                <button type="button" onClick={() => closeCartModal()} className="underline underline-offset-4 ease-out duration-200 hover:text-dark">
                  Continue shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebarModal;
