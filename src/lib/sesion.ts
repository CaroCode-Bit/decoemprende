import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { obtenerVisitante } from "./comunidad";
import { compartido } from "./memoria";

// Sesión provisional firmada con HMAC; se reemplazará por Supabase Auth.
// La cookie solo lleva el id de la sesión: así se puede cerrar desde otro dispositivo.
const COOKIE = "sesion";
const SECRETO = process.env.SESION_SECRETO ?? "solo-para-desarrollo";
const DURACION_SEGUNDOS = 60 * 60 * 24 * 30;

export type Sesion = {
  id: string;
  visitanteId: string;
  creada: string;
  ultimaActividad: string;
  dispositivo: string;
  movil: boolean;
  ip: string;
  ubicacion?: string;
  cerrada?: string;
};

const sesiones = compartido<Sesion[]>("sesiones", []);

function firmar(valor: string) {
  return createHmac("sha256", SECRETO).update(valor).digest("base64url");
}

function describirDispositivo(agente: string) {
  const navegador = /Edg\//.test(agente)
    ? "Edge"
    : /OPR\//.test(agente)
      ? "Opera"
      : /Firefox\//.test(agente)
        ? "Firefox"
        : /Chrome\//.test(agente)
          ? "Chrome"
          : /Safari\//.test(agente)
            ? "Safari"
            : "Navegador desconocido";
  const sistema = /Android/.test(agente)
    ? "Android"
    : /iPhone|iPad/.test(agente)
      ? "iPhone"
      : /Windows/.test(agente)
        ? "Windows"
        : /Mac OS X/.test(agente)
          ? "Mac"
          : /Linux/.test(agente)
            ? "Linux"
            : "otro sistema";
  return { dispositivo: `${navegador} en ${sistema}`, movil: /Android|iPhone|iPad|Mobile/.test(agente) };
}

// En Vercel llegan la ciudad y la región en cabeceras; en local no hay ubicación.
function describirUbicacion(cabeceras: Headers) {
  const ciudad = cabeceras.get("x-vercel-ip-city");
  const region = cabeceras.get("x-vercel-ip-country-region");
  const pais = cabeceras.get("x-vercel-ip-country");
  const partes = [ciudad && decodeURIComponent(ciudad), region, pais].filter(Boolean);
  return partes.length ? partes.join(", ") : undefined;
}

export async function crearSesion(visitanteId: string) {
  const cabeceras = await headers();
  const ahora = new Date().toISOString();
  const ip =
    cabeceras.get("x-forwarded-for")?.split(",")[0].trim() || cabeceras.get("x-real-ip") || "desconocida";

  const sesion: Sesion = {
    id: randomUUID(),
    visitanteId,
    creada: ahora,
    ultimaActividad: ahora,
    ...describirDispositivo(cabeceras.get("user-agent") ?? ""),
    ip,
    ubicacion: describirUbicacion(cabeceras),
  };
  sesiones.push(sesion);

  (await cookies()).set(COOKIE, `${sesion.id}.${firmar(sesion.id)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DURACION_SEGUNDOS,
  });
}

async function sesionActual() {
  const valor = (await cookies()).get(COOKIE)?.value;
  const [id, firma] = valor?.split(".") ?? [];
  if (!id || !firma) return undefined;

  const esperada = Buffer.from(firmar(id));
  const recibida = Buffer.from(firma);
  if (recibida.length !== esperada.length || !timingSafeEqual(recibida, esperada)) return undefined;

  const sesion = sesiones.find((s) => s.id === id);
  return sesion && !sesion.cerrada ? sesion : undefined;
}

export async function obtenerSesion() {
  const sesion = await sesionActual();
  if (!sesion) return undefined;
  sesion.ultimaActividad = new Date().toISOString();
  return obtenerVisitante(sesion.visitanteId);
}

export async function borrarSesion() {
  const sesion = await sesionActual();
  if (sesion) sesion.cerrada = new Date().toISOString();
  (await cookies()).delete(COOKIE);
}

export async function listarSesiones(visitanteId: string) {
  const actualId = (await sesionActual())?.id;
  return sesiones
    .filter((s) => s.visitanteId === visitanteId)
    .sort((a, b) => b.creada.localeCompare(a.creada))
    .slice(0, 10)
    .map((s) => ({ ...s, esActual: s.id === actualId }));
}

export async function cerrarSesionDe(visitanteId: string, sesionId: string) {
  const sesion = sesiones.find((s) => s.id === sesionId && s.visitanteId === visitanteId);
  if (sesion && !sesion.cerrada) sesion.cerrada = new Date().toISOString();
}

// Cierra todas las sesiones abiertas del visitante salvo la de este dispositivo. Devuelve cuántas cerró.
export async function cerrarOtrasSesiones(visitanteId: string) {
  const actualId = (await sesionActual())?.id;
  const ahora = new Date().toISOString();
  let cerradas = 0;
  for (const s of sesiones) {
    if (s.visitanteId === visitanteId && s.id !== actualId && !s.cerrada) {
      s.cerrada = ahora;
      cerradas++;
    }
  }
  return cerradas;
}
