"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  agregarAlCarro,
  agregarComentario,
  alternarGuardado,
  calificar,
  cambiarCantidad,
  eliminarComentario,
  verificarCredenciales,
} from "@/lib/comunidad";
import { obtenerProducto, obtenerTienda } from "@/lib/datos";
import { enlaceIngresar, rutaDe, rutaSegura } from "@/lib/rutas";
import { borrarSesion, crearSesion, obtenerSesion } from "@/lib/sesion";

export type EstadoFormulario = {
  error?: string;
  correo?: string;
  texto?: string;
  envio?: number;
};

function leer(datos: FormData, campo: string) {
  const valor = datos.get(campo);
  return typeof valor === "string" ? valor : "";
}

async function exigirSesion(volver: string) {
  const visitante = await obtenerSesion();
  if (!visitante) redirect(enlaceIngresar(volver));
  return visitante;
}

export async function accionIniciarSesion(
  _: EstadoFormulario,
  datos: FormData,
): Promise<EstadoFormulario> {
  const correo = leer(datos, "correo").trim().toLowerCase();
  const contrasena = leer(datos, "contrasena");

  if (!correo || !contrasena) return { error: "Escribe tu correo y tu contraseña.", correo };

  const visitante = await verificarCredenciales(correo, contrasena);
  if (!visitante) return { error: "El correo o la contraseña no son correctos.", correo };

  await crearSesion(visitante.id);
  redirect(rutaSegura(leer(datos, "volver")));
}

export async function accionCerrarSesion() {
  await borrarSesion();
  redirect("/");
}

export async function accionCalificar(datos: FormData) {
  const tienda = leer(datos, "tienda");
  const producto = leer(datos, "producto");
  if (!(await obtenerProducto(tienda, producto))) return;

  const ruta = rutaDe(tienda, producto);
  const visitante = await exigirSesion(ruta);

  const estrellas = Number(leer(datos, "estrellas"));
  if (!Number.isInteger(estrellas) || estrellas < 1 || estrellas > 5) return;

  await calificar(visitante.id, tienda, producto, estrellas);
  revalidatePath(ruta);
}

export async function accionComentar(
  _: EstadoFormulario,
  datos: FormData,
): Promise<EstadoFormulario> {
  const tienda = leer(datos, "tienda");
  const producto = leer(datos, "producto") || undefined;
  const existe = producto ? await obtenerProducto(tienda, producto) : await obtenerTienda(tienda);
  if (!existe) return { error: "Este contenido ya no está disponible." };

  const ruta = rutaDe(tienda, producto);
  const visitante = await exigirSesion(ruta);

  const texto = leer(datos, "texto").trim();
  if (texto.length < 3) return { error: "Escribe al menos 3 caracteres.", texto };
  if (texto.length > 500) return { error: "El comentario puede tener máximo 500 caracteres.", texto };

  await agregarComentario(visitante.id, tienda, producto, texto);
  revalidatePath(ruta);
  return { envio: Date.now() };
}

export async function accionEliminarComentario(datos: FormData) {
  const visitante = await obtenerSesion();
  if (!visitante) return;

  const eliminado = await eliminarComentario(leer(datos, "id"), visitante.id);
  if (eliminado) revalidatePath(rutaDe(eliminado.tienda, eliminado.producto));
}

export async function accionAlternarGuardado(datos: FormData) {
  const tienda = leer(datos, "tienda");
  const producto = leer(datos, "producto");
  if (!(await obtenerProducto(tienda, producto))) return;

  const ruta = rutaDe(tienda, producto);
  const visitante = await exigirSesion(ruta);

  await alternarGuardado(visitante.id, tienda, producto);
  revalidatePath("/", "layout");
}

export async function accionAgregarAlCarro(datos: FormData) {
  const tienda = leer(datos, "tienda");
  const producto = leer(datos, "producto");
  const encontrado = await obtenerProducto(tienda, producto);
  if (!encontrado?.producto.disponible) return { ok: false };

  const visitante = await exigirSesion("/guardados");
  await agregarAlCarro(visitante.id, tienda, producto);
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function accionCambiarCantidad(datos: FormData) {
  const visitante = await exigirSesion("/carrito");
  const cantidad = Number(leer(datos, "cantidad"));
  if (!Number.isInteger(cantidad)) return;

  await cambiarCantidad(visitante.id, leer(datos, "tienda"), leer(datos, "producto"), cantidad);
  revalidatePath("/", "layout");
}
