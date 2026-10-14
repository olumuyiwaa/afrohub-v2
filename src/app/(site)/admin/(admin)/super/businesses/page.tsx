"use client";
import Link from "next/link";
import { useAsync } from "@/hooks/useAsync";
import { listBusinesses, type BusinessRow } from "@/services/platform";
import { ErrorNote, PageHeader, PageLoading } from "@/components/saas/Card";
import DataTable, { type Column } from "@/components/saas/DataTable";
import StatusBadge, { label } from "@/components/saas/StatusBadge";
import { money, shortDate } from "@/lib/format";

const columns: Column<BusinessRow>[] = [
  {
    key: "name",
    header: "Business",
    sortValue: (b) => b.name,
    render: (b) => (
      <Link href={`/admin/super/businesses/${b.id}`} className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-white" style={{ background: b.brandColor }}>
          {b.name[0]}
        </span>
        <div>
          <p className="font-medium text-gray-800 dark:text-white/90">{b.name}</p>
          <p className="text-theme-xs text-gray-500">{b.ownerEmail}</p>
        </div>
      </Link>
    ),
  },
  { key: "category", header: "Category", render: (b) => b.category },
  { key: "location", header: "Location", render: (b) => `${b.city}, ${b.country}` },
  { key: "plan", header: "Plan", sortValue: (b) => b.planName, render: (b) => b.planName },
  { key: "status", header: "Status", sortValue: (b) => b.status, render: (b) => <StatusBadge status={b.status} /> },
  { key: "mrr", header: "MRR", sortValue: (b) => b.mrr, render: (b) => (b.mrr ? money(b.mrr) : "—") },
  { key: "gmv", header: "Lifetime sales", sortValue: (b) => b.stats.revenue, render: (b) => money(b.stats.revenue) },
  { key: "joined", header: "Joined", sortValue: (b) => b.joinedAt, render: (b) => shortDate(b.joinedAt) },
];

export default function BusinessesPage() {
  const { data, loading, error, reload } = useAsync(listBusinesses);
  if (loading) return <PageLoading />;
  if (error || !data) return <ErrorNote message={error ?? "Could not load businesses."} onRetry={reload} />;

  return (
    <>
      <PageHeader title="Businesses" subtitle={`${data.length} businesses on the platform`} />
      <DataTable
        rows={data}
        columns={columns}
        rowKey={(b) => b.id}
        searchText={(b) => `${b.name} ${b.ownerName} ${b.ownerEmail} ${b.city} ${b.country}`}
        searchPlaceholder="Search businesses, owners, cities…"
        filter={{
          label: "Status",
          options: ["active", "trial", "pending", "suspended", "cancelled"].map((s) => ({ label: label(s), value: s })),
          match: (b, v) => b.status === v,
        }}
      />
    </>
  );
}
