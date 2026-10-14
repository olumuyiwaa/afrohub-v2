"use client";
import Link from "next/link";
import { useAsync } from "@/hooks/useAsync";
import { getPlatformOverview } from "@/services/platform";
import { Card, CardHeader, ErrorNote, PageHeader, PageLoading, StatCard } from "@/components/saas/Card";
import { AreaSeriesChart, BarSeriesChart, DonutChart } from "@/components/saas/Charts";
import StatusBadge from "@/components/saas/StatusBadge";
import { compact, money, relativeTime } from "@/lib/format";

export default function SuperOverview() {
  const { data, loading, error, reload } = useAsync(getPlatformOverview);
  if (loading) return <PageLoading />;
  if (error || !data) return <ErrorNote message={error ?? "Could not load overview."} onRetry={reload} />;

  return (
    <>
      <PageHeader title="Platform overview" subtitle="How AfroHub is doing across every business." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-6">
        <StatCard label="Monthly recurring revenue" value={money(data.mrr)} change={data.mrrChangePct} hint="vs last month" />
        <StatCard label="Active businesses" value={String(data.activeBusinesses)} hint={`${data.trialBusinesses} on trial · ${data.suspendedBusinesses} suspended`} />
        <StatCard label="New sign-ups (30d)" value={String(data.newSignups30d)} />
        <StatCard label="Churn (30d)" value={`${data.churnRatePct.toFixed(1)}%`} hint={`GMV ${compact(data.gmv)} lifetime`} />
      </div>

      <div className="mt-6 grid grid-cols-12 gap-4 md:gap-6">
        <Card className="col-span-12 xl:col-span-8">
          <CardHeader title="MRR growth" subtitle="Last 12 months" />
          <div className="px-3 pb-4 sm:px-4">
            <AreaSeriesChart data={data.mrrSeries} name="MRR" currency />
          </div>
        </Card>
        <Card className="col-span-12 xl:col-span-4">
          <CardHeader title="Businesses by plan" />
          <div className="px-3 pb-4">
            <DonutChart labels={data.planDistribution.map((p) => p.name)} values={data.planDistribution.map((p) => p.count)} />
          </div>
        </Card>
        <Card className="col-span-12 xl:col-span-5">
          <CardHeader title="New businesses" subtitle="Sign-ups per month" />
          <div className="px-3 pb-4">
            <BarSeriesChart data={data.signupSeries} name="Sign-ups" />
          </div>
        </Card>
        <Card className="col-span-12 xl:col-span-7">
          <CardHeader
            title="Recent sign-ups"
            action={<Link href="/admin/super/businesses" className="text-theme-sm font-medium text-brand-500">View all</Link>}
          />
          <ul className="divide-y divide-gray-100 px-5 pb-3 pt-3 dark:divide-gray-800 sm:px-6">
            {data.recentSignups.map((b) => (
              <li key={b.id}>
                <Link href={`/admin/super/businesses/${b.id}`} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-white" style={{ background: b.brandColor }}>
                      {b.name[0]}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-theme-sm font-medium text-gray-800 dark:text-white/90">{b.name}</p>
                      <p className="truncate text-theme-xs text-gray-500">{b.category} · {b.city}, {b.country}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={b.status} />
                    <span className="hidden text-theme-xs text-gray-400 sm:block">{relativeTime(b.joinedAt)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
