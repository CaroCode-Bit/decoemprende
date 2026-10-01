import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PasosIngreso } from "@/components/pasos-ingreso";
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

// Se ve al entrar directo (o al ser redirigido desde una página que pide sesión);
// desde los enlaces del sitio se abre la misma tarjeta como ventana flotante.
export default async function Ingresar({ searchParams }: Props) {
  const destino = rutaSegura((await searchParams).volver);
  if (await obtenerSesion()) redirect(destino);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-surface/60 px-4 py-12">
      <section
        aria-labelledby="titulo-ingreso"
        className="aparecer w-full max-w-[26rem] rounded-xl border border-line bg-background p-6 shadow-2xl sm:p-8"
      >
        <PasosIngreso
          volver={destino}
          modo="pagina"
          cuentasDemo={visitantes.map(({ nombre, correo }) => ({ nombre, correo }))}
          contrasenaDemo={CONTRASENA_DEMO}
        />
      </section>
    </div>
  );
}
