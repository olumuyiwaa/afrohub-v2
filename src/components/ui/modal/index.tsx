"use client";
import React, { useEffect, useId, useRef } from "react";
import { useOverlay } from "@/hooks/useOverlay";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
  showCloseButton?: boolean; // New prop to control close button visibility
  isFullscreen?: boolean; // Default to false for backwards compatibility
  /** "alertdialog" for confirmations that need an answer */
  role?: "dialog" | "alertdialog";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className = "",
  showCloseButton = true, // Default to true for backwards compatibility
  isFullscreen = false,
  role = "dialog",
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const pressedBackdrop = useRef(false);
  const titleId = useId();

  // Escape, focus in/out, Tab trap and scroll lock (stack-aware, so a confirm on top of a modal works)
  useOverlay({ open: isOpen, onClose, panelRef });

  // name the dialog after its first heading so screen readers announce it
  useEffect(() => {
    const panel = panelRef.current;
    if (!isOpen || !panel) return;
    const heading = panel.querySelector<HTMLElement>("h1, h2, h3");
    if (heading) {
      if (!heading.id) heading.id = `modal-title-${titleId}`;
      panel.setAttribute("aria-labelledby", heading.id);
      panel.removeAttribute("aria-label");
    } else {
      panel.setAttribute("aria-label", "Dialog");
    }
  });

  if (!isOpen) return null;

  const contentClasses = isFullscreen
    ? "w-full h-full"
    : "relative w-full rounded-3xl bg-white  dark:bg-gray-900 animate-modal-in";

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-y-auto modal z-99999">
      {!isFullscreen && (
        <div
          aria-hidden
          className="fixed inset-0 h-full w-full bg-gray-900/50 backdrop-blur-sm animate-overlay-in"
          onMouseDown={() => {
            pressedBackdrop.current = true;
          }}
          onClick={() => {
            // only a real click on the backdrop closes it, not a text selection that ended there
            if (pressedBackdrop.current) onClose();
            pressedBackdrop.current = false;
          }}
        ></div>
      )}
      <div
        ref={panelRef}
        role={role}
        aria-modal="true"
        tabIndex={-1}
        className={`${contentClasses} outline-none ${className}`}
        onMouseDown={() => {
          pressedBackdrop.current = false;
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 z-999 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:right-6 sm:top-6 sm:h-11 sm:w-11"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.04289 16.5413C5.65237 16.9318 5.65237 17.565 6.04289 17.9555C6.43342 18.346 7.06658 18.346 7.45711 17.9555L11.9987 13.4139L16.5408 17.956C16.9313 18.3466 17.5645 18.3466 17.955 17.956C18.3455 17.5655 18.3455 16.9323 17.955 16.5418L13.4129 11.9997L17.955 7.4576C18.3455 7.06707 18.3455 6.43391 17.955 6.04338C17.5645 5.65286 16.9313 5.65286 16.5408 6.04338L11.9987 10.5855L7.45711 6.0439C7.06658 5.65338 6.43342 5.65338 6.04289 6.0439C5.65237 6.43442 5.65237 7.06759 6.04289 7.45811L10.5845 11.9997L6.04289 16.5413Z"
                fill="currentColor"
              />
            </svg>
          </button>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};
