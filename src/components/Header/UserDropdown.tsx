"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useAuth } from "@/app/context/AuthContext";
import { initials } from "@/lib/format";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();
  if (!user) return null;

  const settingsHref =
    user.role === "super_admin" ? "/admin/super/settings" : "/admin/business/settings";

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((p) => !p);
        }}
        className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle"
      >
        <span className="mr-3 flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
          {initials(user.name)}
        </span>
        <span className="hidden sm:block mr-1 font-medium text-theme-sm">{user.name}</span>
        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
        >
          <path d="M4.3125 8.65625L9 13.3437L13.6875 8.65625" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">{user.name}</span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">{user.email}</span>
          <span className="mt-2 inline-block rounded-full bg-brand-50 px-2.5 py-0.5 text-theme-xs font-medium text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
            {user.role === "super_admin" ? "Super admin" : "Business admin"}
          </span>
        </div>
        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <Link
              href={settingsHref}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg text-theme-sm hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
            >
              Settings
            </Link>
          </li>
        </ul>
        <button
          onClick={() => {
            signOut();
            router.replace("/admin/login");
          }}
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg text-left text-theme-sm hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
        >
          Sign out
        </button>
      </Dropdown>
    </div>
  );
}
