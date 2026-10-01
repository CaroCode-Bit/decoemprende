"use client";

import Link from "next/link";
import { accionAlternarGuardado } from "@/app/acciones";
import type { Producto, Tienda } from "@/lib/datos";
import { formatearPrecio, formatearPromedio } from "@/lib/formato";
import { rutaDe } from "@/lib/rutas";
import { IconoEstrella } from "./estrellas";
import { abrirIngreso } from "./ventana-ingreso";
import { ImagenPlaceholder } from "./imagen-placeholder";
import { mostrarToast } from "./toast";
import { Tooltip } from "./tooltip";

type Props = {
  tienda: Tienda;
  producto: Producto;
  mostrarTienda?: boolean;
  promedio: number;
  total: number;
  guardado: boolean;
  conSesion: boolean;
};

export function TarjetaProductoCliente({
  tienda,
  producto,
  mostrarTienda = false,
  promedio,
  total,
  guardado,
  conSesion,
}: Props) {
  const ruta = rutaDe(tienda.slug, producto.slug);

  async function manejarGuardar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!conSesion) {
      abrirIngreso();
      return;
    }
    const formData = new FormData(e.currentTarget);
    await accionAlternarGuardado(formData);
    mostrarToast(guardado ? "Eliminado de favoritos" : "Producto añadido a favoritos");
  }

  return (
    <div className="group block">
      <div className="relative overflow-hidden rounded-sm">
        <Link href={ruta}>
          <ImagenPlaceholder
            texto={producto.nombre}
            color={tienda.color}
            className="aspect-square transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </Link>

        {/* Corazón en esquina superior derecha */}
        <form
          onSubmit={manejarGuardar}
          onClick={(e) => e.stopPropagation()}
          className={`absolute right-2 top-2 transition-opacity duration-200 ${
            guardado ? "" : "pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100 pointer-fine:focus-within:opacity-100"
          }`}
        >
          <input type="hidden" name="tienda" value={tienda.slug} />
          <input type="hidden" name="producto" value={producto.slug} />
          <Tooltip texto={guardado ? "Quitar de favoritos" : "Añadir a favoritos"} alinear="fin">
            <button
              type="submit"
              className="flex size-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-all hover:bg-background active:scale-90"
              aria-label={guardado ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
              <svg
                viewBox="0 0 24 24"
                fill={guardado ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.5"
                className={`size-4 ${guardado ? "text-accent" : "text-foreground"}`}
                aria-hidden="true"
              >
                <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
              </svg>
            </button>
          </Tooltip>
        </form>

        {/* Calificación en esquina inferior izquierda */}
        {total > 0 && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-background/80 px-1.5 py-0.5 backdrop-blur-sm">
            <IconoEstrella className="size-3.5 text-accent" />
            <span className="text-xs font-medium text-foreground">{formatearPromedio(promedio)}</span>
            <span className="sr-only">de 5</span>
          </div>
        )}

        {/* Agotado */}
        {!producto.disponible && (
          <span className="absolute left-2 top-2 bg-surface px-1.5 py-0.5 text-[11px] tracking-wide">
            Agotado
          </span>
        )}
      </div>

      {/* Información debajo */}
      <Link href={ruta} className="block">
        <div className="mt-2 space-y-0.5">
          {mostrarTienda && (
            <p className="truncate text-[11px] uppercase tracking-widest text-muted">{tienda.nombre}</p>
          )}
          <h3 className="line-clamp-2 text-sm leading-snug group-hover:underline">{producto.nombre}</h3>
          <p className="text-sm text-muted">{formatearPrecio(producto.precio)}</p>
        </div>
      </Link>
    </div>
  );
}
