"use client";
import { formatCurrency } from "@/lib/money";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAsync } from "@/hooks/useAsync";
import { getBusinessDetail, setBusinessStatus } from "@/services/platform";
import { Card, CardHeader, ErrorNote, PageLoading, StatCard } from "@/components/saas/Card";
import StatusBadge from "@/components/saas/StatusBadge";
import { DangerButton, OutlineButton, PrimaryButton } from "@/components/saas/Form";
import { money, shortDate } from "@/lib/format";
import { storePath } from "@/lib/store";
import type { BusinessStatus } from "@/types/saas";

export default function BusinessDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error, reload } = useAsync(() => getBusinessDetail(id), [id]);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  if (loading) return <PageLoading />;
  if (error || !data) return <ErrorNote message={error ?? "Business not found."} onRetry={reload} />;
  const { business: b, plan, subscription, invoices, team } = data;

  const change = async (status: BusinessStatus, confirmMsg?: string) => {
    if (confirmMsg && !window.confirm(confirmMsg)) return;
    setBusy(true);
    setActionError(null);
    try {
      await setBusinessStatus(b.id, status);
      reload();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Action failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Link href="/admin/super/businesses" className="text-theme-sm text-gray-500 hover:text-brand-500">← All businesses</Link>
      <div className="mb-6 mt-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-xl text-xl font-semibold text-white" style={{ background: b.brandColor }}>
            {b.name[0]}
          </span>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">{b.name}</h1>
              <StatusBadge status={b.status} />
            </div>
            <p className="text-theme-sm text-gray-500">{b.category} · {b.city}, {b.country} · joined {shortDate(b.joinedAt)}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {(b.status === "pending" || b.status === "trial") && (
            <PrimaryButton busy={busy} onClick={() => change("active")}>Approve & activate</PrimaryButton>
          )}
          {b.status === "suspended" && <PrimaryButton busy={busy} onClick={() => change("active")}>Reinstate</PrimaryButton>}
          {(b.status === "active" || b.status === "trial") && (
            <OutlineButton disabled={busy} onClick={() => change("suspended", `Suspend ${b.name}? Their admins will be unable to sign in.`)}>Suspend</OutlineButton>
          )}
          {b.status !== "cancelled" && (
            <DangerButton disabled={busy} onClick={() => change("cancelled", `Cancel ${b.name}'s subscription?`)}>Cancel subscription</DangerButton>
          )}
        </div>
      </div>
      {actionError && <div className="mb-4"><ErrorNote message={actionError} /></div>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-6">
        <StatCard label="Lifetime sales" value={formatCurrency(b.stats.revenue, b.currency)} />
        <StatCard label="Sales (30d)" value={formatCurrency(data.revenue30d, b.currency)} hint={`${data.orders30d} paid orders`} />
        <StatCard label="Products" value={String(b.stats.products)} />
        <StatCard label="Customers" value={String(b.stats.customers)} />
      </div>

      <div className="mt-6 grid grid-cols-12 gap-4 md:gap-6">
        <Card className="col-span-12 xl:col-span-5">
          <CardHeader title="Owner & contact" />
          <dl className="grid grid-cols-3 gap-y-4 px-5 pb-6 pt-4 text-theme-sm sm:px-6">
            {[
              ["Owner", b.ownerName],
              ["Email", b.ownerEmail],
              ["Phone", b.phone],
            ].map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="text-gray-500">{k}</dt>
                <dd className="col-span-2 break-all text-gray-800 dark:text-white/90">{v}</dd>
              </div>
            ))}
            <dt className="text-gray-500">Storefront</dt>
            <dd className="col-span-2 break-all">
              {b.status === "active" || b.status === "trial" ? (
                <a href={storePath(b.slug)} target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:text-brand-600">
                  {storePath(b.slug)} ↗
                </a>
              ) : (
                <span className="text-gray-500">Offline ({b.status})</span>
              )}
            </dd>
          </dl>
        </Card>

        <Card className="col-span-12 xl:col-span-7">
          <CardHeader title="Subscription" />
          {subscription && plan ? (
            <dl className="grid grid-cols-3 gap-y-4 px-5 pb-6 pt-4 text-theme-sm sm:px-6">
              <dt className="text-gray-500">Plan</dt>
              <dd className="col-span-2 text-gray-800 dark:text-white/90">{plan.name} · {money(subscription.amount)} / {subscription.cycle === "yearly" ? "year" : "month"}</dd>
              <dt className="text-gray-500">Status</dt>
              <dd className="col-span-2"><StatusBadge status={subscription.status} /></dd>
              <dt className="text-gray-500">{subscription.status === "trialing" ? "Trial ends" : "Renews"}</dt>
              <dd className="col-span-2 text-gray-800 dark:text-white/90">{shortDate(subscription.trialEndsAt ?? subscription.currentPeriodEnd)}</dd>
              <dt className="text-gray-500">Started</dt>
              <dd className="col-span-2 text-gray-800 dark:text-white/90">{shortDate(subscription.startedAt)}</dd>
            </dl>
          ) : (
            <p className="px-6 pb-6 pt-4 text-theme-sm text-gray-500">No subscription yet — awaiting approval.</p>
          )}
        </Card>

        <Card className="col-span-12 xl:col-span-5">
          <CardHeader title="Team" subtitle={`${team.length} member${team.length === 1 ? "" : "s"}`} />
          <ul className="divide-y divide-gray-100 px-5 pb-3 pt-3 dark:divide-gray-800 sm:px-6">
            {team.map((m) => (
              <li key={m.id} className="flex items-center justify-between py-3 text-theme-sm">
                <div>
                  <p className="font-medium text-gray-800 dark:text-white/90">{m.name}</p>
                  <p className="text-theme-xs text-gray-500">{m.email}</p>
                </div>
                <span className="capitalize text-gray-500">{m.role}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="col-span-12 xl:col-span-7">
          <CardHeader title="Invoices" />
          {invoices.length === 0 ? (
            <p className="px-6 pb-6 pt-4 text-theme-sm text-gray-500">No invoices yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100 px-5 pb-3 pt-3 dark:divide-gray-800 sm:px-6">
              {invoices.slice(0, 6).map((i) => (
                <li key={i.id} className="flex items-center justify-between gap-3 py-3 text-theme-sm">
                  <div>
                    <p className="text-gray-800 dark:text-white/90">{i.description}</p>
                    <p className="text-theme-xs text-gray-500">{shortDate(i.issuedAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-800 dark:text-white/90">{money(i.amount)}</span>
                    <StatusBadge status={i.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
