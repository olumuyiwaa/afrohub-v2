"use client";
import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface RowAction {
  label: string;
  onClick: () => void;
  tone?: "danger";
  disabled?: boolean;
  /** Leave the item out entirely (e.g. "Remove" for the owner). */
  hidden?: boolean;
}

const MENU_W = 200;

/** Kebab (⋮) button that opens a small menu of actions for a table row. */
export default function RowActions({ actions, label = "Row actions" }: { actions: RowAction[]; label?: string }) {
  const items = actions.filter((a) => !a.hidden);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top?: number; bottom?: number; left: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) btnRef.current?.focus();
  }, []);

  // place the menu under the button, right-aligned; flip above when it would run off the screen
  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const h = items.length * 40 + 16;
    const left = Math.max(8, Math.min(window.innerWidth - MENU_W - 8, r.right - MENU_W));
    setPos(r.bottom + h + 8 > window.innerHeight && r.top > h + 8 ? { bottom: window.innerHeight - r.top + 4, left } : { top: r.bottom + 4, left });
  }, [open, items.length]);

  useEffect(() => {
    if (!open) return;
    const outside = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!menuRef.current?.contains(t) && !btnRef.current?.contains(t)) setOpen(false);
    };
    const away = () => setOpen(false);
    document.addEventListener("mousedown", outside);
    window.addEventListener("resize", away);
    window.addEventListener("scroll", away, true);
    const t = setTimeout(() => menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]:not([disabled])')?.focus(), 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener("mousedown", outside);
      window.removeEventListener("resize", away);
      window.removeEventListener("scroll", away, true);
    };
  }, [open]);

  if (items.length === 0) return null;

  const onMenuKey = (e: React.KeyboardEvent) => {
    const els = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])') ?? []);
    const i = els.indexOf(document.activeElement as HTMLElement);
    const go = (n: number) => { e.preventDefault(); els[(n + els.length) % els.length]?.focus(); };
    if (e.key === "ArrowDown") go(i + 1);
    else if (e.key === "ArrowUp") go(i - 1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(els.length - 1);
    else if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); }
    else if (e.key === "Tab") close(false);
  };

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => { if (e.key === "ArrowDown" && !open) { e.preventDefault(); setOpen(true); } }}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 aria-expanded:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <circle cx="12" cy="5" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="12" cy="19" r="1.8" />
        </svg>
      </button>
      {open && pos && typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-label={label}
            onKeyDown={onMenuKey}
            style={{ position: "fixed", width: MENU_W, left: pos.left, top: pos.top, bottom: pos.bottom }}
            className="z-[99999] rounded-xl border border-gray-200 bg-white p-2 shadow-theme-lg dark:border-gray-800 dark:bg-gray-900"
          >
            {items.map((a) => (
              <button
                key={a.label}
                type="button"
                role="menuitem"
                disabled={a.disabled}
                onClick={() => { close(false); a.onClick(); }}
                className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-theme-sm font-medium transition focus-visible:outline-none disabled:opacity-50 ${
                  a.tone === "danger"
                    ? "text-error-600 hover:bg-error-50 focus-visible:bg-error-50 dark:hover:bg-error-500/10"
                    : "text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5 dark:focus-visible:bg-white/5"
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}
