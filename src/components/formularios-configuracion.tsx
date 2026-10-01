"use client";

import { useActionState, useState, useSyncExternalStore } from "react";
import {
  accionActualizarFoto,
  accionActualizarNotificaciones,
  accionActualizarPerfil,
  accionActualizarPrivacidad,
  accionCambiarContrasena,
  accionCambiarCorreo,
  accionEliminarCuenta,
  accionGuardarDireccion,
  type EstadoConfiguracion,
} from "@/app/acciones";
import type { Direccion, NombrePublico, Notificaciones } from "@/lib/comunidad";
import { Avatar } from "./avatar";
import { CONFIRMACION_ELIMINAR } from "@/lib/cuenta";
import { aplicarTema, leerTema, suscribirTema, type Tema } from "@/lib/tema";

const inicial: EstadoConfiguracion = {};

const campo =
  "mt-1.5 w-full border border-line bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-foreground";

const boton =
  "bg-foreground px-5 py-2.5 text-sm text-background transition-[background-color,transform] hover:bg-accent active:scale-[0.99] disabled:opacity-60";

function Aviso({ estado }: { estado: EstadoConfiguracion }) {
  if (estado.error) {
    return (
      <p role="alert" className="text-sm text-red-700 dark:text-red-300">
        {estado.error}
      </p>
    );
  }
  if (estado.ok) {
    return (
      <p role="status" className="text-sm text-green-800 dark:text-green-300">
        {estado.ok}
      </p>
    );
  }
  return null;
}

const LADO_FOTO = 256;
const MAX_ARCHIVO = 10 * 1024 * 1024;

// Recorta al centro y reduce a 256×256 en el navegador: se sube una foto liviana (~20-40 KB).
async function recortarFoto(archivo: File) {
  const imagen = await createImageBitmap(archivo);
  const lado = Math.min(imagen.width, imagen.height);
  const lienzo = document.createElement("canvas");
  lienzo.width = LADO_FOTO;
  lienzo.height = LADO_FOTO;
  lienzo
    .getContext("2d")
    ?.drawImage(imagen, (imagen.width - lado) / 2, (imagen.height - lado) / 2, lado, lado, 0, 0, LADO_FOTO, LADO_FOTO);
  imagen.close();
  return lienzo.toDataURL("image/jpeg", 0.85);
}

export function FormFoto({ nombre, foto }: { nombre: string; foto?: string }) {
  const [estado, enviar, pendiente] = useActionState(accionActualizarFoto, inicial);
  const [vistaPrevia, setVistaPrevia] = useState<string>();
  const [errorLocal, setErrorLocal] = useState<string>();
  const hayCambio = vistaPrevia !== undefined && vistaPrevia !== foto;

  async function alElegir(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    e.target.value = "";
    if (!archivo) return;
    if (!archivo.type.startsWith("image/") || archivo.size > MAX_ARCHIVO) {
      setErrorLocal("Elige una imagen JPG, PNG o WEBP de hasta 10 MB.");
      return;
    }
    try {
      setVistaPrevia(await recortarFoto(archivo));
      setErrorLocal(undefined);
    } catch {
      setErrorLocal("No pudimos leer esa imagen. Prueba con otra en JPG o PNG.");
    }
  }

  return (
    <form action={enviar} className="flex flex-wrap items-center gap-5">
      <Avatar nombre={nombre} foto={vistaPrevia ?? foto} tamano="size-20 text-2xl" />
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <label className="cursor-pointer border border-line px-4 py-2 text-sm transition-colors hover:border-foreground focus-within:border-foreground">
            Elegir foto
            <input type="file" accept="image/*" onChange={alElegir} className="sr-only" />
          </label>
          <input type="hidden" name="foto" value={hayCambio ? vistaPrevia : ""} />
          {hayCambio && (
            <button type="submit" disabled={pendiente} className={boton}>
              {pendiente ? "Guardando…" : "Guardar foto"}
            </button>
          )}
          {foto && !hayCambio && (
            <button
              type="submit"
              name="quitar"
              value="1"
              disabled={pendiente}
              className="px-3 py-2 text-sm text-muted underline-offset-4 hover:text-foreground hover:underline"
            >
              Quitar foto
            </button>
          )}
        </div>
        <p className="text-xs text-muted">JPG, PNG o WEBP de hasta 10 MB. La recortamos en cuadrado.</p>
        {errorLocal ? (
          <p role="alert" className="text-sm text-red-700 dark:text-red-300">
            {errorLocal}
          </p>
        ) : (
          <Aviso estado={estado} />
        )}
      </div>
    </form>
  );
}

