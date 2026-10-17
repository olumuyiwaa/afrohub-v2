import type { StoreTheme } from "../types";

/**
 * Showcase: the original marketplace-style template (boxed hero, product grid,
 * filter sidebar) driven by the store's own data. Pages not listed here
 * (product, cart, checkout, order, invoice) use the default theme until
 * you build them: add a `pages.product = () => import("./Product")` line.
 */
const showcase: StoreTheme = {
  id: "showcase",
  name: "Showcase",
  description: "Busy marketplace layout: boxed hero, category strip, product grids and a filter sidebar.",
  swatches: ["#E5EAF4", "#FFFFFF", "#3C50E0"],
  header: () => import("./Header"),
  pages: {
    home: () => import("./Home"),
    shop: () => import("./Shop"),
  },
};
export default showcase;
