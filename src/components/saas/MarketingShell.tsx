import React from "react";
import Link from "next/link";
import Logo from "./Logo";

/** Content width shared by every marketing section so header, body and footer line up. */
export const MARKETING_WIDTH = "mx-auto w-full max-w-[1360px] px-5 sm:px-8 lg:px-12";

export default function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white font-outfit text-gray-800">
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur">
        <div className={`${MARKETING_WIDTH} flex h-16 items-center justify-between lg:h-[72px]`}>
          <Link href="/"><Logo /></Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-gray-600 md:flex">
            <a href="/#features" className="hover:text-brand-500">Features</a>
            <a href="/#how" className="hover:text-brand-500">How it works</a>
            <a href="/#pricing" className="hover:text-brand-500">Pricing</a>
          </nav>
          <div className="flex items-center gap-3 text-sm font-medium">
            <Link href="/admin/login" className="px-3 py-2 text-gray-600 hover:text-brand-500">Sign in</Link>
            <Link href="/get-started" className="rounded-lg bg-brand-500 px-4 py-2.5 text-white shadow-theme-xs hover:bg-brand-600">Start free trial</Link>
          </div>
        </div>
      </header>
      {children}
      <footer className="border-t border-gray-100 bg-gray-50">
        <div className={`${MARKETING_WIDTH} flex flex-col items-start justify-between gap-6 py-10 sm:flex-row sm:items-center`}>
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-gray-500">The home for African small businesses online.</p>
          </div>
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} Retailr. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
