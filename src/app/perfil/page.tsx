import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Avatar } from "@/components/avatar";
import { IconoEstrella } from "@/components/estrellas";
import { ImagenPlaceholder } from "@/components/imagen-placeholder";
import { contarCarro, obtenerActividad, obtenerGuardados } from "@/lib/comunidad";
import { formatearFecha } from "@/lib/formato";
import { enlaceIngresar, rutaDe } from "@/lib/rutas";
import { obtenerSesion } from "@/lib/sesion";

export const metadata: Metadata = {
  title: "Mi perfil",
  robots: { index: false },
};

export default async function Perfil() {
  const visitante = await obtenerSesion();
  if (!visitante) redirect(enlaceIngresar("/perfil"));

  const [guardados, enCarro, actividad] = await Promise.all([
    obtenerGuardados(visitante.id),
    contarCarro(visitante.id),
    obtenerActividad(visitante.id),
  ]);

  const cifras = [
    { valor: guardados.length, etiqueta: "Favoritos", href: "/guardados" },
    { valor: enCarro, etiqueta: "En el carro", href: "/carrito" },
    { valor: actividad.calificaciones.length, etiqueta: "Calificaciones", href: "#calificaciones" },
    { valor: actividad.comentarios.length, etiqueta: "Comentarios", href: "#comentarios" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="aparecer flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
        <Avatar nombre={visitante.nombre} foto={visitante.foto} tamano="size-24 text-3xl" />
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-widest text-muted">Mi perfil</p>
          <h1 className="mt-1 font-serif text-4xl">{visitante.nombre}</h1>
          <p className="mt-2 flex items-center justify-center gap-1 text-sm text-muted sm:justify-start">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4 shrink-0" aria-hidden="true">
              <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
            {visitante.ciudad}, Colombia · Visitante
          </p>
        </div>
      </header>

      <ul className="escalonado mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cifras.map((c) => (
          <li key={c.etiqueta}>
            <Link
              href={c.href}
              className="block rounded-sm border border-line p-4 transition-colors hover:border-foreground"
            >
              <span className="block font-serif text-3xl">{c.valor}</span>
              <span className="mt-1 block text-sm text-muted">{c.etiqueta}</span>
            </Link>
          </li>
        ))}
      </ul>

      <section className="mt-12">
        <h2 className="font-serif text-2xl">Datos de la cuenta</h2>
        <dl className="mt-4 divide-y divide-line border-y border-line text-sm">
          <Dato etiqueta="Nombre" valor={visitante.nombre} />
          <Dato etiqueta="Correo" valor={visitante.correo} />
          <Dato etiqueta="Ciudad" valor={visitante.ciudad} />
        </dl>
        <Link
          href="/configuracion?seccion=perfil"
          className="mt-4 inline-flex border border-foreground px-5 py-2.5 text-sm transition-colors hover:bg-foreground hover:text-background"
        >
          Editar perfil y privacidad
        </Link>
      </section>

      <section id="calificaciones" className="mt-12 scroll-mt-4">
        <h2 className="font-serif text-2xl">Mis calificaciones</h2>
        {actividad.calificaciones.length === 0 ? (
          <p className="mt-4 text-sm text-muted">Todavía no has calificado ningún producto.</p>
        ) : (
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {actividad.calificaciones.map(({ tienda, producto, estrellas }) => (
              <li key={`${tienda.slug}/${producto.slug}`}>
                <Link
                  href={rutaDe(tienda.slug, producto.slug)}
                  className="group flex items-center gap-4 py-3"
                >
                  <ImagenPlaceholder
                    texto={producto.nombre}
                    color={tienda.color}
                    className="size-14 shrink-0 rounded-sm"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm group-hover:underline">{producto.nombre}</p>
                    <p className="truncate text-xs text-muted">{tienda.nombre}</p>
                  </div>
                  <span className="flex shrink-0 items-center gap-0.5" aria-label={`${estrellas} de 5 estrellas`}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <IconoEstrella
                        key={n}
                        className={`size-4 ${n <= estrellas ? "text-accent" : "text-line"}`}
                      />
                    ))}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section id="comentarios" className="mt-12 scroll-mt-4">
        <h2 className="font-serif text-2xl">Mis comentarios</h2>
        {actividad.comentarios.length === 0 ? (
          <p className="mt-4 text-sm text-muted">Todavía no has comentado ningún producto ni tienda.</p>
        ) : (
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {actividad.comentarios.map((c) => (
              <li key={c.id} className="py-4">
                <p className="text-xs text-muted">
                  En{" "}
                  <Link
                    href={rutaDe(c.tienda.slug, c.producto?.slug)}
                    className="text-foreground underline-offset-4 hover:underline"
                  >
                    {c.producto ? c.producto.nombre : `la tienda ${c.tienda.nombre}`}
                  </Link>{" "}
                  · {formatearFecha(c.fecha)}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed">{c.texto}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="flex justify-between gap-4 py-3">
      <dt className="text-muted">{etiqueta}</dt>
      <dd className="min-w-0 truncate text-right">{valor}</dd>
    </div>
  );
}
