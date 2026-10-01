"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Foto } from "@/lib/datos";
import { tinte } from "./imagen-placeholder";

// Sin carrusel automático: la foto solo cambia cuando el visitante toca una miniatura, una flecha o desliza.
function Vista({
  foto,
  indice,
  color,
  prioridad = false,
  className = "",
}: {
  foto: Foto;
  indice: number;
  color: string;
  prioridad?: boolean;
  className?: string;
}) {
  if (foto.url) {
    return (
      <Image
        src={foto.url}
        alt={foto.descripcion}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        priority={prioridad}
        className={`object-cover ${className}`}
      />
    );
  }
  // Las fotos de ejemplo alternan un poco el tono para distinguirse entre sí.
  const mezcla = [0, 12, -10, 20, -18, 6, 26, -4][indice % 8];
  return (
    <div
      role="img"
      aria-label={foto.descripcion}
      style={{
        backgroundColor:
          mezcla >= 0
            ? `color-mix(in oklab, ${tinte(color)}, var(--foreground) ${mezcla / 2}%)`
            : `color-mix(in oklab, ${tinte(color)}, var(--background) ${-mezcla}%)`,
      }}
      className={`@container absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center ${className}`}
    >
      <span className="font-serif text-[clamp(1.25rem,30cqw,4rem)] leading-none text-foreground/40">
        {indice + 1}
      </span>
      <span className="max-w-[80%] text-[clamp(0.6rem,4cqw,0.875rem)] text-foreground/60">{foto.descripcion}</span>
    </div>
  );
}

function Flecha({ direccion, onClick, etiqueta, className = "" }: { direccion: "izq" | "der"; onClick: () => void; etiqueta: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={etiqueta}
      className={`flex size-10 items-center justify-center rounded-full bg-background/85 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
        <path d={direccion === "izq" ? "m15 6-6 6 6 6" : "m9 6 6 6-6 6"} />
      </svg>
    </button>
  );
}

export function GaleriaProducto({ fotos, color, nombre }: { fotos: Foto[]; color: string; nombre: string }) {
  const [actual, setActual] = useState(0);
  const [ampliada, setAmpliada] = useState(false);
  const dialogo = useRef<HTMLDialogElement>(null);
  const toque = useRef<number | null>(null);
  const varias = fotos.length > 1;

  const ir = useCallback(
    (paso: number) => setActual((i) => (i + paso + fotos.length) % fotos.length),
    [fotos.length],
  );

  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    if (ampliada && !d.open) d.showModal();
    if (!ampliada && d.open) d.close();
  }, [ampliada]);

  function alTeclear(e: React.KeyboardEvent) {
    if (!varias) return;
    if (e.key === "ArrowLeft") ir(-1);
    if (e.key === "ArrowRight") ir(1);
  }

  const deslizar = {
    onTouchStart: (e: React.TouchEvent) => {
      toque.current = e.touches[0].clientX;
    },
    onTouchEnd: (e: React.TouchEvent) => {
      if (toque.current === null || !varias) return;
      const distancia = e.changedTouches[0].clientX - toque.current;
      toque.current = null;
      if (Math.abs(distancia) > 40) ir(distancia < 0 ? 1 : -1);
    },
  };

  return (
    <div
      className={`aparecer ${varias ? "grid grid-cols-[3.5rem_1fr] gap-3 sm:grid-cols-[4.5rem_1fr] sm:gap-4" : ""}`}
      onKeyDown={alTeclear}
    >
      {varias && (
        // La columna toma la altura de la foto grande; si no caben todas, se desplaza por dentro.
        <div className="relative">
          <ul
            aria-label="Miniaturas"
            className="absolute inset-0 flex flex-col gap-2 overflow-y-auto overscroll-contain p-0.5 [scrollbar-width:thin]"
          >
            {fotos.map((foto, i) => (
              <li key={i} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setActual(i)}
                  aria-label={`Ver foto ${i + 1}: ${foto.descripcion}`}
                  aria-current={i === actual ? "true" : undefined}
                  className={`relative block aspect-square w-full overflow-hidden rounded-md border bg-background transition ${
                    i === actual
                      ? "border-accent ring-2 ring-accent"
                      : "border-line hover:border-foreground/40"
                  }`}
                >
                  <Vista foto={foto} indice={i} color={color} className="[&>span:last-child]:hidden" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div
        role="region"
        aria-roledescription="galería"
        aria-label={`Fotos de ${nombre}`}
        className="relative aspect-[4/5] overflow-hidden rounded-sm"
        {...deslizar}
      >
        <button
          key={actual}
          type="button"
          onClick={() => setAmpliada(true)}
          aria-label={`Ampliar foto ${actual + 1} de ${fotos.length}: ${fotos[actual].descripcion}`}
          className="absolute inset-0 animate-[aparecer-foto_200ms_ease-out] cursor-zoom-in"
        >
          <Vista foto={fotos[actual]} indice={actual} color={color} prioridad={actual === 0} />
        </button>
        {varias && (
          <span aria-live="polite" className="sr-only">
            Foto {actual + 1} de {fotos.length}
          </span>
        )}
      </div>

      <dialog
        ref={dialogo}
        onClose={() => setAmpliada(false)}
        onClick={(e) => e.target === e.currentTarget && setAmpliada(false)}
        aria-label={`Foto ${actual + 1} de ${fotos.length} de ${nombre}`}
        className="m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-black/85"
      >
        {ampliada && (
          <div className="relative flex h-[100dvh] w-screen items-center justify-center p-4 sm:p-12" {...deslizar}>
            <div className="relative aspect-[4/5] max-h-full w-full max-w-[min(100%,calc((100dvh-6rem)*0.8))] overflow-hidden rounded-sm">
              <Vista foto={fotos[actual]} indice={actual} color={color} />
            </div>
            <button
              type="button"
              onClick={() => setAmpliada(false)}
              aria-label="Cerrar"
              autoFocus
              className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="size-5" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
            {varias && (
              <>
                <Flecha direccion="izq" etiqueta="Foto anterior" onClick={() => ir(-1)} className="absolute left-4 top-1/2 -translate-y-1/2" />
                <Flecha direccion="der" etiqueta="Foto siguiente" onClick={() => ir(1)} className="absolute right-4 top-1/2 -translate-y-1/2" />
                <p className="absolute inset-x-0 bottom-4 text-center text-sm text-white/80 tabular-nums">
                  {actual + 1} / {fotos.length} · {fotos[actual].descripcion}
                </p>
              </>
            )}
          </div>
        )}
      </dialog>
    </div>
  );
}
