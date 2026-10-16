"use client";
import { useCallback, useEffect, useState } from "react";
import type { Currency, Plan } from "@/types/saas";
import { CURRENCIES, formatCurrency, PER_USD } from "./money";

export { CURRENCIES, formatCurrency } from "./money";

/** Price of a plan for a billing cycle, in the chosen display currency. */
export function planAmount(plan: Plan, cycle: "monthly" | "yearly", currency: Currency): number {
  const usd = cycle === "yearly" ? plan.priceYearly : plan.priceMonthly;
  if (currency === "USD") return usd;
  const local = plan.localPrices?.[currency];
  if (local) return cycle === "yearly" ? local.yearly : local.monthly;
  return usd * PER_USD[currency];
}

export const planPriceLabel = (plan: Plan, cycle: "monthly" | "yearly", currency: Currency) =>
  planAmount(plan, cycle, currency) === 0 ? "Free" : formatCurrency(planAmount(plan, cycle, currency), currency);

const KEY = "retailr:currency";
const EVENT = "retailr:currency-change";

/** Display currency shared across the pricing, sign-up and billing screens. */
export function useCurrency(): [Currency, (c: Currency) => void] {
  const [currency, setCurrency] = useState<Currency>("NGN");

  useEffect(() => {
    const read = () => {
      try {
        const v = window.localStorage.getItem(KEY) as Currency | null;
        if (v && CURRENCIES.some((c) => c.code === v)) setCurrency(v);
      } catch {
        /* storage blocked: keep default */
      }
    };
    read();
    window.addEventListener(EVENT, read);
    return () => window.removeEventListener(EVENT, read);
  }, []);

  const set = useCallback((c: Currency) => {
    setCurrency(c);
    try {
      window.localStorage.setItem(KEY, c);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return [currency, set];
}
