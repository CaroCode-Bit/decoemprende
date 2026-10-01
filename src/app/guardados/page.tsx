import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BotonAgregarCarro } from "@/components/boton-agregar-carro";
import { TarjetaProducto } from "@/components/tarjeta-producto";
import { obtenerGuardados } from "@/lib/comunidad";
import { enlaceIngresar } from "@/lib/rutas";
import { obtenerSesion } from "@/lib/sesion";

export const metadata: Metadata = {
  title: "Guardados",
  robots: { index: false },
};

export default async function Guardados() {
  const visitante = await obtenerSesion();
  if (!visitante) redirect(enlaceIngresar("/guardados"));

  const guardados = await obtenerGuardados(visitante.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="aparecer font-serif text-4xl">Tus guardados</h1>
      <p className="aparecer mt-2 text-muted [animation-delay:80ms]">
        Las piezas que marcaste para ver después.
      </p>

      {guardados.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center rounded-sm border-2 border-dashed border-line bg-surface px-8 py-12 text-center sm:py-16">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="mb-4 size-12 text-muted"
            aria-hidden="true"
          >
            <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
          </svg>
          <h2 className="mt-3 font-serif text-2xl">No hay productos favoritos</h2>
          <p className="mt-2 max-w-sm text-muted">
            Todavía no has añadido ningún producto a favoritos. Explora las tiendas y pulsa el
            corazón en las piezas que te gusten.
          </p>
          <Link
            href="/#directorio"
            className="mt-6 inline-flex border border-foreground px-6 py-3 text-sm transition-colors hover:bg-foreground hover:text-background"
          >
            Explorar tiendas
          </Link>
        </div>
      ) : (
        <div className="escalonado mt-10 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {guardados.map(({ tienda, producto }) => (
            <div key={`${tienda.slug}/${producto.slug}`} className="flex flex-col">
              <TarjetaProducto tienda={tienda} producto={producto} mostrarTienda />
              <div className="mt-auto">
                <BotonAgregarCarro
                  tienda={tienda.slug}
                  producto={producto.slug}
                  disponible={producto.disponible}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
