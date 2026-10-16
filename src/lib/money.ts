import type { Currency } from "@/types/saas";

export const CURRENCIES: { code: Currency; symbol: string; label: string; locale: string }[] = [
  { code: "NGN", symbol: "₦", label: "Naira", locale: "en-NG" },
  { code: "GHS", symbol: "GH₵", label: "Cedi", locale: "en-GH" },
  { code: "KES", symbol: "KSh", label: "Shilling", locale: "en-KE" },
  { code: "USD", symbol: "$", label: "US dollar", locale: "en-US" },
];

// Rough demo rates (units of currency per 1 USD).
export const PER_USD: Record<Currency, number> = { USD: 1, NGN: 1500, GHS: 15, KES: 150 };

/** Formats an amount in a currency, e.g. ₦12,500 or $72.90. Whole numbers have no decimals. */
export function formatCurrency(amount: number, currency: Currency = "USD"): string {
  const c = CURRENCIES.find((x) => x.code === currency) ?? CURRENCIES[3];
  const whole = Math.abs(amount % 1) < 0.005;
  return `${amount < 0 ? "−" : ""}${c.symbol}${Math.abs(amount).toLocaleString(c.locale, {
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  })}`;
}

export const toUsd = (amount: number, currency: Currency = "USD") => amount / PER_USD[currency];

/** Default store currency for a country. */
export function currencyForCountry(country: string): Currency {
  const c = country.trim().toLowerCase();
  if (c === "nigeria") return "NGN";
  if (c === "ghana") return "GHS";
  if (c === "kenya") return "KES";
  return "USD";
}
