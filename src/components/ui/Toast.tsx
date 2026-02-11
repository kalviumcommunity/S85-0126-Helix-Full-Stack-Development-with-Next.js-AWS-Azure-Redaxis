"use client";

import { useEffect } from "react";

export type ToastVariant = "success" | "error" | "info";

export type ToastMessage = {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
};

export function Toast({
  toast,
  onClose,
  durationMs = 3500,
}: {
  toast: ToastMessage;
  onClose: (id: string) => void;
  durationMs?: number;
}) {
  useEffect(() => {
    const t = setTimeout(() => onClose(toast.id), durationMs);
    return () => clearTimeout(t);
  }, [toast.id, durationMs, onClose]);

  const styles =
    toast.variant === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : toast.variant === "error"
        ? "border-red-200 bg-red-50 text-red-900"
        : "border-gray-200 bg-white text-gray-900";

  return (
    <div
      className={`w-full max-w-sm rounded-xl border px-4 py-3 shadow-lg ${styles}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold">{toast.title}</p>
          {toast.description ? (
            <p className="mt-0.5 text-sm opacity-80">{toast.description}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => onClose(toast.id)}
          className="rounded-md px-2 py-1 text-xs font-semibold opacity-70 hover:opacity-100"
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export function ToastViewport({
  toasts,
  onClose,
}: {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}) {
  return (
    <div className="fixed right-4 top-4 z-[100] flex flex-col gap-3">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onClose={onClose} />
      ))}
    </div>
  );
}

