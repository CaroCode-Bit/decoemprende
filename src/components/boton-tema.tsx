"use client";

import { aplicarTema } from "@/lib/tema";
import { Tooltip } from "./tooltip";

export function BotonTema() {
  function alternar() {
    aplicarTema(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  }

  return (
    <Tooltip texto="Cambiar tema">
      <button
        type="button"
        onClick={alternar}
        aria-label="Cambiar entre modo claro y oscuro"
        className="flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-line hover:text-foreground active:scale-95"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="size-5 dark:hidden" aria-hidden="true">
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
        </svg>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="hidden size-5 dark:block" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      </button>
    </Tooltip>
  );
}
