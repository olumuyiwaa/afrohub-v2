import type { AuthUser, Business, Subscription } from "@/types/saas";
import { DEMO_PASSWORD } from "@/mock/seed";
import { db, delay, ServiceError, uid } from "./db";

export async function login(email: string, password: string): Promise<AuthUser> {
  await delay(500);
  const user = db.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  if (!user || password !== DEMO_PASSWORD) {
    throw new ServiceError("Invalid email or password.");
  }
  if (user.businessId) {
    const biz = db.businesses.find((b) => b.id === user.businessId);
    if (biz?.status === "suspended") {
      throw new ServiceError("This business account is suspended. Contact AfroHub support.");
    }
    if (biz?.status === "cancelled") {
      throw new ServiceError("This business account has been cancelled.");
    }
  }
  return user;
}

export interface RegisterPayload {
  ownerName: string;
  email: string;
  password: string;
  businessName: string;
  category: string;
  country: string;
  city: string;
  phone: string;
  planId: string;
  cycle: "monthly" | "yearly";
}

export async function registerBusiness(p: RegisterPayload): Promise<AuthUser> {
  await delay(900);
  if (db.users.some((u) => u.email.toLowerCase() === p.email.trim().toLowerCase())) {
    throw new ServiceError("An account with this email already exists.");
  }
  const plan = db.plans.find((x) => x.id === p.planId);
  if (!plan) throw new ServiceError("Please choose a plan.");

  const baseSlug = p.businessName.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  let slug = baseSlug || "store";
  let n = 2;
  while (db.businesses.some((b) => b.slug === slug)) slug = `${baseSlug}-${n++}`;

  const now = new Date();
  const biz: Business = {
    id: uid("biz"),
    name: p.businessName,
    slug,
    category: p.category,
    ownerName: p.ownerName,
    ownerEmail: p.email,
    phone: p.phone,
    country: p.country,
    city: p.city,
    brandColor: "#465fff",
    description: "",
    status: "trial",
    planId: plan.id,
    joinedAt: now.toISOString(),
    stats: { products: 0, orders: 0, customers: 0, revenue: 0 },
  };
  db.businesses.unshift(biz);

  const trialEnds = new Date(now.getTime() + 14 * 86400000).toISOString();
  const sub: Subscription = {
    id: uid("sub"),
    businessId: biz.id,
    planId: plan.id,
    status: "trialing",
    cycle: p.cycle,
    amount: p.cycle === "yearly" ? plan.priceYearly : plan.priceMonthly,
    startedAt: now.toISOString(),
    currentPeriodEnd: trialEnds,
    trialEndsAt: trialEnds,
  };
  db.subscriptions.unshift(sub);

  db.team.push({
    id: uid("tm"),
    businessId: biz.id,
    name: p.ownerName,
    email: p.email,
    role: "owner",
    status: "active",
    joinedAt: now.toISOString(),
  });

  const user: AuthUser = {
    id: uid("usr"),
    name: p.ownerName,
    email: p.email,
    role: "business_admin",
    businessId: biz.id,
  };
  db.users.push(user);
  return user;
}
