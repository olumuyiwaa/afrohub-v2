"use client";
import React from "react";
import { CURRENCIES, useCurrency } from "@/lib/currency";

/** Segmented control for the currency plan prices are shown in. */
export default function CurrencySwitcher({ className = "" }: { className?: string }) {
  const [currency, setCurrency] = useCurrency();
  return (
    <div role="group" aria-label="Currency" className={`inline-flex rounded-lg bg-gray-100 p-1 text-sm dark:bg-white/5 ${className}`}>
      {CURRENCIES.map((c) => (
        <button
          key={c.code}
          type="button"
          aria-pressed={currency === c.code}
          title={c.label}
          onClick={() => setCurrency(c.code)}
          className={`rounded-md px-3 py-1.5 font-medium ${currency === c.code ? "bg-white text-gray-800 shadow-theme-xs dark:bg-gray-800 dark:text-white" : "text-gray-500"}`}
        >
          {c.code}
        </button>
      ))}
    </div>
  );
}
