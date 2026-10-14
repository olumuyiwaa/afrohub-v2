"use client";
import React from "react";

export const inputCls =
  "h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:disabled:bg-gray-800";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-gray-500">{hint}</span>}
    </label>
  );
}

export function PrimaryButton({
  children,
  busy,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { busy?: boolean }) {
  return (
    <button
      {...rest}
      disabled={busy || rest.disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 py-3 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 disabled:opacity-60 ${rest.className ?? ""}`}
    >
      {busy ? "Saving…" : children}
    </button>
  );
}

export function OutlineButton({ children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-300 transition hover:bg-gray-50 disabled:opacity-60 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] ${rest.className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function DangerButton({ children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-error-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-error-600 disabled:opacity-60 ${rest.className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function UsageBar({ label, used, limit, unit = "" }: { label: string; used: number; limit: number; unit?: string }) {
  const unlimited = limit === -1;
  const pct = unlimited ? 8 : Math.min(100, (used / limit) * 100);
  const hot = !unlimited && pct >= 85;
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-theme-sm">
        <span className="text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-gray-500 dark:text-gray-400">
          {used}
          {unit} / {unlimited ? "Unlimited" : `${limit}${unit}`}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
        <div className={`h-full rounded-full ${hot ? "bg-warning-500" : "bg-brand-500"}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
