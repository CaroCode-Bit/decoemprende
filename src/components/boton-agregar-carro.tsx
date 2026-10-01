"use client";

import { useTransition } from "react";
import { accionAgregarAlCarro } from "@/app/acciones";
import { IconoCarro } from "./icono-carro";
import { mostrarToast } from "./toast";

type Props = {
  tienda: string;
  producto: string;
  disponible: boolean;
};

export function BotonAgregarCarro({ tienda, producto, disponible }: Props) {
  const [enviando, iniciar] = useTransition();

  if (!disponible) {
    return (
      <p className="mt-3 border border-line px-3 py-2 text-center text-sm text-muted">
        Agotado por ahora
      </p>
    );
  }

  function agregar() {
    const datos = new FormData();
    datos.set("tienda", tienda);
    datos.set("producto", producto);
    iniciar(async () => {
      const { ok } = await accionAgregarAlCarro(datos);
      mostrarToast(ok ? "Producto añadido al carro" : "Este producto ya no está disponible");
    });
  }

  return (
    <button
      type="button"
      onClick={agregar}
      disabled={enviando}
      className="mt-3 flex w-full items-center justify-center gap-2 bg-foreground px-3 py-2.5 text-sm text-background transition-[background-color,transform] hover:bg-accent active:scale-[0.98] disabled:opacity-60"
    >
      <IconoCarro className="size-4" />
      {enviando ? "Añadiendo…" : "Añadir al carro"}
    </button>
  );
}
