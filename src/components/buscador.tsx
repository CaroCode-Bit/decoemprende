"use client";

import { useSearchParams } from "next/navigation";

export function Buscador() {
  const consulta = useSearchParams().get("q") ?? "";
  return <Formulario key={consulta} consulta={consulta} />;
}

export function Formulario({ consulta = "" }: { consulta?: string }) {
  return (
    <form action="/" role="search" className="relative w-full">
      <label htmlFor="q" className="sr-only">
        Buscar productos o tiendas
      </label>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="6.5" />
        <path d="m20 20-4.2-4.2" />
      </svg>
      <input
        id="q"
        name="q"
        type="search"
        defaultValue={consulta}
        placeholder="Buscar lámparas, cerámica, tiendas…"
        className="w-full rounded-full border border-line bg-surface py-2 pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-foreground"
      />
    </form>
  );
}
