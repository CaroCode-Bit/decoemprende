import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BotonGuardar } from "@/components/boton-guardar";
import { BotonWhatsApp } from "@/components/boton-whatsapp";
import { ResumenCalificacion } from "@/components/estrellas";
import { FormCalificar } from "@/components/form-calificar";
import { ImagenPlaceholder } from "@/components/imagen-placeholder";
import { SeccionOpiniones } from "@/components/seccion-opiniones";
import { calificacionDe, estaGuardado, obtenerResumen } from "@/lib/comunidad";
import { fotosDe, obtenerProducto } from "@/lib/datos";
import { GaleriaProducto } from "@/components/galeria-producto";
import { SITIO_URL, formatearPrecio } from "@/lib/formato";
import { enlaceIngresar, rutaDe } from "@/lib/rutas";
import { obtenerSesion } from "@/lib/sesion";

type Props = {
  params: Promise<{ tienda: string; producto: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tienda, producto } = await params;
  const resultado = await obtenerProducto(tienda, producto);
  if (!resultado) return {};

  const titulo = `${resultado.producto.nombre} — ${resultado.tienda.nombre}`;
  return {
    title: titulo,
    description: resultado.producto.descripcion,
    openGraph: { title: titulo, description: resultado.producto.descripcion },
  };
}

export default async function PaginaProducto({ params }: Props) {
  const { tienda: tiendaSlug, producto: productoSlug } = await params;
  const resultado = await obtenerProducto(tiendaSlug, productoSlug);
  if (!resultado) notFound();

  const { tienda, producto } = resultado;
  const ruta = rutaDe(tienda.slug, producto.slug);
  const visitante = await obtenerSesion();
  const [resumen, miCalificacion, guardado] = await Promise.all([
    obtenerResumen(tienda.slug, producto.slug),
    visitante ? calificacionDe(visitante.id, tienda.slug, producto.slug) : undefined,
    visitante ? estaGuardado(visitante.id, tienda.slug, producto.slug) : false,
  ]);

  const url = `${SITIO_URL}${ruta}`;
  const mensaje = producto.disponible
    ? `Hola ${tienda.nombre}, me interesa "${producto.nombre}" que vi en DecoEmprende: ${url}`
    : `Hola ${tienda.nombre}, ¿volverás a tener "${producto.nombre}"? Lo vi en DecoEmprende: ${url}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <nav className="text-sm text-muted" aria-label="Ruta">
        <Link href="/" className="transition-colors hover:text-foreground">
          ← Inicio
        </Link>
      </nav>

      <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-12">
        <GaleriaProducto fotos={fotosDe(producto)} color={tienda.color} nombre={producto.nombre} />

        <div className="aparecer md:py-6 [animation-delay:100ms]">
          <p className="text-xs uppercase tracking-widest text-muted">{producto.categoria}</p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl">{producto.nombre}</h1>
          <p className="mt-3 text-xl">{formatearPrecio(producto.precio)}</p>
          <div className="mt-2">
            <ResumenCalificacion {...resumen} />
          </div>
          {!producto.disponible && <p className="mt-2 text-sm text-accent">Agotado por ahora</p>}

          <p className="mt-6 leading-relaxed text-foreground/80">{producto.descripcion}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <BotonWhatsApp
              numero={tienda.whatsapp}
              mensaje={mensaje}
              variante={producto.disponible ? "solido" : "borde"}
            >
              {producto.disponible ? "Consultar por WhatsApp" : "Preguntar si vuelve"}
            </BotonWhatsApp>
            <BotonGuardar
              tienda={tienda.slug}
              producto={producto.slug}
              guardado={guardado}
              conSesion={visitante !== undefined}
            />
          </div>

          <div className="mt-8 border-t border-line pt-6">
            <p className="text-xs uppercase tracking-widest text-muted">Hecho por</p>
            <Link
              href={rutaDe(tienda.slug)}
              className="group mt-3 flex items-center gap-4 rounded-sm border border-line p-3 transition-colors hover:border-foreground"
            >
              <ImagenPlaceholder
                texto={tienda.nombre}
                color={tienda.color}
                className="size-14 shrink-0 rounded-full"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-serif text-lg leading-tight group-hover:underline">
                  {tienda.nombre}
                </p>
                <p className="mt-1 flex items-center gap-1 text-sm text-muted">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4 shrink-0" aria-hidden="true">
                    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
                    <circle cx="12" cy="9.5" r="2.5" />
                  </svg>
                  {tienda.ciudad}, Colombia
                </p>
              </div>
              <span className="shrink-0 text-sm text-muted transition-colors group-hover:text-foreground">
                <span className="hidden sm:inline">Ver tienda </span>→
              </span>
            </Link>
          </div>
        </div>
      </div>

      <section className="mt-16 border-t border-line pt-10">
        <h2 className="font-serif text-2xl">Califica este producto</h2>
        <div className="mt-4">
          {visitante ? (
            <FormCalificar tienda={tienda.slug} producto={producto.slug} actual={miCalificacion} />
          ) : (
            <p className="text-sm text-muted">
              <Link href={enlaceIngresar(ruta)} className="text-foreground underline">
                Inicia sesión
              </Link>{" "}
              para calificar este producto.
            </p>
          )}
        </div>
      </section>

      <div className="mt-12">
        <SeccionOpiniones
          titulo="Comentarios del producto"
          placeholder="¿Cómo te pareció este producto? Calidad, tamaño, colores…"
          tienda={tienda.slug}
          producto={producto.slug}
          visitante={visitante}
        />
      </div>
    </div>
  );
}
