import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { obtenerVisitante } from "./comunidad";

// Sesión provisional firmada con HMAC para que no se pueda falsificar el id; se reemplazará por Supabase Auth.
const COOKIE = "sesion";
const SECRETO = process.env.SESION_SECRETO ?? "solo-para-desarrollo";

function firmar(valor: string) {
  return createHmac("sha256", SECRETO).update(valor).digest("base64url");
}

export async function crearSesion(visitanteId: string) {
  (await cookies()).set(COOKIE, `${visitanteId}.${firmar(visitanteId)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function obtenerSesion() {
  const valor = (await cookies()).get(COOKIE)?.value;
  const [id, firma] = valor?.split(".") ?? [];
  if (!id || !firma) return undefined;

  const esperada = Buffer.from(firmar(id));
  const recibida = Buffer.from(firma);
  if (recibida.length !== esperada.length || !timingSafeEqual(recibida, esperada)) return undefined;

  return obtenerVisitante(id);
}

export async function borrarSesion() {
  (await cookies()).delete(COOKIE);
}
