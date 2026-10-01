"use client";

import { useActionState, useEffect, useState } from "react";
import { accionIniciarSesion, type EstadoIngreso } from "@/app/acciones";
import { Logo } from "./logo";

export type CuentaDemo = { nombre: string; correo: string };

const inicial: EstadoIngreso = {};

const campo =
  "mt-1.5 w-full rounded-md border border-line bg-surface px-4 py-3 outline-none transition-colors focus:border-foreground";

const botonPrincipal =
  "w-full rounded-md bg-foreground py-3 text-sm text-background transition-[background-color,transform] hover:bg-accent active:scale-[0.99] disabled:opacity-60";

const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Props = {
  volver: string;
  modo: "ventana" | "pagina";
  cuentasDemo: CuentaDemo[];
  contrasenaDemo: string;
  alIngresar?: (exito: NonNullable<EstadoIngreso["exito"]>) => void;
};

export function PasosIngreso({ volver, modo, cuentasDemo, contrasenaDemo, alIngresar }: Props) {
  const [estado, enviar, pendiente] = useActionState(accionIniciarSesion, inicial);
  const [paso, setPaso] = useState<1 | 2>(1);
  const [correo, setCorreo] = useState("");
  const [errorCorreo, setErrorCorreo] = useState<string>();

  useEffect(() => {
    if (estado.exito) alIngresar?.(estado.exito);
  }, [estado.exito, alIngresar]);

  function continuar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const limpio = correo.trim().toLowerCase();
    if (!CORREO_VALIDO.test(limpio)) {
      setErrorCorreo("Escribe un correo válido, por ejemplo tu@correo.com.");
      return;
    }
    setCorreo(limpio);
    setErrorCorreo(undefined);
    setPaso(2);
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <Logo className="size-8" />
        <div className="flex flex-1 gap-1.5" aria-hidden="true">
          {[1, 2].map((n) => (
            <span
              key={n}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${n <= paso ? "bg-accent" : "bg-line"}`}
            />
          ))}
        </div>
        <span className="text-xs text-muted tabular-nums">Paso {paso} de 2</span>
      </div>

      {paso === 1 ? (
        <div key="paso-1" className="aparecer-paso">
          <h2 id="titulo-ingreso" className="mt-6 font-serif text-2xl">
            Inicia sesión
          </h2>
          <p className="mt-1.5 text-sm text-muted">
            Guarda tus favoritos, califica productos y arma tus pedidos.
          </p>

          <form onSubmit={continuar} noValidate className="mt-6 space-y-4">
            <div>
              <label htmlFor={`correo-${modo}`} className="text-sm">
                Correo electrónico
              </label>
              <input
                id={`correo-${modo}`}
                type="email"
                autoComplete="email"
                autoFocus
                required
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="tu@correo.com"
                aria-invalid={errorCorreo ? true : undefined}
                aria-describedby={errorCorreo ? `error-correo-${modo}` : undefined}
                className={campo}
              />
              {errorCorreo && (
                <p id={`error-correo-${modo}`} role="alert" className="mt-1.5 text-sm text-red-700 dark:text-red-300">
                  {errorCorreo}
                </p>
              )}
            </div>
            <button type="submit" className={botonPrincipal}>
              Continuar
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-muted">
            <span className="h-px flex-1 bg-line" />o<span className="h-px flex-1 bg-line" />
          </div>

          <button
            type="button"
            disabled
            className="w-full cursor-not-allowed rounded-md border border-line py-3 text-sm text-muted"
          >
            Continuar con Google <span className="text-xs">(próximamente)</span>
          </button>

          <p className="mt-5 text-center text-xs text-muted">
            ¿No tienes cuenta? El registro de visitantes llegará pronto.
          </p>

          {cuentasDemo.length > 0 && (
            <details className="mt-5 rounded-md border border-dashed border-line px-4 py-3 text-sm">
              <summary className="cursor-pointer text-muted hover:text-foreground">
                Cuentas de prueba
              </summary>
              <p className="mt-2 text-xs text-muted">
                Contraseña para todas: <code className="text-foreground">{contrasenaDemo}</code>
              </p>
              <ul className="mt-2 space-y-1">
                {cuentasDemo.map((c) => (
                  <li key={c.correo}>
                    <button
                      type="button"
                      onClick={() => {
                        setCorreo(c.correo);
                        setErrorCorreo(undefined);
                        setPaso(2);
                      }}
                      className="w-full rounded-sm px-2 py-1.5 text-left transition-colors hover:bg-surface"
                    >
                      <span className="block">{c.nombre}</span>
                      <span className="block text-xs text-muted">{c.correo}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      ) : (
        <div key="paso-2" className="aparecer-paso">
          <h2 id="titulo-ingreso" className="mt-6 font-serif text-2xl">
            Escribe tu contraseña
          </h2>
          <div className="mt-3 flex items-center justify-between gap-3 rounded-md border border-line bg-surface px-3 py-2 text-sm">
            <span className="min-w-0 truncate">{correo}</span>
            <button
              type="button"
              onClick={() => setPaso(1)}
              className="shrink-0 text-xs text-accent underline-offset-4 hover:underline"
            >
              Cambiar
            </button>
          </div>

          <form action={enviar} className="mt-5 space-y-4">
            <input type="hidden" name="volver" value={volver} />
            <input type="hidden" name="modo" value={modo} />
            <input type="hidden" name="correo" value={correo} />
            {/* Para que el gestor de contraseñas del navegador asocie la clave con el correo. */}
            <input type="email" value={correo} autoComplete="username" readOnly hidden />
            <div>
              <div className="flex items-baseline justify-between">
                <label htmlFor={`contrasena-${modo}`} className="text-sm">
                  Contraseña
                </label>
                <span className="text-xs text-muted">¿La olvidaste? Próximamente</span>
              </div>
              <input
                id={`contrasena-${modo}`}
                name="contrasena"
                type="password"
                autoComplete="current-password"
                autoFocus
                required
                className={campo}
              />
            </div>

            {estado.error && (
              <p role="alert" className="text-sm text-red-700 dark:text-red-300">
                {estado.error}
              </p>
            )}

            <button type="submit" disabled={pendiente || !!estado.exito} className={botonPrincipal}>
              {pendiente || estado.exito ? "Ingresando…" : "Ingresar"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setPaso(1)}
            className="mt-4 text-sm text-muted underline-offset-4 hover:text-foreground hover:underline"
          >
            ← Volver
          </button>
        </div>
      )}
    </div>
  );
}
