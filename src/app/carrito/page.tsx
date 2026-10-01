import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { accionCambiarCantidad } from "@/app/acciones";
import { BotonWhatsApp } from "@/components/boton-whatsapp";
import { IconoCarro } from "@/components/icono-carro";
import { ImagenPlaceholder } from "@/components/imagen-placeholder";
import { MAX_CANTIDAD, obtenerCarro } from "@/lib/comunidad";
import type { Producto, Tienda } from "@/lib/datos";
import { formatearPrecio } from "@/lib/formato";
import { enlaceIngresar, rutaDe } from "@/lib/rutas";
import { obtenerSesion } from "@/lib/sesion";

export const metadata: Metadata = {
  title: "Carro de compras",
  robots: { index: false },
};

type Grupo = {
  tienda: Tienda;
  items: { producto: Producto; cantidad: number }[];
  subtotal: number;
};

function mensajePedido({ tienda, items, subtotal }: Grupo) {
  const lineas = items.map(
    ({ producto, cantidad }) =>
      `- ${cantidad} × ${producto.nombre} (${formatearPrecio(producto.precio * cantidad)})`,
  );
  return [
    `Hola, ${tienda.nombre}. Vi tu tienda en DecoEmprende y quiero pedir:`,
    ...lineas,
    `Total: ${formatearPrecio(subtotal)}`,
    "¿Está disponible? ¿Cómo coordinamos el pago y el envío?",
  ].join("\n");
}

export default async function Carrito() {
  const visitante = await obtenerSesion();
  if (!visitante) redirect(enlaceIngresar("/carrito"));

  const grupos = await obtenerCarro(visitante.id);
  const total = grupos.reduce((suma, g) => suma + g.subtotal, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="aparecer font-serif text-4xl">Tu carro</h1>
      <p className="aparecer mt-2 text-muted [animation-delay:80ms]">
        Cada emprendedor recibe su pedido por WhatsApp. El pago y el envío los acuerdas directamente
        con cada tienda.
      </p>

      {grupos.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center rounded-sm border-2 border-dashed border-line bg-surface px-8 py-12 text-center sm:py-16">
          <IconoCarro className="mb-4 size-12 text-muted" />
          <h2 className="mt-3 font-serif text-2xl">Tu carro está vacío</h2>
          <p className="mt-2 max-w-sm text-muted">
            Añade productos desde tus favoritos con el botón “Añadir al carro”.
          </p>
          <Link
            href="/guardados"
            className="mt-6 inline-flex border border-foreground px-6 py-3 text-sm transition-colors hover:bg-foreground hover:text-background"
          >
            Ir a mis favoritos
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-10 space-y-8">
            {grupos.map((grupo) => (
              <section key={grupo.tienda.slug} className="aparecer border border-line">
                <header className="flex items-baseline justify-between gap-4 border-b border-line px-4 py-3 sm:px-5">
                  <Link href={rutaDe(grupo.tienda.slug)} className="font-serif text-xl hover:underline">
                    {grupo.tienda.nombre}
                  </Link>
                  <span className="text-xs uppercase tracking-widest text-muted">
                    {grupo.tienda.ciudad}
                  </span>
                </header>

                <ul className="divide-y divide-line">
                  {grupo.items.map(({ producto, cantidad }) => (
                    <li key={producto.slug} className="flex gap-4 px-4 py-4 sm:px-5">
                      <Link href={rutaDe(grupo.tienda.slug, producto.slug)} className="shrink-0">
                        <ImagenPlaceholder
                          texto={producto.nombre}
                          color={grupo.tienda.color}
                          className="aspect-square w-20 rounded-sm sm:w-24"
                        />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div className="min-w-0">
                          <Link
                            href={rutaDe(grupo.tienda.slug, producto.slug)}
                            className="leading-snug hover:underline"
                          >
                            {producto.nombre}
                          </Link>
                          <p className="text-sm text-muted">{formatearPrecio(producto.precio)} c/u</p>
                          {!producto.disponible && (
                            <p className="text-sm text-accent">Ya no está disponible</p>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-4 sm:justify-end">
                          <Cantidad tienda={grupo.tienda.slug} producto={producto} cantidad={cantidad} />
                          <span className="w-24 text-right text-sm">
                            {formatearPrecio(producto.precio * cantidad)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <footer className="flex flex-col gap-3 border-t border-line bg-surface px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <p className="text-sm">
                    Subtotal <span className="font-medium">{formatearPrecio(grupo.subtotal)}</span>
                  </p>
                  <BotonWhatsApp numero={grupo.tienda.whatsapp} mensaje={mensajePedido(grupo)}>
                    Pedir por WhatsApp a {grupo.tienda.nombre}
                  </BotonWhatsApp>
                </footer>
              </section>
            ))}
          </div>

          <p className="mt-8 flex items-baseline justify-end gap-3 text-lg">
            <span className="text-muted">Total</span>
            <span className="font-serif text-2xl">{formatearPrecio(total)}</span>
          </p>
        </>
      )}
    </div>
  );
}

function Cantidad({
  tienda,
  producto,
  cantidad,
}: {
  tienda: string;
  producto: Producto;
  cantidad: number;
}) {
  const boton =
    "flex size-8 items-center justify-center transition-colors hover:bg-line disabled:opacity-40 disabled:hover:bg-transparent";

  return (
    <div className="flex items-center gap-3">
      <form action={accionCambiarCantidad} className="flex items-center border border-line">
        <input type="hidden" name="tienda" value={tienda} />
        <input type="hidden" name="producto" value={producto.slug} />
        <button
          name="cantidad"
          value={cantidad - 1}
          className={boton}
          aria-label={`Quitar una unidad de ${producto.nombre}`}
        >
          −
        </button>
        <span className="w-8 text-center text-sm" aria-live="polite">
          {cantidad}
        </span>
        <button
          name="cantidad"
          value={cantidad + 1}
          disabled={cantidad >= MAX_CANTIDAD}
          className={boton}
          aria-label={`Añadir una unidad de ${producto.nombre}`}
        >
          +
        </button>
      </form>
      <form action={accionCambiarCantidad}>
        <input type="hidden" name="tienda" value={tienda} />
        <input type="hidden" name="producto" value={producto.slug} />
        <button
          name="cantidad"
          value={0}
          className="text-xs text-muted underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          Quitar
        </button>
      </form>
    </div>
  );
}
