# Storefront themes

A business picks its storefront theme in **Business admin → Store settings → Storefront theme**.
The id is saved on `Business.theme` and exposed as `PublicStore.theme`; `/s/[slug]/*` routes render through `ThemedPage`, which resolves the active theme and lazy-loads it.

## Add a theme
1. Create `src/themes/<id>/index.ts` exporting a `StoreTheme` (copy `showcase/`).
2. Build the parts you want. Components read data with `useStore()` (store, products, categories, `href()`, `fmt()`); use `ProductItem`/Redux cart actions for cart behaviour.
3. Add it to `THEMES` in `registry.ts`.

Any page, header or footer a theme does not provide falls back to `classic`, so a new theme can ship with just a home page and grow.
Never rename a theme id once shops use it.
