"use client";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useAsync } from "@/hooks/useAsync";
import { useConfirm } from "@/components/ui/confirm";
import { Modal } from "@/components/ui/modal";
import { createCategory, deleteCategory, listCategories, updateCategory, type CategoryWithCount } from "@/services/business";
import { ErrorNote, PageHeader, PageLoading } from "@/components/saas/Card";
import DataTable, { type Column } from "@/components/saas/DataTable";
import RowActions from "@/components/saas/RowActions";
import { fileToDataUrl } from "@/lib/image";
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
  /** Picture being edited in the modal: a data URL/path, or null for none. */
  const [picture, setPicture] = useState<string | null>(null);
  const [pictureBusy, setPictureBusy] = useState(false);
  const openEditor = (c: CategoryWithCount | "new") => {
    setFormError(null);
    setPicture(c === "new" ? null : c.image ?? null);
    setEditing(c);
  };
  const pickPicture = async (file: File) => {
    setFormError(null);
    setPictureBusy(true);
    try {
      setPicture(await fileToDataUrl(file, 720, 0.82));
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Could not read that image.");
    } finally {
      setPictureBusy(false);
    }
  };

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
    {
      key: "image", header: "", className: "w-16",
      render: (c) =>
        c.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={c.image} alt="" className="h-11 w-11 rounded-lg object-cover" />
        ) : (
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 text-theme-xs text-gray-400 dark:bg-white/5" aria-label="No picture">—</span>
        ),
    },
    { key: "name", header: "Category", sortValue: (c) => c.name, render: (c) => <span className="font-medium text-gray-800 dark:text-white/90">{c.name}</span> },
    { key: "n", header: "Products", sortValue: (c) => c.productCount, render: (c) => c.productCount },
    {
      key: "actions", header: "", className: "text-right whitespace-nowrap",
      render: (c) => (
        <RowActions
          label={`Actions for ${c.name}`}
          actions={[
            { label: "Edit", onClick: () => openEditor(c) },
            { label: "Delete", tone: "danger", onClick: () => remove(c) },
          ]}
        />
      ),
    },
  ];

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = String(new FormData(e.currentTarget).get("name"));
    setSaving(true);
    setFormError(null);
    try {
      if (editing && editing !== "new") await updateCategory(bid, editing.id, { name, image: picture });
      else await createCategory(bid, name, picture ?? undefined);
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
        action={<PrimaryButton type="button" onClick={() => openEditor("new")}>Add category</PrimaryButton>}
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
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">{editing === "new" ? "Add category" : "Edit category"}</h3>
            <Field label="Name">
              <input name="name" autoFocus defaultValue={editing === "new" ? "" : editing.name} className={inputCls} placeholder="e.g. Dresses" maxLength={40} />
            </Field>
            <div>
              <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Picture</span>
              <div className="flex items-center gap-4">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-white/5">
                  {picture ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={picture} alt="Category picture" className="h-full w-full object-cover" />
                  ) : (
                    <span className="px-2 text-center text-theme-xs text-gray-400">No picture</span>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <label className={`inline-flex cursor-pointer items-center rounded-lg px-3.5 py-2 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:text-gray-400 dark:ring-gray-700 ${pictureBusy ? "pointer-events-none opacity-60" : ""}`}>
                      {pictureBusy ? "Processing…" : picture ? "Replace" : "Upload picture"}
                      <input
                        type="file"
                        accept="image/*"
                        aria-label="Category picture"
                        className="sr-only"
                        disabled={pictureBusy}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          e.target.value = "";
                          if (file) pickPicture(file);
                        }}
                      />
                    </label>
                    {picture && !pictureBusy && (
                      <button type="button" onClick={() => setPicture(null)} className="text-sm font-medium text-error-600 hover:text-error-700">Remove</button>
                    )}
                  </div>
                  <p className="text-theme-xs text-gray-500">Shown on your storefront. Without one, a product photo from this category is used.</p>
                </div>
              </div>
            </div>
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
