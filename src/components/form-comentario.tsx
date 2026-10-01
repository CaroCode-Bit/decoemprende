"use client";

import { useActionState, useId } from "react";
import { accionComentar, type EstadoFormulario } from "@/app/acciones";

type Props = {
  tienda: string;
  producto?: string;
  placeholder: string;
};

const inicial: EstadoFormulario = {};

export function FormComentario({ tienda, producto, placeholder }: Props) {
  const [estado, enviar, pendiente] = useActionState(accionComentar, inicial);
  const id = useId();

  return (
    <form action={enviar} className="space-y-3">
      <input type="hidden" name="tienda" value={tienda} />
      {producto && <input type="hidden" name="producto" value={producto} />}
      <label htmlFor={id} className="sr-only">
        Tu comentario
      </label>
      {/* key cambia tras publicar: vacía el campo; si hubo error se conserva lo escrito. */}
      <textarea
        key={estado.envio}
        id={id}
        name="texto"
        required
        minLength={3}
        maxLength={500}
        rows={3}
        defaultValue={estado.texto}
        placeholder={placeholder}
        className="w-full resize-y border border-line bg-surface px-4 py-3 outline-none transition-colors focus:border-foreground"
      />
      {estado.error && (
        <p role="alert" className="text-sm text-red-700 dark:text-red-300">
          {estado.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pendiente}
        className="bg-foreground px-6 py-3 text-sm text-background transition-[background-color,transform] hover:bg-accent active:scale-[0.98] disabled:opacity-60"
      >
        {pendiente ? "Publicando…" : "Publicar comentario"}
      </button>
    </form>
  );
}
