import { useEffect, useState } from "react";

/** Path of a business's public storefront. */
export const storePath = (slug: string) => `/s/${slug}`;

/** Full storefront URL for display/copying (needs the browser origin, so it fills in after mount). */
export function useStoreUrl(slug: string | undefined) {
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);
  return slug ? `${origin}${storePath(slug)}` : "";
}
