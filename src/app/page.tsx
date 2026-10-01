import Link from "next/link";
import { TarjetaProducto } from "@/components/tarjeta-producto";
import { TarjetaTienda } from "@/components/tarjeta-tienda";
import {
  buscar,
  obtenerCiudades,
  obtenerDestacados,
  obtenerTiendasPorCiudad,
  obtenerTiendasPublicas,
} from "@/lib/datos";

type Props = {
  searchParams: Promise<{ q?: string; ciudad?: string }>;
};

export default async function Inicio({ searchParams }: Props) {
  const { q = "", ciudad = "" } = await searchParams;
  const consulta = q.trim();
  const ciudadElegida = ciudad.trim();

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pb-12 pt-16 sm:px-6 sm:pt-24">
        <h1 className="aparecer max-w-2xl font-serif text-4xl leading-tight sm:text-6xl">
          Decoración con calma, directo de quien la crea.
        </h1>
        <p className="aparecer mt-5 max-w-xl text-muted [animation-delay:80ms] sm:text-lg">
          Tiendas de emprendedores colombianos con piezas sencillas y hechas a mano. Encuentra lo que
          te gusta y escríbele al creador por WhatsApp.
        </p>
      </section>

      {consulta ? <Resultados consulta={consulta} /> : <Portada ciudad={ciudadElegida} />}
    </>
  );
}

async function Portada({ ciudad }: { ciudad: string }) {
  const [tiendas, destacados, ciudades] = await Promise.all([
    ciudad ? obtenerTiendasPorCiudad(ciudad) : obtenerTiendasPublicas(),
    obtenerDestacados(),
    obtenerCiudades(),
  ]);
  const activa = ciudades.find(
    (c) => c.nombre.localeCompare(ciudad, "es", { sensitivity: "base" }) === 0,
  )?.nombre;

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="font-serif text-2xl">Destacados</h2>
        <div className="escalonado mt-6 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {destacados.map(({ tienda, producto }) => (
            <TarjetaProducto
              key={`${tienda.slug}/${producto.slug}`}
              tienda={tienda}
              producto={producto}
              mostrarTienda
            />
          ))}
        </div>
      </section>

      <section id="directorio" className="mx-auto max-w-6xl scroll-mt-4 px-4 py-12 sm:px-6">
        <h2 className="font-serif text-2xl">
          Tiendas{activa && <span className="text-muted"> en {activa}</span>}
        </h2>

        <nav aria-label="Filtrar tiendas por ciudad" className="mt-5">
          <p className="mb-3 flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4" aria-hidden="true">
              <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
            Buscar por ciudad
          </p>
          <ul className="flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible">
            <li className="shrink-0">
              <ChipCiudad href="/#directorio" activo={!ciudad}>
                Todas
              </ChipCiudad>
            </li>
            {ciudades.map((c) => (
              <li key={c.nombre} className="shrink-0">
                <ChipCiudad
                  href={`/?ciudad=${encodeURIComponent(c.nombre)}#directorio`}
                  activo={c.nombre === activa}
                >
                  {c.nombre} <span className="opacity-60">{c.total}</span>
                </ChipCiudad>
              </li>
            ))}
          </ul>
        </nav>

        {tiendas.length === 0 ? (
          <p className="mt-8 text-muted">
            Aún no hay tiendas en “{ciudad}”.{" "}
            <Link href="/#directorio" className="text-foreground underline">
              Ver todas las ciudades
            </Link>
          </p>
        ) : (
          <div key={activa ?? "todas"} className="escalonado mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tiendas.map((tienda) => (
              <TarjetaTienda key={tienda.slug} tienda={tienda} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function ChipCiudad({
  href,
  activo,
  children,
}: {
  href: string;
  activo: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={activo ? "page" : undefined}
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition-colors ${
        activo
          ? "border-foreground bg-foreground text-background"
          : "border-line text-muted hover:border-foreground hover:text-foreground"
      }`}
    >
      {children}
    </Link>
  );
}

async function Resultados({ consulta }: { consulta: string }) {
  const { tiendas, productos } = await buscar(consulta);

  if (tiendas.length === 0 && productos.length === 0) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-12 text-muted sm:px-6">
        No encontramos resultados para “{consulta}”.
      </section>
    );
  }

  return (
    <>
      {productos.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="font-serif text-2xl">Productos</h2>
          <div className="escalonado mt-6 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {productos.map(({ tienda, producto }) => (
              <TarjetaProducto
                key={`${tienda.slug}/${producto.slug}`}
                tienda={tienda}
                producto={producto}
                mostrarTienda
              />
            ))}
          </div>
        </section>
      )}

      {tiendas.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="font-serif text-2xl">Tiendas</h2>
          <div className="escalonado mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tiendas.map((tienda) => (
              <TarjetaTienda key={tienda.slug} tienda={tienda} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
