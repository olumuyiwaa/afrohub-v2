// Super admin (platform owner) services.
import type {
  Business,
  BusinessStatus,
  Invoice,
  Plan,
  PlatformOverview,
  Subscription,
  TimeSeriesPoint,
} from "@/types/saas";
import { monthLabel } from "@/lib/format";
import { db, delay, ServiceError } from "./db";

const monthlyValue = (s: Subscription) => (s.cycle === "yearly" ? s.amount / 12 : s.amount);

function mrrAt(date: Date): number {
  return db.subscriptions
    .filter((s) => {
      const start = new Date(s.startedAt);
      if (start > date) return false;
      if (s.status === "trialing") return false;
      if (s.cancelledAt && new Date(s.cancelledAt) < date) return false;
      return true;
    })
    .reduce((sum, s) => sum + monthlyValue(s), 0);
}

export async function getPlatformOverview(): Promise<PlatformOverview> {
  await delay();
  const now = new Date();
  const mrrSeries: TimeSeriesPoint[] = [];
  const signupSeries: TimeSeriesPoint[] = [];
  for (let m = 11; m >= 0; m--) {
    const end = new Date(now.getFullYear(), now.getMonth() - m + 1, 0, 23, 59, 59);
    const start = new Date(now.getFullYear(), now.getMonth() - m, 1);
    const point = m === 0 ? now : end;
    mrrSeries.push({ label: monthLabel(start), value: Math.round(mrrAt(point)) });
    signupSeries.push({
      label: monthLabel(start),
      value: db.businesses.filter((b) => {
        const j = new Date(b.joinedAt);
        return j >= start && j <= end;
      }).length,
    });
  }

  const mrr = mrrSeries[11].value;
  const prev = mrrSeries[10].value || 1;
  const count = (s: BusinessStatus) => db.businesses.filter((b) => b.status === s).length;
  const thirtyAgo = Date.now() - 30 * 86400000;
  const cancelled30 = db.subscriptions.filter((s) => s.cancelledAt && +new Date(s.cancelledAt) > thirtyAgo).length;
  const payingBase = db.subscriptions.filter((s) => s.status !== "trialing").length || 1;

  return {
    mrr,
    mrrChangePct: ((mrr - prev) / prev) * 100,
    activeBusinesses: count("active"),
    trialBusinesses: count("trial"),
    suspendedBusinesses: count("suspended"),
    newSignups30d: db.businesses.filter((b) => +new Date(b.joinedAt) > thirtyAgo).length,
    churnRatePct: (cancelled30 / payingBase) * 100,
    gmv: db.businesses.reduce((s, b) => s + b.stats.revenue, 0),
    mrrSeries,
    signupSeries,
    planDistribution: db.plans.map((p) => ({
      planId: p.id,
      name: p.name,
      count: db.businesses.filter((b) => b.planId === p.id && b.status !== "cancelled" && b.status !== "pending").length,
    })),
    recentSignups: [...db.businesses].sort((a, b) => +new Date(b.joinedAt) - +new Date(a.joinedAt)).slice(0, 6),
    recentInvoices: db.invoices.slice(0, 6),
  };
}

export interface BusinessRow extends Business {
  planName: string;
  mrr: number;
}

export async function listBusinesses(): Promise<BusinessRow[]> {
  await delay();
  return db.businesses.map((b) => {
    const sub = db.subscriptions.find((s) => s.businessId === b.id);
    return {
      ...b,
      planName: db.plans.find((p) => p.id === b.planId)?.name ?? "—",
      mrr: sub && sub.status !== "trialing" && sub.status !== "cancelled" ? monthlyValue(sub) : 0,
    };
  });
}

export interface BusinessDetail {
  business: Business;
  plan?: Plan;
  subscription?: Subscription;
  invoices: Invoice[];
  team: typeof db.team;
  orders30d: number;
  revenue30d: number;
}

export async function getBusinessDetail(id: string): Promise<BusinessDetail> {
  await delay();
  const business = db.businesses.find((b) => b.id === id);
  if (!business) throw new ServiceError("Business not found.");
  const since = Date.now() - 30 * 86400000;
  const recent = db.orders.filter(
    (o) => o.businessId === id && +new Date(o.placedAt) > since && o.paymentStatus === "paid"
  );
  return {
    business,
    plan: db.plans.find((p) => p.id === business.planId),
    subscription: db.subscriptions.find((s) => s.businessId === id),
    invoices: db.invoices.filter((i) => i.businessId === id),
    team: db.team.filter((t) => t.businessId === id),
    orders30d: recent.length,
    revenue30d: recent.reduce((s, o) => s + o.total, 0),
  };
}

export async function setBusinessStatus(id: string, status: BusinessStatus): Promise<Business> {
  await delay(400);
  const biz = db.businesses.find((b) => b.id === id);
  if (!biz) throw new ServiceError("Business not found.");
  biz.status = status;
  const sub = db.subscriptions.find((s) => s.businessId === id);
  if (sub) {
    if (status === "suspended") sub.status = "past_due";
    else if (status === "active") sub.status = "active";
    else if (status === "cancelled") {
      sub.status = "cancelled";
      sub.cancelledAt = new Date().toISOString();
    }
  }
  return { ...biz };
}

export interface SubscriptionRow extends Subscription {
  businessName: string;
  planName: string;
}

export async function listSubscriptions(): Promise<SubscriptionRow[]> {
  await delay();
  return db.subscriptions.map((s) => ({
    ...s,
    businessName: db.businesses.find((b) => b.id === s.businessId)?.name ?? "—",
    planName: db.plans.find((p) => p.id === s.planId)?.name ?? "—",
  }));
}

export interface InvoiceRow extends Invoice {
  businessName: string;
}

export async function listInvoices(): Promise<InvoiceRow[]> {
  await delay();
  return db.invoices.map((i) => ({
    ...i,
    businessName: db.businesses.find((b) => b.id === i.businessId)?.name ?? "—",
  }));
}

export async function listPlans(): Promise<(Plan & { subscribers: number })[]> {
  await delay(250);
  return db.plans.map((p) => ({
    ...p,
    subscribers: db.businesses.filter(
      (b) => b.planId === p.id && b.status !== "cancelled" && b.status !== "pending"
    ).length,
  }));
}

export async function savePlan(plan: Plan): Promise<Plan> {
  await delay(400);
  const i = db.plans.findIndex((p) => p.id === plan.id);
  if (i === -1) db.plans.push(plan);
  else db.plans[i] = plan;
  return plan;
}
