import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BotonWhatsApp } from "@/components/boton-whatsapp";
import { ResumenCalificacion } from "@/components/estrellas";
import { ImagenPlaceholder, tinte } from "@/components/imagen-placeholder";
import { SeccionOpiniones } from "@/components/seccion-opiniones";
import { TarjetaProducto } from "@/components/tarjeta-producto";
import { Tooltip } from "@/components/tooltip";
import { obtenerResumen } from "@/lib/comunidad";
import { obtenerTienda } from "@/lib/datos";
import { obtenerSesion } from "@/lib/sesion";

type Props = {
  params: Promise<{ tienda: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tienda = await obtenerTienda((await params).tienda);
  if (!tienda) return {};

  return {
    title: tienda.nombre,
    description: tienda.descripcion,
    openGraph: { title: tienda.nombre, description: tienda.descripcion },
  };
}

export default async function PaginaTienda({ params }: Props) {
  const tienda = await obtenerTienda((await params).tienda);
  if (!tienda) notFound();

  const [visitante, resumen] = await Promise.all([obtenerSesion(), obtenerResumen(tienda.slug)]);
  const productos = [...tienda.productos].sort(
    (a, b) => Number(b.destacado ?? false) - Number(a.destacado ?? false),
  );

  return (
    <>
      <section style={{ backgroundColor: tinte(tienda.color) }}>
        <div className="aparecer mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:flex-row sm:items-end sm:px-6 sm:py-16">
          <ImagenPlaceholder
            texto={tienda.nombre}
            color="var(--surface)"
            className="size-24 shrink-0 rounded-full"
          />
          <div className="flex-1">
            <Tooltip texto={`Ver más tiendas en ${tienda.ciudad}`} alinear="inicio">
              <Link
                href={`/?ciudad=${encodeURIComponent(tienda.ciudad)}#directorio`}
                className="text-sm uppercase tracking-widest text-foreground/70 underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                {tienda.ciudad}
              </Link>
            </Tooltip>
            <h1 className="mt-1 font-serif text-4xl sm:text-5xl">{tienda.nombre}</h1>
            <p className="mt-3 max-w-xl text-foreground/80">{tienda.descripcion}</p>
            <div className="mt-3">
              <ResumenCalificacion {...resumen} />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <BotonWhatsApp
              numero={tienda.whatsapp}
              mensaje={`Hola ${tienda.nombre}, vi tu tienda en DecoEmprende y quiero más información.`}
            >
              Escribir por WhatsApp
            </BotonWhatsApp>
            {tienda.instagram && (
              <a
                href={`https://instagram.com/${tienda.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center border border-foreground px-6 py-3 text-sm transition-[background-color,color,transform] hover:bg-foreground hover:text-background active:scale-[0.98]"
              >
                Instagram
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {productos.length === 0 ? (
          <p className="text-muted">Esta tienda todavía no ha publicado productos.</p>
        ) : (
          <div className="escalonado grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {productos.map((producto) => (
              <TarjetaProducto key={producto.slug} tienda={tienda} producto={producto} />
            ))}
          </div>
        )}
      </section>

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <SeccionOpiniones
          titulo={`Opiniones sobre ${tienda.nombre}`}
          placeholder="Cuéntale a otros cómo fue tu experiencia con esta tienda: atención, tiempos, empaque…"
          tienda={tienda.slug}
          visitante={visitante}
        />
      </div>
    </>
  );
}
