// Domain types for the AfroHub SaaS marketplace.
// These mirror what the backend will eventually expose, so the mock services
// in src/services can be swapped for real API calls without touching the UI.

export type Role = "super_admin" | "business_admin";

export type BusinessStatus =
  | "active"
  | "trial"
  | "pending"
  | "suspended"
  | "cancelled";

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "cancelled";

export type BillingCycle = "monthly" | "yearly";

export interface PlanLimits {
  products: number; // -1 = unlimited
  staff: number;
  ordersPerMonth: number;
  storageGb: number;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  transactionFeePct: number;
  limits: PlanLimits;
  features: string[];
  highlighted?: boolean;
  isActive: boolean;
}

export interface BusinessStats {
  products: number;
  orders: number;
  customers: number;
  revenue: number; // lifetime gross merchandise value
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  category: string;
  ownerName: string;
  ownerEmail: string;
  phone: string;
  country: string;
  city: string;
  brandColor: string;
  description: string;
  status: BusinessStatus;
  planId: string;
  joinedAt: string; // ISO
  stats: BusinessStats;
}

export interface Subscription {
  id: string;
  businessId: string;
  planId: string;
  status: SubscriptionStatus;
  cycle: BillingCycle;
  amount: number;
  startedAt: string;
  currentPeriodEnd: string;
  trialEndsAt?: string;
  cancelledAt?: string;
}

export type InvoiceStatus = "paid" | "pending" | "failed" | "refunded";

export interface Invoice {
  id: string;
  businessId: string;
  planId: string;
  description: string;
  amount: number;
  status: InvoiceStatus;
  issuedAt: string;
  paidAt?: string;
}

export type ProductStatus = "active" | "draft" | "out_of_stock";

export interface Product {
  id: string;
  businessId: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  status: ProductStatus;
  sold: number;
  imageColor: string;
  createdAt: string;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus = "paid" | "unpaid" | "refunded";

export interface OrderItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  businessId: string;
  number: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  placedAt: string;
}

export interface Customer {
  id: string;
  businessId: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  orders: number;
  totalSpent: number;
  joinedAt: string;
}

export interface TeamMember {
  id: string;
  businessId: string;
  name: string;
  email: string;
  role: "owner" | "manager" | "staff";
  status: "active" | "invited";
  joinedAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  businessId?: string; // set for business_admin
}

export interface TimeSeriesPoint {
  label: string;
  value: number;
}

export interface PlatformOverview {
  mrr: number;
  mrrChangePct: number;
  activeBusinesses: number;
  trialBusinesses: number;
  suspendedBusinesses: number;
  newSignups30d: number;
  churnRatePct: number;
  gmv: number;
  mrrSeries: TimeSeriesPoint[];
  signupSeries: TimeSeriesPoint[];
  planDistribution: { planId: string; name: string; count: number }[];
  recentSignups: Business[];
  recentInvoices: Invoice[];
}

export interface BusinessOverview {
  revenue30d: number;
  revenueChangePct: number;
  orders30d: number;
  ordersChangePct: number;
  customers: number;
  newCustomers30d: number;
  avgOrderValue: number;
  revenueSeries: TimeSeriesPoint[];
  ordersByStatus: { status: OrderStatus; count: number }[];
  topProducts: Product[];
  lowStock: Product[];
  recentOrders: Order[];
}

export interface BusinessUsage {
  products: { used: number; limit: number };
  staff: { used: number; limit: number };
  ordersThisMonth: { used: number; limit: number };
  storageGb: { used: number; limit: number };
}
