"use client";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useAsync } from "@/hooks/useAsync";
import { listOrders, updateOrderStatus } from "@/services/business";
import { ErrorNote, PageHeader, PageLoading } from "@/components/saas/Card";
import DataTable, { type Column } from "@/components/saas/DataTable";
import StatusBadge, { label } from "@/components/saas/StatusBadge";
import { inputCls, OutlineButton } from "@/components/saas/Form";
import { Modal } from "@/components/ui/modal";
import { money, shortDate } from "@/lib/format";
import type { Order, OrderStatus } from "@/types/saas";

const STATUSES: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled", "refunded"];

export default function OrdersPage() {
  const { user } = useAuth();
  const bid = user!.businessId!;
  const { data, loading, error, reload } = useAsync(() => listOrders(bid), [bid]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  if (loading) return <PageLoading />;
  if (error || !data) return <ErrorNote message={error ?? "Could not load orders."} onRetry={reload} />;

  const setStatus = async (status: OrderStatus) => {
    if (!selected) return;
    setBusy(true);
    setActionError(null);
    try {
      const updated = await updateOrderStatus(bid, selected.id, status);
      setSelected(updated);
      reload();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Could not update order.");
    } finally {
      setBusy(false);
    }
  };

  const columns: Column<Order>[] = [
    { key: "no", header: "Order", sortValue: (o) => o.number, render: (o) => <span className="font-medium text-gray-800 dark:text-white/90">{o.number}</span> },
    { key: "cust", header: "Customer", sortValue: (o) => o.customerName, render: (o) => o.customerName },
    { key: "items", header: "Items", render: (o) => o.items.reduce((s, i) => s + i.qty, 0) },
    { key: "total", header: "Total", sortValue: (o) => o.total, render: (o) => money(o.total) },
    { key: "pay", header: "Payment", sortValue: (o) => o.paymentStatus, render: (o) => <StatusBadge status={o.paymentStatus} /> },
    { key: "status", header: "Status", sortValue: (o) => o.status, render: (o) => <StatusBadge status={o.status} /> },
    { key: "date", header: "Placed", sortValue: (o) => o.placedAt, render: (o) => shortDate(o.placedAt) },
  ];

  return (
    <>
      <PageHeader title="Orders" subtitle={`${data.length} orders`} />
      <DataTable
        rows={data}
        columns={columns}
        rowKey={(o) => o.id}
        onRowClick={(o) => { setActionError(null); setSelected(o); }}
        searchText={(o) => `${o.number} ${o.customerName}`}
        searchPlaceholder="Search order # or customer…"
        filter={{ label: "Status", options: STATUSES.map((s) => ({ label: label(s), value: s })), match: (o, v) => o.status === v }}
        emptyTitle="No orders yet"
        emptyBody="Orders from your storefront will appear here."
      />

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} className="max-w-[560px] p-6 sm:p-8 m-4 max-h-[92vh] overflow-y-auto">
        {selected && (
          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">Order {selected.number}</h3>
              <p className="text-theme-sm text-gray-500">{selected.customerName} · {shortDate(selected.placedAt)}</p>
            </div>
            <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
              {selected.items.map((i) => (
                <li key={i.productId} className="flex justify-between px-4 py-3 text-theme-sm">
                  <span className="text-gray-800 dark:text-white/90">{i.qty} × {i.name}</span>
                  <span className="text-gray-600 dark:text-gray-400">{money(i.qty * i.price)}</span>
                </li>
              ))}
              <li className="flex justify-between px-4 py-3 text-theme-sm font-semibold text-gray-800 dark:text-white/90">
                <span>Total</span><span>{money(selected.total)}</span>
              </li>
            </ul>
            <div className="flex items-center gap-3">
              <StatusBadge status={selected.paymentStatus} />
              <StatusBadge status={selected.status} />
            </div>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Update status</span>
              <select disabled={busy} className={inputCls} value={selected.status} onChange={(e) => setStatus(e.target.value as OrderStatus)}>
                {STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
              </select>
            </label>
            {actionError && <ErrorNote message={actionError} />}
            <div className="flex justify-end"><OutlineButton onClick={() => setSelected(null)}>Close</OutlineButton></div>
          </div>
        )}
      </Modal>
    </>
  );
}
