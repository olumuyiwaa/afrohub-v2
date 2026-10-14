import React from "react";

export default function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent ${className}`}
    />
  );
}
