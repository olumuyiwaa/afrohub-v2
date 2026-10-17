/** Suggested product-detail names per business type, shown as one-tap chips in the product form. */
const PRESETS: Record<string, string[]> = {
  "Fashion & Textiles": ["Material", "Fit", "Care", "Origin"],
  "Food & Groceries": ["Weight", "Ingredients", "Shelf life", "Storage"],
  "Beauty & Wellness": ["Hair type", "Texture", "Length", "Density", "Lace", "Cap size", "Skin type", "Ingredients", "Volume"],
  "Crafts & Decor": ["Material", "Dimensions", "Handmade by", "Origin"],
  "Coffee & Tea": ["Origin", "Roast", "Weight", "Tasting notes"],
  Jewellery: ["Material", "Size", "Weight", "Care"],
  Other: ["Material", "Size", "Weight", "Origin"],
};

export const specSuggestions = (businessCategory?: string): string[] => PRESETS[businessCategory ?? ""] ?? PRESETS.Other;
