import React from "react";

export default function Logo({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white font-bold text-lg shadow-theme-xs">
        R
      </span>
      {!compact && (
        <span className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Retail<span className="text-brand-500">r</span>
        </span>
      )}
    </span>
  );
}
