"use client";
import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import { Card } from "./Card";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

/* ---------- account / platform alert strip ---------- */

const TONES = {
  red: "border-error-200 bg-error-50 text-error-800 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-300",
  amber: "border-warning-200 bg-warning-50 text-warning-800 dark:border-warning-500/30 dark:bg-warning-500/10 dark:text-warning-300",
  blue: "border-brand-200 bg-brand-50 text-brand-800 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300",
};

export function AlertBanner({
  tone,
  children,
  action,
}: {
  tone: keyof typeof TONES;
  children: React.ReactNode;
  action?: { href: string; label: string };
}) {
  return (
    <div role="alert" className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border px-4 py-3 text-theme-sm ${TONES[tone]}`}>
      <span>{children}</span>
      {action && (
        <Link href={action.href} className="font-semibold underline underline-offset-2">
          {action.label}
        </Link>
      )}
    </div>
  );
}

/* ---------- KPI tile: the whole card is a link, with an optional status chip ---------- */

export function KpiTile({
  label,
  value,
  hint,
  href,
  chip,
  chipTone = "neutral",
}: {
  label: string;
  value: string;
  hint?: string;
  href?: string;
  chip?: string;
  chipTone?: "neutral" | "good" | "warn" | "bad";
}) {
  const chipCls = {
    neutral: "bg-gray-100 text-gray-600 dark:bg-white/[0.06] dark:text-gray-300",
    good: "bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-400",
    warn: "bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400",
    bad: "bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-400",
  }[chipTone];

  const body = (
    <>
      <div className="flex items-start justify-between gap-2">
        <p className="text-theme-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        {chip && <span className={`shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-theme-xs font-medium ${chipCls}`}>{chip}</span>}
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white/90">{value}</p>
      {hint && <p className="mt-1 text-theme-xs text-gray-500 dark:text-gray-400">{hint}</p>}
    </>
  );
  const cls = "block rounded-2xl border border-gray-200 bg-white p-5 transition dark:border-gray-800 dark:bg-white/[0.03]";
  return href ? (
    <Link href={href} className={`${cls} hover:border-brand-300 hover:shadow-theme-md dark:hover:border-brand-500/40`}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

/* ---------- panel with a title and a link in the corner ---------- */

export function Panel({
  title,
  subtitle,
  action,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  action?: { href: string; label: string };
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={`p-5 sm:p-6 ${className}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">{title}</h2>
          {subtitle && <p className="mt-0.5 text-theme-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
        {action && (
          <Link href={action.href} className="shrink-0 text-theme-sm font-medium text-brand-500 hover:text-brand-600">
            {action.label}
          </Link>
        )}
      </div>
      {children}
    </Card>
  );
}

export const PanelEmpty = ({ children }: { children: React.ReactNode }) => (
  <p className="py-6 text-center text-theme-sm text-gray-500 dark:text-gray-400">{children}</p>
);

/* ---------- strip of small stats ---------- */

export function MiniStats({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:grid-cols-4 sm:divide-x sm:divide-gray-100 dark:sm:divide-gray-800">
      {items.map((i, n) => (
        <div key={i.label} className={n > 0 ? "sm:pl-5" : ""}>
          <p className="text-theme-xs text-gray-500 dark:text-gray-400">{i.label}</p>
          <p className="mt-1 text-lg font-semibold text-gray-800 dark:text-white/90">{i.value}</p>
        </div>
      ))}
    </div>
  );
}

/* ---------- half-circle gauge with three figures underneath ---------- */

export function Gauge({
  title,
  subtitle,
  pct,
  note,
  stats,
  action,
}: {
  title: string;
  subtitle?: string;
  pct: number;
  note?: string;
  stats: { label: string; value: string }[];
  action?: { href: string; label: string };
}) {
  const value = Math.max(0, Math.min(100, Math.round(pct * 10) / 10));
  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: { fontFamily: "Outfit, sans-serif", type: "radialBar", height: 280, sparkline: { enabled: true } },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: { size: "76%" },
        track: { background: "#E4E7EC", strokeWidth: "100%" },
        dataLabels: {
          name: { show: false },
          value: { fontSize: "34px", fontWeight: "600", offsetY: -6, color: "#1D2939", formatter: (v) => `${v}%` },
        },
      },
    },
    stroke: { lineCap: "round" },
    labels: ["Progress"],
  };
  return (
    <Card>
      <div className="p-5 pb-2 sm:p-6 sm:pb-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">{title}</h2>
            {subtitle && <p className="mt-0.5 text-theme-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
          </div>
          {action && (
            <Link href={action.href} className="shrink-0 text-theme-sm font-medium text-brand-500 hover:text-brand-600">
              {action.label}
            </Link>
          )}
        </div>
        <div className="-mb-12 mt-2 h-[190px] overflow-hidden">
          <ReactApexChart options={options} series={[value]} type="radialBar" height={280} />
        </div>
        {note && <p className="mx-auto mt-3 max-w-[300px] pb-4 text-center text-theme-sm text-gray-500 dark:text-gray-400">{note}</p>}
      </div>
      <div className="flex items-center justify-center gap-5 border-t border-gray-100 px-5 py-4 dark:border-gray-800 sm:gap-8">
        {stats.map((s, i) => (
          <React.Fragment key={s.label}>
            {i > 0 && <div className="h-7 w-px bg-gray-200 dark:bg-gray-800" />}
            <div className="text-center">
              <p className="text-theme-xs text-gray-500 dark:text-gray-400">{s.label}</p>
              <p className="mt-0.5 text-base font-semibold text-gray-800 dark:text-white/90">{s.value}</p>
            </div>
          </React.Fragment>
        ))}
      </div>
    </Card>
  );
}

