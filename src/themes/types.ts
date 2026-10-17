import type { ComponentType } from "react";

/** The storefront pages a theme can render. Anything a theme leaves out falls back to the default theme. */
export type ThemePage = "home" | "shop" | "product" | "cart" | "checkout" | "order" | "invoice";

/** Props each page receives (route params the page needs, nothing else; data comes from useStore()). */
export interface ThemePageProps {
  home: object;
  shop: object;
  product: { productId: string };
  cart: object;
  checkout: object;
  order: { orderId: string };
  invoice: { orderId: string };
}

type Loader<P> = () => Promise<{ default: ComponentType<P> }>;

/** CSS colour tokens a theme can fix instead of deriving them from the store's brand colour. */
export interface ThemePalette {
  brand: string;
  brandFg: string;
  ink: string;
  tint: string;
  wash: string;
  line: string;
  muted: string;
}

export interface StoreTheme {
  /** Stable id saved on the business. Never rename it once shops use it. */
  id: string;
  name: string;
  description: string;
  /** Colours for the preview card in settings: [background, surface, accent]. */
  swatches: [string, string, string];
  /** Optional. Fixes the colour tokens (page background, ink, borders...). Omit to follow the store's brand colour. */
  palette?: Partial<ThemePalette>;
  /** Optional. Lazy-load each part so a store only downloads its own theme. */
  header?: Loader<object>;
  footer?: Loader<object>;
  pages: { [K in ThemePage]?: Loader<ThemePageProps[K]> };
}
