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
import type { Product, ProductStatus } from "@/types/saas";

export default function ProductsPage() {
  const { user } = useAuth();
  const bid = user!.businessId!;
  const { data, loading, error, reload } = useAsync(() => listProducts(bid), [bid]);
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [rowError, setRowError] = useState<string | null>(null);

  if (loading) return <PageLoading />;
  if (error || !data) return <ErrorNote message={error ?? "Could not load products."} onRetry={reload} />;

  const open = (p: Product | "new") => { setFormError(null); setEditing(p); };

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
          <span className="h-10 w-10 shrink-0 rounded-lg" style={{ background: p.imageColor }} />
          <div>
            <p className="font-medium text-gray-800 dark:text-white/90">{p.name}</p>
            <p className="text-theme-xs text-gray-500">{p.sku}</p>
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
    };
    if (!input.name) return setFormError("Product name is required.");
    if (!(input.price >= 0)) return setFormError("Enter a valid price.");
    if (!Number.isInteger(input.stock) || input.stock < 0) return setFormError("Stock must be a whole number, 0 or more.");
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
              <Field label="Stock"><input name="stock" type="number" min="0" defaultValue={p?.stock ?? 0} className={inputCls} /></Field>
            </div>
            <Field label="Status">
              <select name="status" defaultValue={p?.status === "out_of_stock" ? "active" : p?.status ?? "active"} className={inputCls}>
                <option value="active">Active</option>
                <option value="draft">Draft (hidden from store)</option>
              </select>
            </Field>
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
