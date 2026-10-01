import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  FormContrasena,
  FormCorreo,
  FormDireccion,
  FormEliminarCuenta,
  FormFoto,
  FormNotificaciones,
  FormPerfil,
  FormPrivacidad,
  SelectorTema,
} from "@/components/formularios-configuracion";
import {
  MAX_DIRECCIONES,
  NOTIFICACIONES_INICIALES,
  nombreVisible,
  type Visitante,
} from "@/lib/comunidad";
import { CIUDADES_COLOMBIA } from "@/lib/datos";
import {
  accionCancelarCambioCorreo,
  accionCerrarOtrasSesiones,
  accionCerrarSesionDispositivo,
  accionDireccionPredeterminada,
  accionEliminarDireccion,
} from "@/app/acciones";
import { formatearHace } from "@/lib/formato";
import { enlaceIngresar } from "@/lib/rutas";
import { listarSesiones, obtenerSesion } from "@/lib/sesion";

export const metadata: Metadata = {
  title: "Configuración de la cuenta",
  robots: { index: false },
};

const pestanas = [
  { id: "perfil", titulo: "Perfil" },
  { id: "correo", titulo: "Correo" },
  { id: "direcciones", titulo: "Direcciones" },
  { id: "seguridad", titulo: "Seguridad" },
  { id: "notificaciones", titulo: "Notificaciones" },
  { id: "privacidad", titulo: "Privacidad y datos" },
  { id: "apariencia", titulo: "Apariencia" },
] as const;

type Pestana = (typeof pestanas)[number]["id"];

type Props = {
  searchParams: Promise<{ seccion?: string; confirmacion?: string }>;
};

