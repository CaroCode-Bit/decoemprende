"use client";

import { useEffect, useRef, useState } from "react";
import { accionCerrarSesion } from "@/app/acciones";
import { Avatar } from "./avatar";
import { Tooltip } from "./tooltip";

type Props = {
  nombre: string;
  correo: string;
};

export function MenuPerfil({ nombre, correo }: Props) {
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
          <Avatar nombre={nombre} />
        </button>
      </Tooltip>

      {abierto && (
        <div
          id="menu-perfil"
          className="aparecer absolute right-0 top-full z-40 mt-2 w-60 max-w-[calc(100vw-2rem)] rounded-sm border border-line bg-background p-2 shadow-lg"
        >
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar nombre={nombre} />
            <div className="min-w-0">
              <p className="truncate text-sm text-foreground">{nombre}</p>
              <p className="truncate text-xs text-muted">{correo}</p>
            </div>
          </div>
          <div className="my-1 border-t border-line" />
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
