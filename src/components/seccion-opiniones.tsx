import Link from "next/link";
import { accionEliminarComentario } from "@/app/acciones";
import { obtenerComentarios, type Visitante } from "@/lib/comunidad";
import { formatearFecha } from "@/lib/formato";
import { enlaceIngresar, rutaDe } from "@/lib/rutas";
import { FormComentario } from "./form-comentario";

type Props = {
  titulo: string;
  placeholder: string;
  tienda: string;
  producto?: string;
  visitante?: Visitante;
};

export async function SeccionOpiniones({ titulo, placeholder, tienda, producto, visitante }: Props) {
  const comentarios = await obtenerComentarios(tienda, producto);

  return (
    <section className="border-t border-line pt-10">
      <h2 className="font-serif text-2xl">
        {titulo} <span className="text-base text-muted">({comentarios.length})</span>
      </h2>

      <div className="mt-6 max-w-2xl">
        {visitante ? (
          <FormComentario tienda={tienda} producto={producto} placeholder={placeholder} />
        ) : (
          <p className="border border-dashed border-line p-4 text-sm text-muted">
            <Link href={enlaceIngresar(rutaDe(tienda, producto))} className="text-foreground underline">
              Inicia sesión
            </Link>{" "}
            para dejar un comentario.
          </p>
        )}

        {comentarios.length === 0 ? (
          <p className="mt-8 text-sm text-muted">Todavía no hay comentarios. ¡Sé la primera persona en opinar!</p>
        ) : (
          <ul className="escalonado mt-8 divide-y divide-line">
            {comentarios.map((c) => (
              <li key={c.id} className="py-5">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-medium">{c.autor}</p>
                  <time dateTime={c.fecha} className="shrink-0 text-xs text-muted">
                    {formatearFecha(c.fecha)}
                  </time>
                </div>
                <p className="mt-2 whitespace-pre-line text-foreground/85">{c.texto}</p>
                {c.visitanteId === visitante?.id && (
                  <form action={accionEliminarComentario}>
                    <input type="hidden" name="id" value={c.id} />
                    <button type="submit" className="mt-2 text-xs text-muted underline hover:text-foreground">
                      Eliminar mi comentario
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
