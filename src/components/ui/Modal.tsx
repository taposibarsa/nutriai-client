"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Modal({
  open,
  title,
  children,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmLoading,
  confirmVariant = "danger",
  onConfirm,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmLoading?: boolean;
  confirmVariant?: "danger" | "primary" | "secondary";
  onConfirm: () => void;
  onClose: () => void;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative z-10 w-full max-w-md rounded-2xl bg-[var(--card)] p-6 shadow-xl"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 id="modal-title" className="text-lg font-bold text-[var(--forest)]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-[var(--warm-gray)] hover:bg-[var(--sage)]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="text-sm text-[var(--warm-gray)]">{children}</div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onClose}
            disabled={confirmLoading}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--forest)] px-4 py-2.5 text-sm font-semibold text-[var(--forest)] transition hover:bg-[var(--sage)] disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            loading={confirmLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
