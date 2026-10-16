"use client";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useAsync } from "@/hooks/useAsync";
import { deleteCoupon, listCoupons, saveCoupon, setCouponStatus } from "@/services/business";
import { ErrorNote, PageHeader, PageLoading } from "@/components/saas/Card";
import DataTable, { type Column } from "@/components/saas/DataTable";
import StatusBadge from "@/components/saas/StatusBadge";
import { Field, inputCls, OutlineButton, PrimaryButton } from "@/components/saas/Form";
import { Modal } from "@/components/ui/modal";
import { money, shortDate } from "@/lib/format";
import type { Coupon } from "@/types/saas";

const effective = (c: Coupon): string =>
  c.status === "disabled" ? "disabled"
  : c.expiresAt && new Date(c.expiresAt).getTime() < Date.now() ? "expired"
  : c.maxUses != null && c.usedCount >= c.maxUses ? "used_up"
  : "active";

export default function CouponsPage() {
  const { user } = useAuth();
  const bid = user!.businessId!;
  const { data, loading, error, reload } = useAsync(() => listCoupons(bid), [bid]);
  const [editing, setEditing] = useState<Coupon | "new" | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [rowError, setRowError] = useState<string | null>(null);

  if (loading) return <PageLoading />;
  if (error || !data) return <ErrorNote message={error ?? "Could not load discounts."} onRetry={reload} />;

  const run = async (fn: () => Promise<unknown>) => {
    setRowError(null);
    try { await fn(); reload(); } catch (e) { setRowError(e instanceof Error ? e.message : "Something went wrong."); }
  };

  const columns: Column<Coupon>[] = [
    { key: "code", header: "Code", sortValue: (c) => c.code, render: (c) => <span className="font-mono font-semibold text-gray-800 dark:text-white/90">{c.code}</span> },
    { key: "value", header: "Discount", render: (c) => (c.type === "percent" ? `${c.value}% off` : `${money(c.value)} off`) },
    { key: "min", header: "Minimum order", render: (c) => (c.minOrder ? money(c.minOrder) : "—") },
    { key: "used", header: "Used", sortValue: (c) => c.usedCount, render: (c) => (c.maxUses != null ? `${c.usedCount} / ${c.maxUses}` : String(c.usedCount)) },
    { key: "exp", header: "Expires", render: (c) => (c.expiresAt ? shortDate(c.expiresAt) : "Never") },
    { key: "status", header: "Status", render: (c) => <StatusBadge status={effective(c)} /> },
    {
      key: "actions", header: "", className: "text-right whitespace-nowrap",
      render: (c) => (
        <div className="flex justify-end gap-4 text-theme-sm font-medium">
          <button className="text-brand-500 hover:text-brand-600" onClick={() => { setFormError(null); setEditing(c); }}>Edit</button>
          <button className="text-gray-600 hover:text-gray-800" onClick={() => run(() => setCouponStatus(bid, c.id, c.status === "active" ? "disabled" : "active"))}>
            {c.status === "active" ? "Disable" : "Enable"}
          </button>
          <button className="text-error-600 hover:text-error-700" onClick={() => window.confirm(`Delete ${c.code}?`) && run(() => deleteCoupon(bid, c.id))}>Delete</button>
        </div>
      ),
    },
  ];

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const num = (k: string) => (String(f.get(k)).trim() === "" ? undefined : Number(f.get(k)));
    const exp = String(f.get("expiresAt"));
    setSaving(true);
    setFormError(null);
    try {
      await saveCoupon(bid, editing && editing !== "new" ? editing.id : null, {
        code: String(f.get("code")),
        type: f.get("type") as Coupon["type"],
        value: Number(f.get("value")),
        minOrder: num("minOrder"),
        maxUses: num("maxUses"),
        expiresAt: exp ? new Date(exp + "T23:59:59").toISOString() : undefined,
      });
      setEditing(null);
      reload();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  };

  const c = editing && editing !== "new" ? editing : null;

  return (
    <>
      <PageHeader title="Discounts" subtitle="Coupon codes your customers can use at checkout." action={<PrimaryButton onClick={() => { setFormError(null); setEditing("new"); }}>+ New coupon</PrimaryButton>} />
      {rowError && <div className="mb-4"><ErrorNote message={rowError} /></div>}
      <DataTable rows={data} columns={columns} rowKey={(x) => x.id} />

      <Modal isOpen={editing !== null} onClose={() => setEditing(null)} className="max-w-[480px] p-6 sm:p-8 m-4">
        <form onSubmit={submit} className="space-y-4" key={c?.id ?? "new"}>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">{c ? "Edit coupon" : "New coupon"}</h3>
          <Field label="Code"><input name="code" defaultValue={c?.code} placeholder="WELCOME10" className={`${inputCls} uppercase`} /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Type">
              <select name="type" defaultValue={c?.type ?? "percent"} className={inputCls}>
                <option value="percent">Percentage</option>
                <option value="fixed">Fixed amount</option>
              </select>
            </Field>
            <Field label="Value"><input name="value" type="number" min="0" step="any" defaultValue={c?.value} className={inputCls} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Minimum order (optional)"><input name="minOrder" type="number" min="0" defaultValue={c?.minOrder} className={inputCls} /></Field>
            <Field label="Max uses (optional)"><input name="maxUses" type="number" min="1" defaultValue={c?.maxUses} className={inputCls} /></Field>
          </div>
          <Field label="Expires (optional)"><input name="expiresAt" type="date" defaultValue={c?.expiresAt?.slice(0, 10)} className={inputCls} /></Field>
          {formError && <ErrorNote message={formError} />}
          <div className="flex justify-end gap-3 pt-2">
            <OutlineButton type="button" onClick={() => setEditing(null)}>Cancel</OutlineButton>
            <PrimaryButton busy={saving}>Save coupon</PrimaryButton>
          </div>
        </form>
      </Modal>
    </>
  );
}
