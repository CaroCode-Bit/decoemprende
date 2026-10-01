import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TarjetaProducto } from "@/components/tarjeta-producto";
import { obtenerCategorias, obtenerProductosPorCategoria } from "@/lib/datos";

type Props = {
  params: Promise<{ categoria: string }>;
};

async function buscarCategoria(slug: string) {
  return (await obtenerCategorias()).find((c) => c.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categoria = await buscarCategoria((await params).categoria);
  if (!categoria) return {};
  return {
    title: categoria.nombre,
    description: `${categoria.nombre} hechos por emprendedores colombianos en DecoEmprende.`,
  };
}

export default async function PaginaCategoria({ params }: Props) {
  const { categoria: slug } = await params;
  const [categorias, productos] = await Promise.all([
    obtenerCategorias(),
    obtenerProductosPorCategoria(slug),
  ]);
  const categoria = categorias.find((c) => c.slug === slug);
  if (!categoria) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="aparecer text-xs uppercase tracking-widest text-muted">Categoría</p>
      <h1 className="aparecer mt-1 font-serif text-4xl [animation-delay:40ms]">{categoria.nombre}</h1>
      <p className="aparecer mt-2 text-muted [animation-delay:80ms]">
        {productos.length} {productos.length === 1 ? "producto" : "productos"} de emprendedores
        colombianos.
      </p>

      <nav aria-label="Otras categorías" className="mt-6">
        <ul className="flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible">
          {categorias.map((c) => {
            const activa = c.slug === slug;
            return (
              <li key={c.slug} className="shrink-0">
                <Link
                  href={`/categoria/${c.slug}`}
                  aria-current={activa ? "page" : undefined}
                  className={`inline-flex whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition-colors ${
                    activa
                      ? "border-foreground bg-foreground text-background"
                      : "border-line text-muted hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {c.nombre}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="escalonado mt-8 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {productos.map(({ tienda, producto }) => (
          <TarjetaProducto
            key={`${tienda.slug}/${producto.slug}`}
            tienda={tienda}
            producto={producto}
            mostrarTienda
          />
        ))}
      </div>
    </div>
  );
}
