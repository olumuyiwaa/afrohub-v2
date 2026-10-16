"use client";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { getBusinessProfile } from "@/services/business";
import { formatCurrency } from "@/lib/money";
import type { Currency } from "@/types/saas";

// Currency of each business, cached so every admin page can format amounts
// without refetching. Settings calls setBizCurrency() after a change.
const cache = new Map<string, Currency>();
const listeners = new Set<() => void>();

export function setBizCurrency(businessId: string, currency: Currency) {
  cache.set(businessId, currency);
  listeners.forEach((l) => l());
}

/** The signed-in business's selling currency (USD until it has loaded). */
export function useBizCurrency(): Currency {
  const { user } = useAuth();
  const bid = user?.businessId;
  const [, tick] = useState(0);

  useEffect(() => {
    const l = () => tick((n) => n + 1);
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);

  useEffect(() => {
    if (!bid || cache.has(bid)) return;
    getBusinessProfile(bid).then((b) => setBizCurrency(bid, b.currency)).catch(() => {});
  }, [bid]);

  return (bid && cache.get(bid)) || "USD";
}

/** Formats an amount in the signed-in business's currency. */
export function useBizMoney() {
  const currency = useBizCurrency();
  return useCallback((n: number) => formatCurrency(n, currency), [currency]);
}
