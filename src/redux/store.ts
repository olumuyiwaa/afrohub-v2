import { configureStore } from "@reduxjs/toolkit";

import quickViewReducer from "./features/quickView-slice";
import cartReducer from "./features/cart-slice";
import wishlistReducer from "./features/wishlist-slice";
import productDetailsReducer from "./features/product-details";

import { TypedUseSelectorHook, useSelector } from "react-redux";

const CART_KEY = "afrohub:cart:v1";

// The cart survives page refreshes (per browser). Wrapped in try/catch because
// storage can be unavailable (private mode, blocked cookies).
function loadCart() {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.items)) return parsed;
  } catch {
    /* ignore corrupt or blocked storage */
  }
  return undefined;
}

const preloadedCart = loadCart();

export const store = configureStore({
  reducer: {
    quickViewReducer,
    cartReducer,
    wishlistReducer,
    productDetailsReducer,
  },
  preloadedState: preloadedCart ? { cartReducer: preloadedCart } : undefined,
});

if (typeof window !== "undefined") {
  store.subscribe(() => {
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(store.getState().cartReducer));
    } catch {
      /* ignore */
    }
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
