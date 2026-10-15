export type Product = {
  title: string;
  reviews: number;
  price: number;
  discountedPrice: number;
  // numeric for the static template data, string for tenant (business) products
  id: number | string;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
  // Extra fields used by business storefronts (/s/[slug]). All optional so the
  // static template data keeps working unchanged.
  storeId?: string;
  category?: string;
  description?: string;
  stock?: number;
  color?: string; // placeholder tile colour when a product has no photo
  sku?: string;
  createdAt?: string;
  sold?: number;
};