export function FormCorreo() {
  const [estado, enviar, pendiente] = useActionState(accionCambiarCorreo, inicial);

  return (
    <form action={enviar} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="correo-nuevo" className="text-sm">
            Correo nuevo
          </label>
          <input
            id="correo-nuevo"
            name="correo"
            type="email"
            required
            autoComplete="email"
            defaultValue={estado.valores?.correo}
            className={campo}
          />
        </div>
        <div>
          <label htmlFor="contrasena-correo" className="text-sm">
            Tu contraseña
          </label>
          <input
            id="contrasena-correo"
            name="contrasena"
            type="password"
            required
            autoComplete="current-password"
            className={campo}
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pendiente} className={boton}>
          {pendiente ? "Enviando…" : "Cambiar correo"}
        </button>
        <Aviso estado={estado} />
      </div>
    </form>
  );
}

export function FormDireccion({
  direccion,
  ciudades,
  ciudadPorDefecto,
}: {
  direccion?: Direccion;
  ciudades: string[];
  ciudadPorDefecto: string;
}) {
  const [estado, enviar, pendiente] = useActionState(accionGuardarDireccion, inicial);
  const v = estado.valores;
  const prefijo = direccion?.id ?? "nueva";

  return (
    <form action={enviar} className="space-y-4">
      {direccion && <input type="hidden" name="id" value={direccion.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${prefijo}-etiqueta`} className="text-sm">
            Nombre de la dirección
          </label>
          <input
            id={`${prefijo}-etiqueta`}
            name="etiqueta"
            required
            maxLength={30}
            placeholder="Casa, Trabajo…"
            defaultValue={v?.etiqueta ?? direccion?.etiqueta}
            className={campo}
          />
        </div>
        <div>
          <label htmlFor={`${prefijo}-telefono`} className="text-sm">
            Celular de quien recibe
          </label>
          <input
            id={`${prefijo}-telefono`}
            name="telefono"
            type="tel"
            inputMode="numeric"
            required
            autoComplete="tel-national"
            placeholder="300 123 4567"
            defaultValue={v?.telefono ?? direccion?.telefono}
            className={campo}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${prefijo}-direccion`} className="text-sm">
            Dirección
          </label>
          <input
            id={`${prefijo}-direccion`}
            name="direccion"
            required
            maxLength={120}
            autoComplete="street-address"
            placeholder="Calle 10 # 5-20, apto 301"
            defaultValue={v?.direccion ?? direccion?.direccion}
            className={campo}
          />
        </div>
        <div>
          <label htmlFor={`${prefijo}-barrio`} className="text-sm">
            Barrio <span className="text-muted">(opcional)</span>
          </label>
          <input
            id={`${prefijo}-barrio`}
            name="barrio"
            maxLength={60}
            defaultValue={v?.barrio ?? direccion?.barrio}
            className={campo}
          />
        </div>
        <div>
          <label htmlFor={`${prefijo}-ciudad`} className="text-sm">
            Ciudad
          </label>
          <select
            id={`${prefijo}-ciudad`}
            name="ciudad"
            defaultValue={v?.ciudad ?? direccion?.ciudad ?? ciudadPorDefecto}
            className={campo}
          >
            {ciudades.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${prefijo}-indicaciones`} className="text-sm">
            Indicaciones para la entrega <span className="text-muted">(opcional)</span>
          </label>
          <input
            id={`${prefijo}-indicaciones`}
            name="indicaciones"
            maxLength={120}
            placeholder="Portería, casa esquinera, timbre dañado…"
            defaultValue={v?.indicaciones ?? direccion?.indicaciones}
            className={campo}
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pendiente} className={boton}>
          {pendiente ? "Guardando…" : "Guardar dirección"}
        </button>
        <Aviso estado={estado} />
      </div>
    </form>
  );
}

export function FormNotificaciones({ valores }: { valores: Notificaciones }) {
  const [estado, enviar, pendiente] = useActionState(accionActualizarNotificaciones, inicial);
  const opciones: { nombre: keyof Notificaciones; titulo: string; detalle: string }[] = [
    {
      nombre: "respuestas",
      titulo: "Una tienda responde a mi comentario",
      detalle: "Para que sepas cuándo el emprendedor te contesta.",
    },
    {
      nombre: "disponibilidad",
      titulo: "Un favorito agotado vuelve a estar disponible",
      detalle: "Te avisamos cuando un producto que guardaste se pueda pedir de nuevo.",
    },
    {
      nombre: "novedades",
      titulo: "Novedades y promociones de DecoEmprende",
      detalle: "Tiendas nuevas, temporadas y descuentos. Como mucho un correo a la semana.",
    },
  ];

  return (
    <form action={enviar} className="space-y-4">
      <ul className="divide-y divide-line border-y border-line">
        {opciones.map((o) => (
          <li key={o.nombre}>
            <label className="flex cursor-pointer items-start justify-between gap-4 py-4">
              <span>
                <span className="block text-sm">{o.titulo}</span>
                <span className="block text-xs text-muted">{o.detalle}</span>
              </span>
              <input
                type="checkbox"
                name={o.nombre}
                defaultChecked={valores[o.nombre]}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className="relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-line transition-colors peer-checked:bg-accent peer-focus-visible:ring-2 peer-focus-visible:ring-foreground/40 after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-background after:shadow after:transition-transform peer-checked:after:translate-x-5"
              />
            </label>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pendiente} className={boton}>
          {pendiente ? "Guardando…" : "Guardar preferencias"}
        </button>
        <Aviso estado={estado} />
      </div>
    </form>
  );
}

export function FormPerfil({
  nombre,
  ciudad,
  ciudades,
}: {
  nombre: string;
  ciudad: string;
  ciudades: string[];
}) {
  const [estado, enviar, pendiente] = useActionState(accionActualizarPerfil, inicial);

  return (
    <form action={enviar} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="nombre" className="text-sm">
            Nombre
          </label>
          <input
            id="nombre"
            name="nombre"
            required
            minLength={2}
            maxLength={60}
            autoComplete="name"
            defaultValue={estado.nombre ?? nombre}
            className={campo}
          />
        </div>
        <div>
          <label htmlFor="ciudad" className="text-sm">
            Ciudad
          </label>
          <select
            id="ciudad"
            name="ciudad"
            defaultValue={estado.ciudad ?? ciudad}
            className={campo}
          >
            {ciudades.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pendiente} className={boton}>
          {pendiente ? "Guardando…" : "Guardar cambios"}
        </button>
        <Aviso estado={estado} />
      </div>
    </form>
  );
}

export function FormContrasena() {
  const [estado, enviar, pendiente] = useActionState(accionCambiarContrasena, inicial);

  return (
    <form action={enviar} className="space-y-4">
      <div>
        <label htmlFor="actual" className="text-sm">
          Contraseña actual
        </label>
        <input id="actual" name="actual" type="password" required autoComplete="current-password" className={campo} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="nueva" className="text-sm">
            Nueva contraseña
          </label>
          <input
            id="nueva"
            name="nueva"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            aria-describedby="ayuda-nueva"
            className={campo}
          />
          <p id="ayuda-nueva" className="mt-1 text-xs text-muted">
            Mínimo 8 caracteres.
          </p>
        </div>
        <div>
          <label htmlFor="confirmar" className="text-sm">
            Repite la nueva contraseña
          </label>
          <input
            id="confirmar"
            name="confirmar"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className={campo}
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pendiente} className={boton}>
          {pendiente ? "Cambiando…" : "Cambiar contraseña"}
        </button>
        <Aviso estado={estado} />
      </div>
    </form>
  );
}

export function FormPrivacidad({
  nombrePublico,
  ejemplos,
}: {
  nombrePublico: NombrePublico;
  ejemplos: Record<NombrePublico, string>;
}) {
  const [estado, enviar, pendiente] = useActionState(accionActualizarPrivacidad, inicial);
  const opciones: { valor: NombrePublico; titulo: string }[] = [
    { valor: "completo", titulo: "Nombre completo" },
    { valor: "inicial", titulo: "Nombre e inicial del apellido" },
  ];

  return (
    <form action={enviar} className="space-y-4">
      <fieldset>
        <legend className="text-sm">¿Cómo apareces en tus comentarios públicos?</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {opciones.map((o) => (
            <label
              key={o.valor}
              className="flex cursor-pointer items-start gap-3 rounded-sm border border-line p-4 transition-colors hover:border-foreground has-[:checked]:border-foreground has-[:checked]:bg-surface"
            >
              <input
                type="radio"
                name="nombrePublico"
                value={o.valor}
                defaultChecked={nombrePublico === o.valor}
                className="mt-0.5 accent-[var(--accent)]"
              />
              <span>
                <span className="block text-sm">{o.titulo}</span>
                <span className="block text-xs text-muted">Se verá como “{ejemplos[o.valor]}”</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pendiente} className={boton}>
          {pendiente ? "Guardando…" : "Guardar privacidad"}
        </button>
        <Aviso estado={estado} />
      </div>
    </form>
  );
}

export function FormEliminarCuenta() {
  const [estado, enviar, pendiente] = useActionState(accionEliminarCuenta, inicial);

  return (
    <form action={enviar} className="space-y-4">
      <div>
        <label htmlFor="confirmacion" className="text-sm">
          Escribe <strong className="font-medium">{CONFIRMACION_ELIMINAR}</strong> para confirmar
        </label>
        <input
          id="confirmacion"
          name="confirmacion"
          required
          autoComplete="off"
          spellCheck={false}
          className={`${campo} sm:max-w-xs`}
        />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pendiente}
          className="border border-red-700 px-5 py-2.5 text-sm text-red-700 transition-colors hover:bg-red-700 hover:text-white disabled:opacity-60 dark:border-red-400 dark:text-red-300 dark:hover:bg-red-400 dark:hover:text-black"
        >
          {pendiente ? "Eliminando…" : "Eliminar mi cuenta"}
        </button>
        <Aviso estado={estado} />
      </div>
    </form>
  );
}

export function SelectorTema() {
  const tema = useSyncExternalStore(suscribirTema, leerTema, () => "sistema" as Tema);
  const opciones: { valor: Tema; titulo: string }[] = [
    { valor: "light", titulo: "Claro" },
    { valor: "dark", titulo: "Oscuro" },
    { valor: "sistema", titulo: "Igual que mi dispositivo" },
  ];

  return (
    <div role="radiogroup" aria-label="Tema" className="grid gap-3 sm:grid-cols-3">
      {opciones.map((o) => (
        <button
          key={o.valor}
          type="button"
          role="radio"
          aria-checked={tema === o.valor}
          onClick={() => aplicarTema(o.valor)}
          className="rounded-sm border border-line px-4 py-3 text-left text-sm transition-colors hover:border-foreground aria-checked:border-foreground aria-checked:bg-surface"
        >
          {o.titulo}
        </button>
      ))}
    </div>
  );
}
