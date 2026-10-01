import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { FormIngresar } from "@/components/form-ingresar";
import { Logo } from "@/components/logo";
import { CONTRASENA_DEMO, visitantes } from "@/lib/comunidad";
import { rutaSegura } from "@/lib/rutas";
import { obtenerSesion } from "@/lib/sesion";

export const metadata: Metadata = {
  title: "Inicia sesión",
  robots: { index: false },
};

type Props = {
  searchParams: Promise<{ volver?: string }>;
};

export default async function Ingresar({ searchParams }: Props) {
  const destino = rutaSegura((await searchParams).volver);
  if (await obtenerSesion()) redirect(destino);

  return (
    <div className="mx-auto grid max-w-5xl items-start gap-12 px-4 py-12 sm:px-6 md:grid-cols-[1fr_20rem] md:py-20">
      <div className="aparecer mx-auto w-full max-w-sm">
        <Logo className="size-10" />
        <h1 className="mt-6 font-serif text-3xl">Inicia sesión</h1>
        <p className="mt-2 text-muted">
          Guarda tus piezas favoritas, califica productos y comparte tu opinión sobre las tiendas.
        </p>

        <div className="mt-8">
          <FormIngresar volver={destino} />
        </div>

        <div className="my-6 flex items-center gap-3 text-xs text-muted">
          <span className="h-px flex-1 bg-line" />o<span className="h-px flex-1 bg-line" />
        </div>

        <button
          type="button"
          disabled
          className="w-full cursor-not-allowed border border-line py-3 text-sm text-muted"
        >
          Continuar con Google <span className="text-xs">(próximamente)</span>
        </button>

        <div className="mt-8 space-y-2 text-sm text-muted">
          <p>¿No tienes cuenta? El registro de visitantes llegará pronto.</p>
          <p>¿Vendes decoración? El acceso para emprendedores será una sección aparte.</p>
        </div>
      </div>

      <aside className="aparecer border border-line bg-surface p-6 [animation-delay:120ms]">
        <h2 className="font-serif text-lg">Cuentas de prueba</h2>
        <p className="mt-1 text-sm text-muted">
          Contraseña para todas: <code className="text-foreground">{CONTRASENA_DEMO}</code>
        </p>
        <ul className="mt-5 space-y-3 text-sm">
          {visitantes.map((v) => (
            <li key={v.id}>
              <p className="font-medium">{v.nombre}</p>
              <p className="text-muted">{v.correo}</p>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
