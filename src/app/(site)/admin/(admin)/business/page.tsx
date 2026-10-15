"use client";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useAsync } from "@/hooks/useAsync";
import { getBusinessOverview, getBusinessProfile } from "@/services/business";
import { storePath } from "@/lib/store";
import { Card, CardHeader, ErrorNote, PageHeader, PageLoading, StatCard } from "@/components/saas/Card";
import { AreaSeriesChart, DonutChart } from "@/components/saas/Charts";
import StatusBadge, { label } from "@/components/saas/StatusBadge";
import { money, relativeTime } from "@/lib/format";

export default function BusinessDashboard() {
  const { user } = useAuth();
  const bid = user!.businessId!;
  const { data, loading, error, reload } = useAsync(() => getBusinessOverview(bid), [bid]);
  const { data: profile } = useAsync(() => getBusinessProfile(bid), [bid]);
  if (loading) return <PageLoading />;
  if (error || !data) return <ErrorNote message={error ?? "Could not load dashboard."} onRetry={reload} />;

  const statusData = data.ordersByStatus.filter((s) => s.count > 0);

  return (
    <>
      <PageHeader
        title={`Welcome back, ${user!.name.split(" ")[0]}`}
        subtitle="Here's how your store is performing."
        action={
          profile && (
            <a
              href={storePath(profile.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 py-3 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
            >
              View my store ↗
            </a>
          )
        }
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-6">
        <StatCard label="Revenue (30d)" value={money(data.revenue30d)} change={data.revenueChangePct} hint="vs previous 30 days" />
        <StatCard label="Orders (30d)" value={String(data.orders30d)} change={data.ordersChangePct} />
        <StatCard label="Customers" value={String(data.customers)} hint={`${data.newCustomers30d} new in 30d`} />
        <StatCard label="Avg. order value" value={money(Math.round(data.avgOrderValue))} />
      </div>

      <div className="mt-6 grid grid-cols-12 gap-4 md:gap-6">
        <Card className="col-span-12 xl:col-span-8">
          <CardHeader title="Revenue" subtitle="Daily, last 30 days" />
          <div className="px-3 pb-4 sm:px-4"><AreaSeriesChart data={data.revenueSeries} name="Revenue" currency /></div>
        </Card>
        <Card className="col-span-12 xl:col-span-4">
          <CardHeader title="Orders by status" />
          <div className="px-3 pb-4">
            {statusData.length ? (
              <DonutChart labels={statusData.map((s) => label(s.status))} values={statusData.map((s) => s.count)} />
            ) : (
              <p className="px-3 py-10 text-center text-theme-sm text-gray-500">No orders yet.</p>
            )}
          </div>
        </Card>

        <Card className="col-span-12 xl:col-span-7">
          <CardHeader title="Recent orders" action={<Link href="/admin/business/orders" className="text-theme-sm font-medium text-brand-500">View all</Link>} />
          {data.recentOrders.length === 0 ? (
            <p className="px-6 py-10 text-center text-theme-sm text-gray-500">Orders will show up here as customers buy.</p>
          ) : (
            <ul className="divide-y divide-gray-100 px-5 pb-3 pt-3 dark:divide-gray-800 sm:px-6">
              {data.recentOrders.map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-3 py-3 text-theme-sm">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white/90">{o.number} · {o.customerName}</p>
                    <p className="text-theme-xs text-gray-500">{relativeTime(o.placedAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-800 dark:text-white/90">{money(o.total)}</span>
                    <StatusBadge status={o.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div className="col-span-12 space-y-4 xl:col-span-5 md:space-y-6">
          <Card>
            <CardHeader title="Top products" />
            <ul className="divide-y divide-gray-100 px-5 pb-3 pt-3 dark:divide-gray-800 sm:px-6">
              {data.topProducts.length === 0 && <li className="py-6 text-center text-theme-sm text-gray-500">No sales yet.</li>}
              {data.topProducts.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-3 text-theme-sm">
                  <div className="flex items-center gap-3">
                    <span className="h-9 w-9 rounded-lg" style={{ background: p.imageColor }} />
                    <span className="text-gray-800 dark:text-white/90">{p.name}</span>
                  </div>
                  <span className="text-gray-500">{p.sold} sold</span>
                </li>
              ))}
            </ul>
          </Card>
          {data.lowStock.length > 0 && (
            <Card>
              <CardHeader title="Low stock" subtitle="Restock soon" />
              <ul className="divide-y divide-gray-100 px-5 pb-3 pt-3 dark:divide-gray-800 sm:px-6">
                {data.lowStock.map((p) => (
                  <li key={p.id} className="flex items-center justify-between py-3 text-theme-sm">
                    <span className="text-gray-800 dark:text-white/90">{p.name}</span>
                    <span className={p.stock === 0 ? "text-error-600" : "text-warning-600"}>{p.stock === 0 ? "Out of stock" : `${p.stock} left`}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
