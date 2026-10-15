import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type InitialState = {
  items: CartItem[];
  // The business storefront the cart belongs to. A cart only ever holds items
  // from one store; adding from another store starts a fresh cart.
  storeId?: string;
};

type CartItem = {
  id: number | string;
  title: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
  storeId?: string;
  stock?: number;
  color?: string;
};

const initialState: InitialState = {
  items: [],
};

export const cart = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      const { id, title, price, quantity, discountedPrice, imgs, storeId, stock, color } =
        action.payload;

      // switching to a different store: start a fresh cart
      if (storeId && state.storeId && state.storeId !== storeId) {
        state.items = [];
      }
      if (storeId) state.storeId = storeId;

      const cap = (q: number) => (stock !== undefined ? Math.min(q, stock) : q);
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity = cap(existingItem.quantity + quantity);
      } else {
        state.items.push({
          id,
          title,
          price,
          quantity: cap(quantity),
          discountedPrice,
          imgs,
          storeId,
          stock,
          color,
        });
      }
    },
    removeItemFromCart: (state, action: PayloadAction<number | string>) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);
    },
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ id: number | string; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity =
          existingItem.stock !== undefined ? Math.min(quantity, existingItem.stock) : quantity;
      }
    },

    removeAllItemsFromCart: (state) => {
      state.items = [];
    },

    // Called when the visitor lands on a store: drop a cart left over from another one.
    syncCartToStore: (state, action: PayloadAction<string>) => {
      if (state.storeId && state.storeId !== action.payload) {
        state.items = [];
      }
      state.storeId = action.payload;
    },
  },
});

export const selectCartItems = (state: RootState) => state.cartReducer.items;

export const selectTotalPrice = createSelector([selectCartItems], (items) => {
  return items.reduce((total, item) => {
    return total + item.discountedPrice * item.quantity;
  }, 0);
});

export const {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  removeAllItemsFromCart,
  syncCartToStore,
} = cart.actions;
export default cart.reducer;