export default async function Configuracion({ searchParams }: Props) {
  const visitante = await obtenerSesion();
  if (!visitante) redirect(enlaceIngresar("/configuracion"));

  const { seccion, confirmacion } = await searchParams;
  const activa: Pestana = pestanas.find((p) => p.id === seccion)?.id ?? "perfil";

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="aparecer text-xs uppercase tracking-widest text-muted">Tu cuenta</p>
      <h1 className="aparecer mt-1 font-serif text-4xl [animation-delay:40ms]">Configuración</h1>
      <p className="aparecer mt-2 text-muted [animation-delay:80ms]">
        Edita tu perfil, tu seguridad y cómo te ven los demás en DecoEmprende.{" "}
        <Link href="/perfil" className="text-foreground underline-offset-4 hover:underline">
          Ver mi perfil
        </Link>
      </p>

      <div className="mt-10 lg:grid lg:grid-cols-[190px_1fr] lg:gap-12">
        <nav aria-label="Secciones de configuración" className="mb-8 lg:mb-0">
          <ul className="flex gap-2 overflow-x-auto pb-2 lg:sticky lg:top-6 lg:flex-col lg:gap-0.5 lg:overflow-visible">
            {pestanas.map((p) => {
              const actual = p.id === activa;
              return (
                <li key={p.id} className="shrink-0">
                  <Link
                    href={`/configuracion?seccion=${p.id}`}
                    scroll={false}
                    aria-current={actual ? "page" : undefined}
                    className={`block whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition-colors lg:rounded-sm lg:border-0 lg:border-l-2 lg:px-3 lg:py-2 ${
                      actual
                        ? "border-foreground bg-foreground text-background lg:border-accent lg:bg-surface lg:text-foreground"
                        : "border-line text-muted hover:border-foreground hover:text-foreground lg:border-transparent lg:hover:bg-surface"
                    }`}
                  >
                    {p.titulo}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div key={activa} className="aparecer space-y-8">
          {activa === "perfil" && <PestanaPerfil visitante={visitante} />}
          {activa === "correo" && <PestanaCorreo visitante={visitante} confirmacion={confirmacion} />}
          {activa === "direcciones" && <PestanaDirecciones visitante={visitante} />}
          {activa === "seguridad" && <PestanaSeguridad visitanteId={visitante.id} />}
          {activa === "notificaciones" && (
            <Seccion
              id="notificaciones"
              titulo="Notificaciones por correo"
              descripcion={`Elige qué correos quieres recibir en ${visitante.correo}. Los avisos de seguridad de tu cuenta siempre se envían.`}
            >
              <FormNotificaciones valores={visitante.notificaciones ?? NOTIFICACIONES_INICIALES} />
              <p className="mt-4 text-xs text-muted">
                Guardamos tus preferencias desde ya; los correos empezarán a llegar cuando activemos el
                envío.
              </p>
            </Seccion>
          )}
          {activa === "privacidad" && <PestanaPrivacidad visitante={visitante} />}
          {activa === "apariencia" && (
            <Seccion id="apariencia" titulo="Apariencia" descripcion="Se guarda en este navegador.">
              <SelectorTema />
            </Seccion>
          )}
        </div>
      </div>
    </div>
  );
}

function PestanaPerfil({ visitante }: { visitante: Visitante }) {
  return (
    <>
      <Seccion id="foto" titulo="Foto de perfil" descripcion="Aparece en tu menú y en tu perfil en lugar de tus iniciales.">
        <FormFoto nombre={visitante.nombre} foto={visitante.foto} />
      </Seccion>
      <Seccion id="perfil" titulo="Tus datos" descripcion="Tu nombre y tu ciudad aparecen en tu perfil y en el menú de tu cuenta.">
        <FormPerfil nombre={visitante.nombre} ciudad={visitante.ciudad} ciudades={CIUDADES_COLOMBIA} />
      </Seccion>
    </>
  );
}

const mensajesConfirmacion: Record<string, { texto: string; ok: boolean }> = {
  ok: { texto: "Listo: tu correo nuevo quedó confirmado.", ok: true },
  vencido: { texto: "El enlace venció. Pide el cambio otra vez.", ok: false },
  "en-uso": { texto: "Ese correo ya lo usa otra cuenta, así que no lo cambiamos.", ok: false },
  invalido: { texto: "El enlace no es válido o ya se usó.", ok: false },
};

function PestanaCorreo({ visitante, confirmacion }: { visitante: Visitante; confirmacion?: string }) {
  const aviso = confirmacion ? mensajesConfirmacion[confirmacion] : undefined;
  const pendiente = visitante.correoPendiente;

  return (
    <Seccion
      id="correo"
      titulo="Correo electrónico"
      descripcion="Lo usas para iniciar sesión y es por donde te contactamos si hay algún problema con tu cuenta."
    >
      {aviso && (
        <p
          role="status"
          className={`mb-5 rounded-sm border px-4 py-3 text-sm ${
            aviso.ok
              ? "border-green-800/30 text-green-800 dark:border-green-300/30 dark:text-green-300"
              : "border-red-700/30 text-red-700 dark:border-red-300/30 dark:text-red-300"
          }`}
        >
          {aviso.texto}
        </p>
      )}

      <dl className="divide-y divide-line border-y border-line text-sm">
        <div className="flex justify-between gap-4 py-3">
          <dt className="text-muted">Correo actual</dt>
          <dd className="min-w-0 truncate text-right">{visitante.correo}</dd>
        </div>
        <div className="flex justify-between gap-4 py-3">
          <dt className="text-muted">Estado</dt>
          <dd className="flex items-center gap-1.5 text-green-800 dark:text-green-300">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
              <path d="m5 12 4.5 4.5L19 7" />
            </svg>
            Confirmado
          </dd>
        </div>
      </dl>

      {pendiente ? (
        <div className="mt-6 rounded-sm border border-line bg-surface p-4 text-sm">
          <p>
            Cambio pendiente a <strong className="font-medium">{pendiente.correo}</strong>. Abre el
            enlace que te enviamos a ese correo para confirmarlo; vence {formatearHace(pendiente.expira).toLowerCase()}.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <form action={accionCancelarCambioCorreo}>
              <button type="submit" className="text-sm text-muted underline-offset-4 hover:text-foreground hover:underline">
                Cancelar el cambio
              </button>
            </form>
            {process.env.NODE_ENV !== "production" && (
              <Link
                href={`/configuracion/confirmar-correo?token=${pendiente.token}`}
                className="text-sm text-accent underline-offset-4 hover:underline"
              >
                Simular el clic del correo (solo en desarrollo)
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <h3 className="text-sm font-medium">Cambiar tu correo</h3>
          <p className="mb-4 mt-1 text-xs text-muted">
            Tu correo no cambiará hasta que lo confirmes desde el enlace que te enviaremos a la dirección
            nueva.
          </p>
          <FormCorreo />
        </div>
      )}
    </Seccion>
  );
}

function PestanaDirecciones({ visitante }: { visitante: Visitante }) {
  const direcciones = visitante.direcciones ?? [];
  const caben = direcciones.length < MAX_DIRECCIONES;

  return (
    <Seccion
      id="direcciones"
      titulo="Direcciones de entrega"
      descripcion={`Guarda hasta ${MAX_DIRECCIONES} direcciones. En el carro puedes añadir una al pedido de WhatsApp para que el emprendedor sepa a dónde enviarlo.`}
    >
      {direcciones.length === 0 ? (
        <p className="text-sm text-muted">Todavía no tienes direcciones guardadas.</p>
      ) : (
        <ul className="space-y-3">
          {direcciones.map((d) => (
            <li key={d.id} className="rounded-sm border border-line p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 text-sm">
                  <p className="flex flex-wrap items-center gap-2 font-medium">
                    {d.etiqueta}
                    {d.predeterminada && (
                      <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-normal text-background">
                        Predeterminada
                      </span>
                    )}
                  </p>
                  <p className="mt-1">{d.direccion}</p>
                  <p className="text-muted">
                    {[d.barrio, d.ciudad].filter(Boolean).join(", ")} · Cel. {d.telefono}
                  </p>
                  {d.indicaciones && <p className="text-xs text-muted">{d.indicaciones}</p>}
                </div>
                <div className="flex shrink-0 flex-wrap gap-3 text-sm">
                  {!d.predeterminada && (
                    <form action={accionDireccionPredeterminada}>
                      <input type="hidden" name="id" value={d.id} />
                      <button type="submit" className="text-muted underline-offset-4 hover:text-foreground hover:underline">
                        Usar por defecto
                      </button>
                    </form>
                  )}
                  <form action={accionEliminarDireccion}>
                    <input type="hidden" name="id" value={d.id} />
                    <button type="submit" className="text-red-700 underline-offset-4 hover:underline dark:text-red-300">
                      Eliminar
                    </button>
                  </form>
                </div>
              </div>
              <details className="group mt-3">
                <summary className="cursor-pointer list-none text-sm text-muted hover:text-foreground">
                  <span className="group-open:hidden">Editar</span>
                  <span className="hidden group-open:inline">Cerrar edición</span>
                </summary>
                <div className="mt-4 border-t border-line pt-4">
                  <FormDireccion direccion={d} ciudades={CIUDADES_COLOMBIA} ciudadPorDefecto={visitante.ciudad} />
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}

      {caben ? (
        <details open={direcciones.length === 0} className="group mt-5 rounded-sm border border-dashed border-line p-4">
          <summary className="cursor-pointer list-none text-sm font-medium">
            <span className="text-accent">+</span> Añadir una dirección nueva
          </summary>
          <div className="mt-4">
            <FormDireccion ciudades={CIUDADES_COLOMBIA} ciudadPorDefecto={visitante.ciudad} />
          </div>
        </details>
      ) : (
        <p className="mt-5 text-xs text-muted">
          Llegaste al máximo de {MAX_DIRECCIONES} direcciones. Elimina una para añadir otra.
        </p>
      )}
    </Seccion>
  );
}

async function PestanaSeguridad({ visitanteId }: { visitanteId: string }) {
  const sesiones = await listarSesiones(visitanteId);
  return (
    <>
      <Seccion
        id="seguridad"
        titulo="Contraseña"
        descripcion="Usa una que no uses en otros sitios. Al cambiarla cerramos tus sesiones en otros dispositivos."
      >
        <FormContrasena />
      </Seccion>
      <Seccion
        id="sesiones"
        titulo="Sesiones e inicios de sesión"
        descripcion="Revisa dónde has iniciado sesión. Si no reconoces alguna, o entraste desde un computador prestado, ciérrala y cambia tu contraseña."
      >
        <ListaSesiones sesiones={sesiones} />
      </Seccion>
    </>
  );
}

function PestanaPrivacidad({ visitante }: { visitante: Visitante }) {
  const ejemplos = {
    completo: nombreVisible({ ...visitante, nombrePublico: "completo" }),
    inicial: nombreVisible({ ...visitante, nombrePublico: "inicial" }),
  };

  return (
    <>
      <Seccion
        id="privacidad"
        titulo="Tu nombre en público"
        descripcion="Tus comentarios son públicos. Elige cuánto de tu nombre se muestra junto a ellos. Tus calificaciones nunca muestran tu nombre."
      >
        <FormPrivacidad nombrePublico={visitante.nombrePublico ?? "completo"} ejemplos={ejemplos} />
      </Seccion>

      <Seccion
        id="datos"
        titulo="Tus datos"
        descripcion="Descarga una copia de todo lo que DecoEmprende guarda sobre ti: perfil, direcciones, preferencias, calificaciones, comentarios, favoritos y carro. Es tu derecho según la Ley 1581 de 2012 de protección de datos."
      >
        <a
          href="/configuracion/datos"
          download
          className="inline-flex items-center gap-2 border border-foreground px-5 py-2.5 text-sm transition-colors hover:bg-foreground hover:text-background"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
            <path d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14" />
          </svg>
          Descargar mis datos (JSON)
        </a>
      </Seccion>

      <Seccion
        id="eliminar"
        titulo="Eliminar cuenta"
        descripcion="Se borran tu cuenta, tu foto, tus direcciones, calificaciones, comentarios, favoritos y carro. No se puede deshacer."
        peligro
      >
        <FormEliminarCuenta />
      </Seccion>
    </>
  );
}

function ListaSesiones({ sesiones }: { sesiones: Awaited<ReturnType<typeof listarSesiones>> }) {
  const otrasAbiertas = sesiones.filter((s) => !s.esActual && !s.cerrada).length;

  return (
    <>
      <ul className="divide-y divide-line border-y border-line">
        {sesiones.map((s) => {
          const local = s.ip === "::1" || s.ip === "127.0.0.1" || s.ip.startsWith("::ffff:127.");
          return (
            <li key={s.id} className="flex items-start gap-3 py-4">
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-surface text-muted">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
                  {s.movil ? (
                    <>
                      <rect x="7" y="3" width="10" height="18" rx="2" />
                      <path d="M11 18h2" />
                    </>
                  ) : (
                    <>
                      <rect x="3" y="4" width="18" height="12" rx="1.5" />
                      <path d="M8 20h8M12 16v4" />
                    </>
                  )}
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 text-sm">
                  {s.dispositivo}
                  {s.esActual && (
                    <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] text-background">
                      Esta sesión
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  Inició sesión: {formatearHace(s.creada).toLowerCase()} · Última actividad:{" "}
                  {formatearHace(s.ultimaActividad).toLowerCase()}
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  {local ? "Este equipo (red local)" : `IP ${s.ip}`}
                  {s.ubicacion && ` · ${s.ubicacion}`}
                </p>
              </div>
              <div className="shrink-0 text-right">
                {s.cerrada ? (
                  <span className="text-xs text-muted">Cerrada {formatearHace(s.cerrada).toLowerCase()}</span>
                ) : s.esActual ? (
                  <span className="text-xs text-green-800 dark:text-green-300">Activa</span>
                ) : (
                  <form action={accionCerrarSesionDispositivo}>
                    <input type="hidden" name="sesion" value={s.id} />
                    <button
                      type="submit"
                      className="border border-line px-3 py-1.5 text-xs transition-colors hover:border-foreground"
                    >
                      Cerrar
                    </button>
                  </form>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      {otrasAbiertas > 0 && (
        <form action={accionCerrarOtrasSesiones} className="mt-4">
          <button
            type="submit"
            className="border border-foreground px-5 py-2.5 text-sm transition-colors hover:bg-foreground hover:text-background"
          >
            {otrasAbiertas === 1
              ? "Cerrar la otra sesión abierta"
              : `Cerrar las otras ${otrasAbiertas} sesiones abiertas`}
          </button>
        </form>
      )}
    </>
  );
}

function Seccion({
  id,
  titulo,
  descripcion,
  peligro = false,
  children,
}: {
  id: string;
  titulo: string;
  descripcion: string;
  peligro?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`titulo-${id}`}
      className={`scroll-mt-6 rounded-sm border p-5 sm:p-6 ${
        peligro ? "border-red-700/40 dark:border-red-400/40" : "border-line"
      }`}
    >
      <h2 id={`titulo-${id}`} className={`font-serif text-2xl ${peligro ? "text-red-700 dark:text-red-300" : ""}`}>
        {titulo}
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-muted">{descripcion}</p>
      <div className="mt-5">{children}</div>
    </section>
  );
}
