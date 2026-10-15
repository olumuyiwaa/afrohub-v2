"use client";
import React from "react";
import Link from "next/link";
import { useStore } from "@/app/context/StoreContext";

/**
 * Wraps every storefront page. Shows a skeleton while the business loads, and a
 * friendly message if the store doesn't exist or isn't live (suspended, cancelled,
 * still pending approval).
 */
export default function StoreGate({ children }: { children: React.ReactNode }) {
  const ctx = useStore();
  const status = ctx?.status ?? "loading";

  if (status === "ready") return <>{children}</>;

  if (status === "loading") {
    return (
      <div className="store-container w-full mx-auto px-4 sm:px-8 xl:px-8 pt-57.5 sm:pt-45 lg:pt-40 xl:pt-56 pb-20" aria-busy="true">
        <div className="h-8 w-64 rounded bg-gray-3 animate-pulse mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7.5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-[270px] rounded-lg bg-gray-3 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="overflow-hidden pt-57.5 sm:pt-45 lg:pt-40 xl:pt-56 pb-24 bg-gray-2 min-h-[70vh]">
      <div className="store-container w-full mx-auto px-4 sm:px-8 xl:px-8 text-center">
        <h1 className="font-semibold text-dark text-2xl xl:text-custom-2 mb-3">
          {status === "unavailable" ? "This store isn't available" : "Something went wrong"}
        </h1>
        <p className="max-w-[480px] mx-auto mb-8">
          {status === "unavailable"
            ? "We couldn't find a live store at this address. It may have moved, been paused, or the link might be mistyped."
            : "We couldn't load this store. Please try again."}
        </p>
        <div className="flex items-center justify-center gap-3">
          {status === "error" && (
            <button
              onClick={() => ctx?.reload()}
              className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark"
            >
              Try again
            </button>
          )}
          <Link
            href="/"
            className="inline-flex font-medium text-white bg-dark py-3 px-7 rounded-md ease-out duration-200 hover:bg-opacity-95"
          >
            Go to AfroHub
          </Link>
        </div>
      </div>
    </section>
  );
}
