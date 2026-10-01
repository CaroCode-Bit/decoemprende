import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { Suspense } from "react";
import { MenuPerfil } from "@/components/menu-perfil";
import { Tooltip } from "@/components/tooltip";
import { Buscador, Formulario } from "@/components/buscador";
import { BotonTema } from "@/components/boton-tema";
import { IconoCarro } from "@/components/icono-carro";
import { MenuCategorias } from "@/components/menu-categorias";
import { CONTRASENA_DEMO, contarCarro, visitantes } from "@/lib/comunidad";
import { VentanaIngreso } from "@/components/ventana-ingreso";
import { obtenerCategorias } from "@/lib/datos";
import { Logo } from "@/components/logo";
import { Pie } from "@/components/pie";
import { ProveedorToast } from "@/components/proveedor-toast";
import { SITIO_URL } from "@/lib/formato";
import { obtenerSesion } from "@/lib/sesion";
import "./globals.css";

// Poppins no es fuente variable: hay que pedir cada grosor que usa el sitio.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITIO_URL),
  title: {
    default: "DecoEmprende — Decoración de emprendedores colombianos",
    template: "%s · DecoEmprende",
  },
  description:
    "Descubre tiendas de decoración minimalista hechas por emprendedores de Colombia y escríbeles directo por WhatsApp.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f4ef" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1816" },
  ],
};

// Se ejecuta antes de pintar para que no haya un parpadeo del tema equivocado.
const scriptTema = `(function(){var t;try{t=localStorage.getItem("tema")}catch(e){}if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t})()`;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const visitante = await obtenerSesion();
  const [enCarro, categorias] = await Promise.all([
    visitante ? contarCarro(visitante.id) : 0,
    obtenerCategorias(),
  ]);

  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${poppins.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptTema }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <ProveedorToast />
        {!visitante && (
          <Suspense>
            <VentanaIngreso
              cuentasDemo={visitantes.map(({ nombre, correo }) => ({ nombre, correo }))}
              contrasenaDemo={CONTRASENA_DEMO}
            />
          </Suspense>
        )}
        <header className="border-b border-line">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-4 sm:px-6">
            <Link href="/" className="group flex shrink-0 items-center gap-2.5 font-serif text-xl tracking-tight">
              <Logo className="size-7 transition-transform duration-300 group-hover:-rotate-6" />
              DecoEmprende
            </Link>
            <div className="order-last w-full md:order-none md:w-auto md:max-w-md md:flex-1">
              <Suspense fallback={<Formulario />}>
                <Buscador />
              </Suspense>
            </div>
            <nav className="flex items-center gap-3 text-sm text-muted">
              <Link href="/#directorio" className="hidden transition-colors hover:text-foreground sm:inline">
                Explorar tiendas
              </Link>
              <MenuCategorias categorias={categorias} />
              <BotonTema />
              {visitante ? (
                <>
                  <Tooltip texto="Mis favoritos">
                    <Link
                      href="/guardados"
                      aria-label="Mis favoritos"
                      className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-line hover:text-foreground"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5" aria-hidden="true">
                        <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
                      </svg>
                    </Link>
                  </Tooltip>
                  <Tooltip texto={enCarro ? `Carro · ${enCarro} ${enCarro === 1 ? "producto" : "productos"}` : "Carro de compras"}>
                    <Link
                      href="/carrito"
                      aria-label={`Carro de compras${enCarro ? `, ${enCarro} productos` : ""}`}
                      className="relative flex size-9 items-center justify-center rounded-full transition-colors hover:bg-line hover:text-foreground"
                    >
                      <IconoCarro className="size-5" />
                      {enCarro > 0 && (
                        <span
                          aria-hidden="true"
                          className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-medium leading-none text-background"
                        >
                          {enCarro > 9 ? "9+" : enCarro}
                        </span>
                      )}
                    </Link>
                  </Tooltip>
                  <MenuPerfil nombre={visitante.nombre} foto={visitante.foto} />
                </>
              ) : (
                <Link
                  href="/ingresar"
                  className="border border-line px-4 py-2 text-foreground transition-colors hover:border-foreground"
                >
                  Ingresar
                </Link>
              )}
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <Pie conSesion={visitante !== undefined} />
      </body>
    </html>
  );
}
