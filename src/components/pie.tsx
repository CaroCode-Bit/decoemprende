import Link from "next/link";
import { Logo } from "./logo";

// Cambiar por el correo real de soporte antes de publicar.
const CORREO_SOPORTE = "soporte@decoemprende.com";
const DESARROLLADOR = "CaroCode-Bit";

function Proximamente() {
  return (
    <span className="ml-2 rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted">
      Pronto
    </span>
  );
}

const enlace = "transition-colors hover:text-foreground";

export function Pie({ conSesion }: { conSesion: boolean }) {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-10 px-4 py-14 sm:px-6 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="group inline-flex items-center gap-2.5 font-serif text-xl tracking-tight">
            <Logo className="size-7 transition-transform duration-300 group-hover:-rotate-6" />
            DecoEmprende
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Decoración minimalista hecha por emprendedores de Colombia. Descubre piezas únicas y
            escríbele directo a quien las crea.
          </p>
        </div>

        <nav aria-labelledby="pie-explorar">
          <h2 id="pie-explorar" className="text-xs uppercase tracking-widest text-foreground">
            Explorar
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li>
              <Link href="/#directorio" className={enlace}>Tiendas</Link>
            </li>
            <li>
              <Link href="/" className={enlace}>Destacados</Link>
            </li>
            <li>
              <Link href="/guardados" className={enlace}>Mis guardados</Link>
            </li>
            {!conSesion && (
              <li>
                <Link href="/ingresar" className={enlace}>Iniciar sesión</Link>
              </li>
            )}
          </ul>
        </nav>

        <nav aria-labelledby="pie-emprendedores">
          <h2 id="pie-emprendedores" className="text-xs uppercase tracking-widest text-foreground">
            Emprendedores
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li>
              Publica tu tienda
              <Proximamente />
            </li>
            <li>
              Panel de ventas
              <Proximamente />
            </li>
          </ul>
        </nav>

        <nav aria-labelledby="pie-soporte">
          <h2 id="pie-soporte" className="text-xs uppercase tracking-widest text-foreground">
            Soporte
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li>
              <a href={`mailto:${CORREO_SOPORTE}`} className={enlace}>Escríbenos</a>
            </li>
            <li>
              Términos de uso
              <Proximamente />
            </li>
            <li>
              Privacidad
              <Proximamente />
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} DecoEmprende · Hecho en Colombia</p>
          <div className="flex items-center gap-5">
            <p className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
                <path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 4l-3 16" />
              </svg>
              Desarrollado por <span className="font-medium text-foreground">{DESARROLLADOR}</span>
            </p>
            <a href="#" className={`flex items-center gap-1 ${enlace}`}>
              Subir
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="size-3.5" aria-hidden="true">
                <path d="M12 19V5M6 11l6-6 6 6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
