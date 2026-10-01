import Link from "next/link";
import { accionAlternarGuardado } from "@/app/acciones";
import { enlaceIngresar, rutaDe } from "@/lib/rutas";

type Props = {
  tienda: string;
  producto: string;
  guardado: boolean;
  conSesion: boolean;
};

const estilos =
  "inline-flex items-center gap-2 border border-line px-5 py-3 text-sm transition-[border-color,transform] duration-200 hover:border-foreground active:scale-[0.98]";

function IconoCorazon({ relleno }: { relleno: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={relleno ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      className={`size-5 ${relleno ? "text-accent" : ""}`}
      aria-hidden="true"
    >
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
    </svg>
  );
}

export function BotonGuardar({ tienda, producto, guardado, conSesion }: Props) {
  if (!conSesion) {
    return (
      <Link href={enlaceIngresar(rutaDe(tienda, producto))} className={estilos}>
        <IconoCorazon relleno={false} />
        Guardar
      </Link>
    );
  }

  return (
    <form action={accionAlternarGuardado}>
      <input type="hidden" name="tienda" value={tienda} />
      <input type="hidden" name="producto" value={producto} />
      <button type="submit" aria-pressed={guardado} className={estilos}>
        <IconoCorazon relleno={guardado} />
        {guardado ? "Guardado" : "Guardar"}
      </button>
    </form>
  );
}
