import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { confirmarCambioCorreo } from "@/lib/comunidad";

// Destino del enlace que llega al correo nuevo. No exige sesión: el token es la prueba.
export async function GET(peticion: NextRequest) {
  const token = peticion.nextUrl.searchParams.get("token") ?? "";
  const resultado = await confirmarCambioCorreo(token);
  revalidatePath("/", "layout");
  redirect(`/configuracion?seccion=correo&confirmacion=${resultado}`);
}
