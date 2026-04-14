"use client";

import {
  useEffect,
  useId,
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const sizeStyles = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-5xl",
  full: "max-w-[95vw]",
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (!isOpen) {
      return;
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => {
      if (!overlayRef.current?.contains(document.activeElement)) {
        closeButtonRef.current?.focus();
      }
    }, 60);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === overlayRef.current) {
      onClose();
    }
  };

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          ref={overlayRef}
          onClick={handleOverlayClick}
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 p-3 backdrop-blur-md sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/95 shadow-[0_40px_120px_rgba(15,23,42,0.3)] backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-950/95 ${sizeStyles[size]}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={description ? descriptionId : undefined}
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {(title || description) && (
              <div className="border-b border-slate-200/80 bg-gradient-to-r from-slate-50 to-blue-50/70 px-5 py-4 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900 sm:px-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    {title ? (
                      <h2 id={titleId} className="font-display text-xl font-bold text-slate-900 dark:text-white">
                        {title}
                      </h2>
                    ) : null}
                    {description ? (
                      <p id={descriptionId} className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                        {description}
                      </p>
                    ) : null}
                  </div>

                  <button
                    ref={closeButtonRef}
                    onClick={onClose}
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                    aria-label="Close modal"
                    type="button"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            <div className="max-h-[85vh] overflow-y-auto p-5 sm:p-6">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
