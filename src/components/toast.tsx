"use client";

import { useEffect, useState } from "react";

export function Toast({ mensaje }: { mensaje: string }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm aparecer sm:bottom-6 sm:left-auto sm:right-6">
      <div className="flex items-center gap-3 rounded-sm border border-line bg-foreground px-4 py-3 text-background shadow-lg">
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-5 shrink-0" aria-hidden="true">
          <path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20m0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16m3.5 7l-4 4-2-2" />
        </svg>
        <span className="text-sm font-medium">{mensaje}</span>
      </div>
    </div>
  );
}

let toastState = { mensaje: "", key: 0 };
let listeners: Array<(state: typeof toastState) => void> = [];

export function mostrarToast(mensaje: string) {
  toastState = { mensaje, key: Date.now() };
  listeners.forEach((fn) => fn(toastState));
}

export function useToast() {
  const [state, setState] = useState(toastState);

  useEffect(() => {
    listeners.push(setState);
    return () => {
      listeners = listeners.filter((fn) => fn !== setState);
    };
  }, []);

  return state;
}
