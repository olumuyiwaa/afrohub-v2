"use client";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useAsync } from "@/hooks/useAsync";
import { useConfirm } from "@/components/ui/confirm";
import { Modal } from "@/components/ui/modal";
import { createCategory, deleteCategory, listCategories, renameCategory, type CategoryWithCount } from "@/services/business";
import { ErrorNote, PageHeader, PageLoading } from "@/components/saas/Card";
import DataTable, { type Column } from "@/components/saas/DataTable";
import { Field, inputCls, OutlineButton, PrimaryButton } from "@/components/saas/Form";

export default function CategoriesPage() {
  const { user } = useAuth();
  const confirm = useConfirm();
  const bid = user!.businessId!;
  const { data, loading, error, reload } = useAsync(() => listCategories(bid), [bid]);
  const [editing, setEditing] = useState<CategoryWithCount | "new" | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [rowError, setRowError] = useState<string | null>(null);

  if (loading) return <PageLoading />;
  if (error || !data) return <ErrorNote message={error ?? "Could not load categories."} onRetry={reload} />;

  const remove = async (c: CategoryWithCount) => {
    const ok = await confirm({
      title: `Delete “${c.name}”?`,
      message: c.productCount
        ? `${c.productCount} product${c.productCount === 1 ? "" : "s"} will stay on sale but have no category.`
        : "No products use this category.",
      confirmLabel: "Delete category",
      tone: "danger",
    });
    if (!ok) return;
    setRowError(null);
    try { await deleteCategory(bid, c.id); reload(); } catch (e) { setRowError(e instanceof Error ? e.message : "Could not delete."); }
  };

  const columns: Column<CategoryWithCount>[] = [
    { key: "name", header: "Category", sortValue: (c) => c.name, render: (c) => <span className="font-medium text-gray-800 dark:text-white/90">{c.name}</span> },
    { key: "n", header: "Products", sortValue: (c) => c.productCount, render: (c) => c.productCount },
    {
      key: "actions", header: "", className: "text-right whitespace-nowrap",
      render: (c) => (
        <div className="flex justify-end gap-4 text-theme-sm font-medium">
          <button className="text-brand-500 hover:text-brand-600" onClick={() => { setFormError(null); setEditing(c); }}>Rename</button>
          <button className="text-error-600 hover:text-error-700" onClick={() => remove(c)}>Delete</button>
        </div>
      ),
    },
  ];

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = String(new FormData(e.currentTarget).get("name"));
    setSaving(true);
    setFormError(null);
    try {
      if (editing && editing !== "new") await renameCategory(bid, editing.id, name);
      else await createCategory(bid, name);
      setEditing(null);
      reload();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Categories"
        subtitle="Group your products so shoppers can browse them. Only categories with products on sale appear in your store."
        action={<PrimaryButton type="button" onClick={() => { setFormError(null); setEditing("new"); }}>Add category</PrimaryButton>}
      />
      {rowError && <div className="mb-4"><ErrorNote message={rowError} /></div>}
      <DataTable
        rows={data}
        columns={columns}
        rowKey={(c) => c.id}
        searchText={(c) => c.name}
        emptyTitle="No categories yet"
        emptyBody="Add your first category, then choose it when you add or edit a product."
      />
      <Modal isOpen={!!editing} onClose={() => setEditing(null)} className="max-w-[440px] p-6 sm:p-8 m-4">
        {editing && (
          <form onSubmit={submit} className="space-y-4" key={editing === "new" ? "new" : editing.id}>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">{editing === "new" ? "Add category" : "Rename category"}</h3>
            <Field label="Name">
              <input name="name" autoFocus defaultValue={editing === "new" ? "" : editing.name} className={inputCls} placeholder="e.g. Dresses" maxLength={40} />
            </Field>
            {editing !== "new" && editing.productCount > 0 && (
              <p className="text-theme-xs text-gray-500">The {editing.productCount} product{editing.productCount === 1 ? "" : "s"} in this category will move to the new name.</p>
            )}
            {formError && <ErrorNote message={formError} />}
            <div className="flex justify-end gap-3">
              <OutlineButton type="button" onClick={() => setEditing(null)}>Cancel</OutlineButton>
              <PrimaryButton busy={saving}>{editing === "new" ? "Add category" : "Save"}</PrimaryButton>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
