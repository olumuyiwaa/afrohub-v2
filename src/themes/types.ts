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

export interface StoreTheme {
  /** Stable id saved on the business. Never rename it once shops use it. */
  id: string;
  name: string;
  description: string;
  /** Colours for the preview card in settings: [background, surface, accent]. */
  swatches: [string, string, string];
  /** Optional. Lazy-load each part so a store only downloads its own theme. */
  header?: Loader<object>;
  footer?: Loader<object>;
  pages: { [K in ThemePage]?: Loader<ThemePageProps[K]> };
}
