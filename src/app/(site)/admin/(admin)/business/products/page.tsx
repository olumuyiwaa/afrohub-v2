"use client";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useAsync } from "@/hooks/useAsync";
import { deleteProduct, listProducts, saveProduct, type ProductInput } from "@/services/business";
import { ErrorNote, PageHeader, PageLoading } from "@/components/saas/Card";
import DataTable, { type Column } from "@/components/saas/DataTable";
import StatusBadge from "@/components/saas/StatusBadge";
import { Field, inputCls, OutlineButton, PrimaryButton } from "@/components/saas/Form";
import { Modal } from "@/components/ui/modal";
import { money } from "@/lib/format";
import { fileToDataUrl } from "@/lib/image";
import type { Product, ProductStatus, ProductVariant } from "@/types/saas";

type DraftVariant = { key: string; name: string; price: string; stock: string };
let draftKey = 0;
const toDraft = (v?: ProductVariant): DraftVariant => ({
  key: v?.id ?? `new${++draftKey}`,
  name: v?.name ?? "",
  price: v?.price !== undefined ? String(v.price) : "",
  stock: v ? String(v.stock) : "0",
});

export default function ProductsPage() {
  const { user } = useAuth();
  const bid = user!.businessId!;
  const { data, loading, error, reload } = useAsync(() => listProducts(bid), [bid]);
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [rowError, setRowError] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<DraftVariant[]>([]);

  if (loading) return <PageLoading />;
  if (error || !data) return <ErrorNote message={error ?? "Could not load products."} onRetry={reload} />;

  const open = (p: Product | "new") => {
    setFormError(null);
    setImage(p !== "new" ? p.image ?? null : null);
    setDrafts(p !== "new" ? (p.variants ?? []).map(toDraft) : []);
    setEditing(p);
  };

  const pickPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      setImage(await fileToDataUrl(file));
      setFormError(null);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not use that photo.");
    }
  };

  const setDraft = (key: string, patch: Partial<DraftVariant>) =>
    setDrafts((d) => d.map((v) => (v.key === key ? { ...v, ...patch } : v)));

  const remove = async (p: Product) => {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    setRowError(null);
    try {
      await deleteProduct(bid, p.id);
      reload();
    } catch (e) {
      setRowError(e instanceof Error ? e.message : "Could not delete product.");
    }
  };

  const columns: Column<Product>[] = [
    {
      key: "name", header: "Product", sortValue: (p) => p.name,
      render: (p) => (
        <div className="flex items-center gap-3">
          {p.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.image} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
          ) : (
            <span className="h-10 w-10 shrink-0 rounded-lg" style={{ background: p.imageColor }} />
          )}
          <div>
            <p className="font-medium text-gray-800 dark:text-white/90">{p.name}</p>
            <p className="text-theme-xs text-gray-500">{p.sku}{p.variants?.length ? ` · ${p.variants.length} variants` : ""}</p>
          </div>
        </div>
      ),
    },
    { key: "price", header: "Price", sortValue: (p) => p.price, render: (p) => money(p.price) },
    { key: "stock", header: "Stock", sortValue: (p) => p.stock, render: (p) => p.stock },
    { key: "sold", header: "Sold", sortValue: (p) => p.sold, render: (p) => p.sold },
    { key: "status", header: "Status", sortValue: (p) => p.status, render: (p) => <StatusBadge status={p.status} /> },
    {
      key: "actions", header: "", className: "text-right whitespace-nowrap",
      render: (p) => (
        <div className="flex justify-end gap-3 text-theme-sm">
          <button className="font-medium text-brand-500 hover:text-brand-600" onClick={() => open(p)}>Edit</button>
          <button className="font-medium text-error-600 hover:text-error-700" onClick={() => remove(p)}>Delete</button>
        </div>
      ),
    },
  ];

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const input: ProductInput = {
      name: String(f.get("name")).trim(),
      sku: String(f.get("sku")).trim(),
      category: String(f.get("category")).trim(),
      description: String(f.get("description")).trim(),
      price: Number(f.get("price")),
      stock: Number(f.get("stock")),
      status: f.get("status") as ProductStatus,
      image: image ?? null,
    };
    if (drafts.length) {
      input.variants = drafts.map((d) => ({
        id: d.key.startsWith("new") ? "" : d.key,
        name: d.name,
        stock: Number(d.stock),
        ...(d.price.trim() !== "" ? { price: Number(d.price) } : {}),
      }));
      input.stock = input.variants.reduce((sum, v) => sum + (Number.isFinite(v.stock) ? v.stock : 0), 0);
    }
    if (!input.name) return setFormError("Product name is required.");
    if (!(input.price >= 0)) return setFormError("Enter a valid price.");
    if (!drafts.length && (!Number.isInteger(input.stock) || input.stock < 0)) return setFormError("Stock must be a whole number, 0 or more.");
    setSaving(true);
    setFormError(null);
    try {
      await saveProduct(bid, input, editing !== "new" && editing ? editing.id : undefined);
      setEditing(null);
      reload();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not save product.");
    } finally {
      setSaving(false);
    }
  };

  const p = editing && editing !== "new" ? editing : null;

  return (
    <>
      <PageHeader
        title="Products"
        subtitle={`${data.length} products in your catalogue`}
        action={<PrimaryButton onClick={() => open("new")}>+ Add product</PrimaryButton>}
      />
      {rowError && <div className="mb-4"><ErrorNote message={rowError} /></div>}
      <DataTable
        rows={data}
        columns={columns}
        rowKey={(x) => x.id}
        searchText={(x) => `${x.name} ${x.sku} ${x.category}`}
        searchPlaceholder="Search products or SKU…"
        filter={{
          label: "Status",
          options: [{ label: "Active", value: "active" }, { label: "Draft", value: "draft" }, { label: "Out of stock", value: "out_of_stock" }],
          match: (x, v) => x.status === v,
        }}
        emptyTitle="No products yet"
        emptyBody="Add your first product to start selling."
      />

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} className="max-w-[600px] p-6 sm:p-8 m-4 max-h-[92vh] overflow-y-auto">
        {editing && (
          <form onSubmit={submit} className="space-y-4" key={p?.id ?? "new"}>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">{p ? "Edit product" : "Add product"}</h3>
            <Field label="Name"><input name="name" defaultValue={p?.name} className={inputCls} placeholder="e.g. Adire Wrap Dress" /></Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="SKU"><input name="sku" defaultValue={p?.sku} className={inputCls} /></Field>
              <Field label="Category"><input name="category" defaultValue={p?.category ?? ""} className={inputCls} /></Field>
              <Field label="Price (USD)"><input name="price" type="number" step="0.01" min="0" defaultValue={p?.price ?? ""} className={inputCls} /></Field>
              <Field label={drafts.length ? "Stock (total of variants)" : "Stock"}>
{drafts.length ? (
                  <input aria-label="Total stock" readOnly value={drafts.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)} className={inputCls} />
                ) : (
                  <input name="stock" type="number" min="0" defaultValue={p?.stock ?? 0} className={inputCls} />
                )}
              </Field>
            </div>
            <Field label="Status">
              <select name="status" defaultValue={p?.status === "out_of_stock" ? "active" : p?.status ?? "active"} className={inputCls}>
                <option value="active">Active</option>
                <option value="draft">Draft (hidden from store)</option>
              </select>
            </Field>
            <div>
              <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Photo</span>
              <div className="flex items-center gap-4">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={image} alt="Product preview" className="h-20 w-20 rounded-xl object-cover" />
                ) : (
                  <span className="flex h-20 w-20 items-center justify-center rounded-xl bg-gray-100 text-theme-xs text-gray-400 dark:bg-white/5">No photo</span>
                )}
                <div className="flex flex-wrap gap-2">
                  <label className="inline-flex cursor-pointer items-center rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:text-gray-400 dark:ring-gray-700">
                    {image ? "Replace photo" : "Upload photo"}
                    <input type="file" accept="image/*" aria-label="Product photo" className="sr-only" onChange={pickPhoto} />
                  </label>
                  {image && <button type="button" onClick={() => setImage(null)} className="text-sm font-medium text-error-600">Remove</button>}
                </div>
              </div>
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-400">Variants <span className="font-normal text-gray-400">(size, colour…)</span></span>
                <button type="button" onClick={() => setDrafts((d) => [...d, toDraft()])} className="text-sm font-medium text-brand-500 hover:text-brand-600">+ Add variant</button>
              </div>
              {drafts.length === 0 ? (
                <p className="text-theme-xs text-gray-500">No variants. Add some if shoppers need to pick an option, like a size.</p>
              ) : (
                <ul className="space-y-2">
                  {drafts.map((v) => (
                    <li key={v.key} className="grid grid-cols-[1fr_88px_72px_auto] items-center gap-2">
                      <input aria-label="Variant name" placeholder="e.g. Large / Red" value={v.name} onChange={(e) => setDraft(v.key, { name: e.target.value })} className={inputCls} />
                      <input aria-label="Variant price" type="number" min="0" step="0.01" placeholder="Price" value={v.price} onChange={(e) => setDraft(v.key, { price: e.target.value })} className={inputCls} />
                      <input aria-label="Variant stock" type="number" min="0" value={v.stock} onChange={(e) => setDraft(v.key, { stock: e.target.value })} className={inputCls} />
                      <button type="button" aria-label="Remove variant" onClick={() => setDrafts((d) => d.filter((x) => x.key !== v.key))} className="px-1 text-error-600">✕</button>
                    </li>
                  ))}
                  <li className="text-theme-xs text-gray-500">Leave price empty to use the product price.</li>
                </ul>
              )}
            </div>
            <Field label="Description"><textarea name="description" rows={3} defaultValue={p?.description} className={`${inputCls} h-auto py-3`} /></Field>
            {formError && <ErrorNote message={formError} />}
            <div className="flex justify-end gap-3 pt-2">
              <OutlineButton type="button" onClick={() => setEditing(null)}>Cancel</OutlineButton>
              <PrimaryButton busy={saving}>{p ? "Save changes" : "Add product"}</PrimaryButton>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
