import React from "react";

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5 sm:px-6 sm:pt-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">{title}</h3>
        {subtitle && <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">{title}</h1>
        {subtitle && <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  change,
  hint,
}: {
  label: string;
  value: string;
  change?: number;
  hint?: string;
}) {
  const up = (change ?? 0) >= 0;
  return (
    <Card className="p-5 sm:p-6">
      <p className="text-theme-sm text-gray-500 dark:text-gray-400">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-2">
        <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">{value}</h4>
        {change !== undefined && (
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
              up
                ? "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500"
                : "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500"
            }`}
          >
            {up ? "▲" : "▼"} {Math.abs(change).toFixed(1)}%
          </span>
        )}
      </div>
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </Card>
  );
}

export function EmptyState({ title, body, action }: { title: string; body?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <p className="text-base font-medium text-gray-800 dark:text-white/90">{title}</p>
      {body && <p className="mt-1 max-w-sm text-theme-sm text-gray-500 dark:text-gray-400">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorNote({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="rounded-xl border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
      {message}{" "}
      {onRetry && (
        <button onClick={onRetry} className="font-medium underline">
          Retry
        </button>
      )}
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="space-y-4" aria-busy="true">
      <div className="h-8 w-56 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
    </div>
  );
}
