"use client";

import { useState, useEffect } from "react";

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
}

let toastId = 0;
const listeners: Set<(toast: Toast) => void> = new Set();

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handleToast = (toast: Toast) => {
      setToasts((prev) => [...prev, toast]);

      if (toast.duration !== 0) {
        const timer = setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== toast.id));
        }, toast.duration || 3000);

        return () => clearTimeout(timer);
      }
    };

    listeners.add(handleToast);
    return () => listeners.delete(handleToast);
  }, []);

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "info",
    duration?: number
  ) => {
    const toast: Toast = {
      id: `toast-${toastId++}`,
      message,
      type,
      duration,
    };

    listeners.forEach((listener) => listener(toast));
  };

  return { toasts, showToast };
}

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg text-sm font-medium animate-in fade-in slide-in-from-bottom-4 ${
            toast.type === "success"
              ? "bg-status-open text-white"
              : toast.type === "error"
                ? "bg-destructive text-destructive-foreground"
                : "bg-primary text-primary-foreground"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
