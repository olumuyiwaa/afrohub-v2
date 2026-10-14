"use client";
import Link from "next/link";
import { useAsync } from "@/hooks/useAsync";
import { listInvoices, type InvoiceRow } from "@/services/platform";
import { ErrorNote, PageHeader, PageLoading } from "@/components/saas/Card";
import DataTable, { type Column } from "@/components/saas/DataTable";
import StatusBadge, { label } from "@/components/saas/StatusBadge";
import { money, shortDate } from "@/lib/format";

const columns: Column<InvoiceRow>[] = [
  { key: "id", header: "Invoice", render: (i) => <span className="font-mono text-theme-xs">{i.id.toUpperCase()}</span> },
  {
    key: "biz", header: "Business", sortValue: (i) => i.businessName,
    render: (i) => <Link href={`/admin/super/businesses/${i.businessId}`} className="font-medium text-gray-800 hover:text-brand-500 dark:text-white/90">{i.businessName}</Link>,
  },
  { key: "desc", header: "Description", render: (i) => i.description },
  { key: "amount", header: "Amount", sortValue: (i) => i.amount, render: (i) => money(i.amount) },
  { key: "status", header: "Status", sortValue: (i) => i.status, render: (i) => <StatusBadge status={i.status} /> },
  { key: "date", header: "Issued", sortValue: (i) => i.issuedAt, render: (i) => shortDate(i.issuedAt) },
];

export default function InvoicesPage() {
  const { data, loading, error, reload } = useAsync(listInvoices);
  if (loading) return <PageLoading />;
  if (error || !data) return <ErrorNote message={error ?? "Could not load invoices."} onRetry={reload} />;
  return (
    <>
      <PageHeader title="Invoices" subtitle="Subscription billing across the platform." />
      <DataTable
        rows={data}
        columns={columns}
        rowKey={(i) => i.id}
        searchText={(i) => `${i.businessName} ${i.id} ${i.description}`}
        searchPlaceholder="Search invoices…"
        filter={{
          label: "Status",
          options: ["paid", "pending", "failed", "refunded"].map((s) => ({ label: label(s), value: s })),
          match: (i, v) => i.status === v,
        }}
      />
    </>
  );
}
