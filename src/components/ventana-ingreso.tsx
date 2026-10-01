"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { rutaSegura } from "@/lib/rutas";
import { PasosIngreso, type CuentaDemo } from "./pasos-ingreso";
import { mostrarToast } from "./toast";

const EVENTO = "abrir-ingreso";

// Abre la ventana desde cualquier componente; sin destino, el visitante se queda en la página actual.
export function abrirIngreso(volver?: string) {
  window.dispatchEvent(new CustomEvent<string | undefined>(EVENTO, { detail: volver }));
}

function rutaActual() {
  return window.location.pathname + window.location.search;
}

export function VentanaIngreso({
  cuentasDemo,
  contrasenaDemo,
}: {
  cuentasDemo: CuentaDemo[];
  contrasenaDemo: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dialogo = useRef<HTMLDialogElement>(null);
  const [volver, setVolver] = useState("/");
  const [apertura, setApertura] = useState(0);
  const [abierta, setAbierta] = useState(false);

  const abrir = useCallback((destino?: string) => {
    setVolver(rutaSegura(destino ?? rutaActual()));
    setApertura((n) => n + 1);
    setAbierta(true);
  }, []);

  useEffect(() => {
    const alPedir = (e: Event) => abrir((e as CustomEvent<string | undefined>).detail);
    window.addEventListener(EVENTO, alPedir);

    // Cualquier enlace a /ingresar abre la ventana en lugar de cambiar de página.
    const alHacerClic = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const enlace = (e.target as Element | null)?.closest?.("a[href]");
      if (!(enlace instanceof HTMLAnchorElement) || enlace.target === "_blank") return;
      const url = new URL(enlace.href);
      if (url.origin !== window.location.origin || url.pathname !== "/ingresar") return;
      if (window.location.pathname === "/ingresar") return;
      e.preventDefault();
      e.stopPropagation();
      abrir(url.searchParams.get("volver") ?? undefined);
    };
    document.addEventListener("click", alHacerClic, true);

    return () => {
      window.removeEventListener(EVENTO, alPedir);
      document.removeEventListener("click", alHacerClic, true);
    };
  }, [abrir]);

  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    if (abierta && !d.open) d.showModal();
    if (!abierta && d.open) d.close();
  }, [abierta]);

  // Si el visitante navega a otra página con la ventana abierta, se cierra.
  const ruta = `${pathname}?${searchParams}`;
  const [rutaAlAbrir, setRutaAlAbrir] = useState(ruta);
  if (ruta !== rutaAlAbrir) {
    setRutaAlAbrir(ruta);
    setAbierta(false);
  }

  const alIngresar = useCallback(
    ({ nombre, destino }: { nombre: string; destino: string }) => {
      setAbierta(false);
      mostrarToast(`¡Hola, ${nombre.split(" ")[0]}!`);
      if (destino !== rutaActual()) router.push(destino);
      router.refresh();
    },
    [router],
  );

  return (
    <dialog
      ref={dialogo}
      aria-labelledby="titulo-ingreso"
      onClose={() => setAbierta(false)}
      onClick={(e) => e.target === e.currentTarget && setAbierta(false)}
      className="ventana-ingreso m-auto w-[min(26rem,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-xl border border-line bg-background p-0 text-foreground shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      {abierta && (
        <div className="relative p-6 sm:p-8">
          <button
            type="button"
            onClick={() => setAbierta(false)}
            aria-label="Cerrar"
            className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-foreground"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="size-5" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
          <PasosIngreso
            key={apertura}
            volver={volver}
            modo="ventana"
            cuentasDemo={cuentasDemo}
            contrasenaDemo={contrasenaDemo}
            alIngresar={alIngresar}
          />
        </div>
      )}
    </dialog>
  );
}
