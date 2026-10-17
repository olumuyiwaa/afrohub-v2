import type { StoreTheme } from "../types";

/** Retailr's default storefront: clean, rounded, brand-coloured. */
const classic: StoreTheme = {
  id: "classic",
  name: "Classic",
  description: "Soft, rounded and airy, with a big headline hero and your brand colour.",
  swatches: ["#F8F7F4", "#FFFFFF", "#3C50E0"],
  header: () => import("@/components/Store/StoreHeader"),
  footer: () => import("@/components/Footer/StoreFooter"),
  pages: {
    home: () => import("@/components/Store/StoreHome"),
    shop: () => import("@/components/Store/StoreShop"),
    product: () => import("@/components/Store/StoreProductDetails"),
    cart: () => import("@/components/Store/StoreCart"),
    checkout: () => import("@/components/Store/StoreCheckout"),
    order: () => import("@/components/Store/OrderConfirmation"),
    invoice: () => import("@/components/Store/StoreInvoice"),
  },
};
export default classic;
