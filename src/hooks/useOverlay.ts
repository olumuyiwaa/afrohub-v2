"use client";
import { useEffect, useId, useRef, type RefObject } from "react";

// Shared behaviour for anything that sits on top of the page (modals, the cart
// drawer, confirm dialogs): Escape and Tab only act on the top-most one, page
// scroll stays locked until the last one closes, focus moves in on open and
// returns to where it was on close.

const stack: string[] = [];
let locks = 0;
let savedOverflow = "";

const lockScroll = () => {
  if (locks++ === 0) {
    savedOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
};
const unlockScroll = () => {
  if (--locks === 0) document.body.style.overflow = savedOverflow;
};

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
const FIELDS = 'input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled])';

export function useOverlay({ open, onClose, panelRef }: { open: boolean; onClose: () => void; panelRef: RefObject<HTMLElement | null> }) {
  const id = useId();
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const returnTo = document.activeElement as HTMLElement | null;
    stack.push(id);
    lockScroll();
    const isTop = () => stack[stack.length - 1] === id;

    // focus: an element marked data-autofocus, else the first form field, else the first control
    const t = setTimeout(() => {
      const panel = panelRef.current;
      if (!panel || !isTop()) return;
      const target = panel.querySelector<HTMLElement>("[data-autofocus]") ?? panel.querySelector<HTMLElement>(FIELDS) ?? panel.querySelector<HTMLElement>(FOCUSABLE);
      (target ?? panel).focus();
    }, 30);

    const onKey = (e: KeyboardEvent) => {
      if (!isTop()) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeRef.current();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const els = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (els.length === 0) {
        e.preventDefault();
        return;
      }
      const first = els[0];
      const last = els[els.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === panelRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      const i = stack.lastIndexOf(id);
      if (i > -1) stack.splice(i, 1);
      unlockScroll();
      if (returnTo && document.contains(returnTo)) returnTo.focus();
    };
  }, [open, id, panelRef]);
}
