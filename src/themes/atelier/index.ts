import type { StoreTheme } from "../types";

/**
 * Atelier: warm, editorial boutique look (cream paper, deep brown ink, big
 * photography, tidy portrait cards). Built for fashion, hair, beauty and
 * jewellery stores that lead with photos. Cart, checkout and order pages
 * use the default theme, restyled by this theme's palette.
 */
const atelier: StoreTheme = {
  id: "atelier",
  name: "Atelier",
  description: "Warm editorial boutique: cream paper, deep brown ink and big portrait photography.",
  swatches: ["#F6EFE7", "#FFFFFF", "#2A1D19"],
  palette: { brand: "#2A1D19", brandFg: "#FFFFFF", ink: "#2A1D19", tint: "#EFE4D8", wash: "#F6EFE7", line: "#E3D6C8", muted: "#6B5A51" },
  header: () => import("./Header"),
  footer: () => import("./Footer"),
  pages: {
    home: () => import("./Home"),
    shop: () => import("./Shop"),
    product: () => import("./Product"),
  },
};
export default atelier;