/* ---------- grid of shortcut links ---------- */

export function QuickLinks({ items }: { items: { href: string; label: string; hint: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {items.map((a) => (
        <Link
          key={a.href + a.label}
          href={a.href}
          className="rounded-xl border border-gray-200 px-3.5 py-3 transition hover:border-brand-300 hover:bg-brand-25 dark:border-gray-800 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/5"
        >
          <p className="text-theme-sm font-medium text-gray-800 dark:text-white/90">{a.label}</p>
          <p className="mt-0.5 text-theme-xs text-gray-500">{a.hint}</p>
        </Link>
      ))}
    </div>
  );
}

/* ---------- getting-started checklist ---------- */

export interface SetupStep {
  key: string;
  title: string;
  hint: string;
  done: boolean;
  href: string;
  cta: string;
}

export function SetupChecklist({ steps }: { steps: SetupStep[] }) {
  const done = steps.filter((s) => s.done).length;
  const next = steps.find((s) => !s.done);
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5 sm:px-6 sm:pt-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">Get your store ready</h2>
          <p className="mt-0.5 text-theme-sm text-gray-500 dark:text-gray-400">
            {done} of {steps.length} done
          </p>
        </div>
        <div className="h-2 w-full max-w-[220px] overflow-hidden rounded-full bg-gray-100 dark:bg-white/[0.06]" role="progressbar" aria-valuenow={done} aria-valuemin={0} aria-valuemax={steps.length}>
          <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${(done / steps.length) * 100}%` }} />
        </div>
      </div>
      <ul className="mt-3 divide-y divide-gray-100 dark:divide-gray-800">
        {steps.map((s) => (
          <li key={s.key} className="flex items-center gap-4 px-5 py-3.5 sm:px-6">
            <span
              aria-hidden
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                s.done ? "bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-400" : "border border-gray-300 text-transparent dark:border-gray-700"
              }`}
            >
              ✓
            </span>
            <div className="min-w-0 flex-1">
              <p className={`text-theme-sm font-medium ${s.done ? "text-gray-400 line-through dark:text-gray-500" : "text-gray-800 dark:text-white/90"}`}>{s.title}</p>
              {!s.done && <p className="text-theme-xs text-gray-500 dark:text-gray-400">{s.hint}</p>}
            </div>
            {!s.done && (
              <Link
                href={s.href}
                className={`shrink-0 rounded-lg px-3.5 py-1.5 text-theme-sm font-medium ${
                  next?.key === s.key ? "bg-brand-500 text-white hover:bg-brand-600" : "border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.04]"
                }`}
              >
                {s.cta}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}
