"use client";
import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { DangerButton, OutlineButton, PrimaryButton } from "@/components/saas/Form";

export interface ConfirmOptions {
  title: string;
  message?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** "danger" for deletes and other things that can't be undone */
  tone?: "default" | "danger";
}

type Confirm = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<Confirm | null>(null);

/** Ask "are you sure?" in a proper dialog: `if (!(await confirm({ title: "Delete it?" }))) return;` */
export function useConfirm(): Confirm {
  const ctx = useContext(ConfirmContext);
  // without a provider, fall back to the browser's own dialog rather than failing
  return ctx ?? (async (o) => window.confirm(typeof o.message === "string" ? `${o.title}\n\n${o.message}` : o.title));
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [req, setReq] = useState<ConfirmOptions | null>(null);
  const pending = useRef<((answer: boolean) => void) | null>(null);

  const confirm = useCallback<Confirm>((options) => {
    pending.current?.(false); // a newer question replaces an unanswered one
    return new Promise<boolean>((resolve) => {
      pending.current = resolve;
      setReq(options);
    });
  }, []);

  const answer = (value: boolean) => {
    pending.current?.(value);
    pending.current = null;
    setReq(null);
  };

  const danger = req?.tone === "danger";

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Modal isOpen={!!req} onClose={() => answer(false)} showCloseButton={false} role="alertdialog" className="m-4 max-w-[420px] p-6 sm:p-7">
        {req && (
          <>
            <div className="flex gap-4">
              <span
                aria-hidden
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xl font-semibold ${
                  danger ? "bg-error-50 text-error-600 dark:bg-error-500/15" : "bg-brand-50 text-brand-500 dark:bg-brand-500/15"
                }`}
              >
                {danger ? "!" : "?"}
              </span>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">{req.title}</h3>
                {req.message && <p className="mt-1.5 text-theme-sm text-gray-500 dark:text-gray-400">{req.message}</p>}
              </div>
            </div>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              {/* the safe choice has focus: Cancel for destructive questions, the action otherwise */}
              <OutlineButton type="button" onClick={() => answer(false)} {...(danger ? { "data-autofocus": true } : {})}>
                {req.cancelLabel ?? "Cancel"}
              </OutlineButton>
              {danger ? (
                <DangerButton type="button" onClick={() => answer(true)}>{req.confirmLabel ?? "Delete"}</DangerButton>
              ) : (
                <PrimaryButton type="button" onClick={() => answer(true)} data-autofocus>{req.confirmLabel ?? "Confirm"}</PrimaryButton>
              )}
            </div>
          </>
        )}
      </Modal>
    </ConfirmContext.Provider>
  );
}
