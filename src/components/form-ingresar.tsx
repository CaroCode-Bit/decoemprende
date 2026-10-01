"use client";

import { useActionState } from "react";
import { accionIniciarSesion, type EstadoFormulario } from "@/app/acciones";

const inicial: EstadoFormulario = {};

const campo =
  "mt-1.5 w-full border border-line bg-surface px-4 py-3 outline-none transition-colors focus:border-foreground";

export function FormIngresar({ volver }: { volver: string }) {
  const [estado, enviar, pendiente] = useActionState(accionIniciarSesion, inicial);

  return (
    <form action={enviar} className="space-y-5">
      <input type="hidden" name="volver" value={volver} />

      <div>
        <label htmlFor="correo" className="text-sm">
          Correo electrónico
        </label>
        <input
          id="correo"
          name="correo"
          type="email"
          autoComplete="email"
          required
          defaultValue={estado.correo}
          placeholder="tu@correo.com"
          className={campo}
        />
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="contrasena" className="text-sm">
            Contraseña
          </label>
          <span className="text-xs text-muted">¿La olvidaste? Próximamente</span>
        </div>
        <input
          id="contrasena"
          name="contrasena"
          type="password"
          autoComplete="current-password"
          required
          className={campo}
        />
      </div>

      {estado.error && (
        <p role="alert" className="text-sm text-red-700 dark:text-red-300">
          {estado.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pendiente}
        className="w-full bg-foreground py-3 text-sm text-background transition-[background-color,transform] hover:bg-accent active:scale-[0.99] disabled:opacity-60"
      >
        {pendiente ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}
