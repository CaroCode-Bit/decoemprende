"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { accionCerrarSesion } from "@/app/acciones";
import { Avatar } from "./avatar";
import { Tooltip } from "./tooltip";

export function MenuPerfil({ nombre, foto }: { nombre: string; foto?: string }) {
  const [abierto, setAbierto] = useState(false);
  const contenedor = useRef<HTMLDivElement>(null);

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
      <Tooltip texto={nombre} alinear="fin">
        <button
          type="button"
          onClick={() => setAbierto((a) => !a)}
          aria-expanded={abierto}
          aria-controls="menu-perfil"
          aria-label={`Cuenta de ${nombre}`}
          className="rounded-full transition-transform active:scale-95 aria-expanded:ring-2 aria-expanded:ring-foreground/30"
        >
          <Avatar nombre={nombre} foto={foto} />
        </button>
      </Tooltip>

      {abierto && (
        <div
          id="menu-perfil"
          className="aparecer absolute right-0 top-full z-40 mt-2 w-60 max-w-[calc(100vw-2rem)] rounded-sm border border-line bg-background p-2 shadow-lg"
        >
          <Link
            href="/perfil"
            onClick={() => setAbierto(false)}
            className="group flex items-center gap-3 rounded-sm px-3 py-2 transition-colors hover:bg-surface"
          >
            <Avatar nombre={nombre} foto={foto} />
            <div className="min-w-0">
              <p className="truncate text-sm text-foreground">{nombre}</p>
              <p className="text-xs text-muted transition-colors group-hover:text-foreground">
                Ver perfil →
              </p>
            </div>
          </Link>
          <div className="my-1 border-t border-line" />
          <Link
            href="/configuracion"
            onClick={() => setAbierto(false)}
            className="flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm text-muted transition-colors hover:bg-surface hover:text-foreground"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
            </svg>
            Configuración
          </Link>
          <form action={accionCerrarSesion}>
            <button
              type="submit"
              className="flex w-full items-center gap-2.5 rounded-sm px-3 py-2 text-left text-sm text-muted transition-colors hover:bg-surface hover:text-foreground"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
                <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
                <path d="M10 16l-4-4 4-4" />
                <path d="M6 12h10" />
              </svg>
              Cerrar sesión
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
