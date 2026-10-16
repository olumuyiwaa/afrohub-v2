import React from "react";

/** The Retailr bag-with-a-smile mark, drawn as a vector so it stays sharp at any size (same artwork as the favicon). */
export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 384 384" className={`shrink-0 text-brand-500 ${className}`} role="img" aria-label="Retailr" xmlns="http://www.w3.org/2000/svg">
      <path d="M137.5 125V98.5a52.5 52.5 0 0 1 105 0V125" fill="none" stroke="currentColor" strokeWidth="26" />
      <path d="M112 110H272Q310 110 316 148L343 296Q350 346 298 346H86Q34 346 41 296L68 148Q74 110 112 110Z" fill="currentColor" />
      <path d="M142 252C158 300 226 300 242 252" fill="none" stroke="#fff" strokeWidth="22" strokeLinecap="round" />
    </svg>
  );
}

export default function Logo({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark />
      {!compact && (
        <span className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Retail<span className="text-brand-500">r</span>
        </span>
      )}
    </span>
  );
}
