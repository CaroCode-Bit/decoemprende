"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Tooltip } from "./tooltip";

type Categoria = { nombre: string; slug: string; total: number };

export function MenuCategorias({ categorias }: { categorias: Categoria[] }) {
  const [abierto, setAbierto] = useState(false);
  const contenedor = useRef<HTMLDivElement>(null);
  const ruta = usePathname();

  useEffect(() => {
    if (!abierto) return;
    function alClicFuera(e: PointerEvent) {
      if (!contenedor.current?.contains(e.target as Node)) setAbierto(false);
    }
    function alTeclear(e: KeyboardEvent) {
      if (e.key === "Escape") setAbierto(false);
    }
    document.addEventListener("pointerdown", alClicFuera);
    document.addEventListener("keydown", alTeclear);
    return () => {
      document.removeEventListener("pointerdown", alClicFuera);
      document.removeEventListener("keydown", alTeclear);
    };
  }, [abierto]);

  return (
    <div ref={contenedor} className="relative">
      <Tooltip texto="Ver categorías" claseBurbuja="lg:hidden">
        <button
          type="button"
          onClick={() => setAbierto((a) => !a)}
          aria-expanded={abierto}
          aria-controls="menu-categorias"
          className="flex h-9 items-center gap-1.5 rounded-full px-2 transition-colors hover:bg-line hover:text-foreground aria-expanded:bg-line aria-expanded:text-foreground sm:px-3"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5" aria-hidden="true">
            <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
            <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
            <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
            <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
          </svg>
          <span className="hidden lg:inline">Categorías</span>
          <span className="sr-only lg:hidden">Categorías</span>
        </button>
      </Tooltip>

      {abierto && (
        <div
          id="menu-categorias"
          className="aparecer absolute right-0 top-full z-40 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-sm border border-line bg-background p-2 shadow-lg"
        >
          <p className="px-3 pb-2 pt-1 text-xs uppercase tracking-widest text-muted">Categorías</p>
          <ul className="max-h-80 overflow-y-auto">
            {categorias.map((c) => {
              const href = `/categoria/${c.slug}`;
              const activa = ruta === href;
              return (
                <li key={c.slug}>
                  <Link
                    href={href}
                    onClick={() => setAbierto(false)}
                    aria-current={activa ? "page" : undefined}
                    className={`flex items-center justify-between rounded-sm px-3 py-2 text-sm transition-colors hover:bg-surface hover:text-foreground ${
                      activa ? "bg-surface text-foreground" : "text-muted"
                    }`}
                  >
                    {c.nombre}
                    <span className="text-xs opacity-60">{c.total}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
