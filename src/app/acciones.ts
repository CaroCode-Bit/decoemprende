"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  actualizarFoto,
  actualizarNotificaciones,
  actualizarPerfil,
  actualizarPrivacidad,
  agregarAlCarro,
  agregarComentario,
  alternarGuardado,
  calificar,
  cambiarCantidad,
  cambiarContrasena,
  cancelarCambioCorreo,
  contrasenaCorrecta,
  correoEnUso,
  eliminarComentario,
  eliminarCuenta,
  eliminarDireccion,
  guardarDireccion,
  marcarPredeterminada,
  MAX_DIRECCIONES,
  solicitarCambioCorreo,
  verificarCredenciales,
} from "@/lib/comunidad";
import { CONFIRMACION_ELIMINAR } from "@/lib/cuenta";
import { CIUDADES_COLOMBIA, obtenerProducto, obtenerTienda } from "@/lib/datos";
import { enlaceIngresar, rutaDe, rutaSegura } from "@/lib/rutas";
import {
  borrarSesion,
  cerrarOtrasSesiones,
  cerrarSesionDe,
  crearSesion,
  obtenerSesion,
} from "@/lib/sesion";

export type EstadoFormulario = {
  error?: string;
  correo?: string;
  texto?: string;
  envio?: number;
};

export type EstadoIngreso = EstadoFormulario & {
  exito?: { nombre: string; destino: string };
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
  _: EstadoIngreso,
  datos: FormData,
): Promise<EstadoIngreso> {
  const correo = leer(datos, "correo").trim().toLowerCase();
  const contrasena = leer(datos, "contrasena");
  if (!correo || !contrasena) return { error: "Escribe tu correo y tu contraseña.", correo };

  const visitante = await verificarCredenciales(correo, contrasena);
  if (!visitante) return { error: "El correo o la contraseña no son correctos.", correo };

  await crearSesion(visitante.id);
  const destino = rutaSegura(leer(datos, "volver"));
  // Desde la ventana flotante el navegador se queda en la página y solo se refresca.
  if (leer(datos, "modo") === "ventana") {
    return { exito: { nombre: visitante.nombre, destino }, envio: Date.now() };
  }
  redirect(destino);
}

export async function accionCerrarSesion() {
  await borrarSesion();
  redirect("/");
}

export type EstadoConfiguracion = {
  error?: string;
  ok?: string;
  envio?: number;
  nombre?: string;
  ciudad?: string;
  valores?: Record<string, string>;
};

const FOTO_VALIDA = /^data:image\/jpeg;base64,[A-Za-z0-9+/]+=*$/;
const MAX_FOTO = 400_000;

export async function accionActualizarFoto(
  _: EstadoConfiguracion,
  datos: FormData,
): Promise<EstadoConfiguracion> {
  const visitante = await exigirSesion("/configuracion");
  if (leer(datos, "quitar") === "1") {
    await actualizarFoto(visitante.id, undefined);
    revalidatePath("/", "layout");
    return { ok: "Quitamos tu foto.", envio: Date.now() };
  }

  const foto = leer(datos, "foto");
  if (!foto) return { error: "Elige una foto primero." };
  if (foto.length > MAX_FOTO || !FOTO_VALIDA.test(foto)) {
    return { error: "No pudimos usar esa imagen. Prueba con otra en JPG o PNG." };
  }

  await actualizarFoto(visitante.id, foto);
  revalidatePath("/", "layout");
  return { ok: "Tu foto se actualizó.", envio: Date.now() };
}

const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function accionCambiarCorreo(
  _: EstadoConfiguracion,
  datos: FormData,
): Promise<EstadoConfiguracion> {
  const visitante = await exigirSesion("/configuracion?seccion=correo");
  const correo = leer(datos, "correo").trim().toLowerCase();
  const valores = { correo };

  if (!CORREO_VALIDO.test(correo) || correo.length > 254) {
    return { error: "Escribe un correo válido.", valores };
  }
  if (correo === visitante.correo) {
    return { error: "Ese ya es tu correo actual.", valores };
  }
  if (!(await contrasenaCorrecta(visitante.id, leer(datos, "contrasena")))) {
    return { error: "Tu contraseña no es correcta.", valores };
  }
  if (await correoEnUso(correo, visitante.id)) {
    return { error: "Ese correo ya está registrado en otra cuenta.", valores };
  }

  await solicitarCambioCorreo(visitante.id, correo);
  revalidatePath("/configuracion");
  return {
    ok: `Te enviamos un enlace a ${correo}. Tu correo no cambia hasta que lo confirmes.`,
    envio: Date.now(),
  };
}

export async function accionCancelarCambioCorreo() {
  const visitante = await exigirSesion("/configuracion?seccion=correo");
  await cancelarCambioCorreo(visitante.id);
  revalidatePath("/configuracion");
}

export async function accionGuardarDireccion(
  _: EstadoConfiguracion,
  datos: FormData,
): Promise<EstadoConfiguracion> {
  const visitante = await exigirSesion("/configuracion?seccion=direcciones");
  const limpio = (campo: string) => leer(datos, campo).trim().replace(/\s+/g, " ");
  const valores = {
    etiqueta: limpio("etiqueta"),
    direccion: limpio("direccion"),
    barrio: limpio("barrio"),
    ciudad: limpio("ciudad"),
    indicaciones: limpio("indicaciones"),
    telefono: limpio("telefono"),
  };
  let telefono = valores.telefono.replace(/\D/g, "");
  if (telefono.length === 12 && telefono.startsWith("57")) telefono = telefono.slice(2);

  if (valores.etiqueta.length < 2 || valores.etiqueta.length > 30) {
    return { error: "Ponle un nombre corto, por ejemplo Casa o Trabajo.", valores };
  }
  if (valores.direccion.length < 5 || valores.direccion.length > 120) {
    return { error: "Escribe la dirección completa (ej. Calle 10 # 5-20).", valores };
  }
  if (valores.barrio.length > 60 || valores.indicaciones.length > 120) {
    return { error: "El barrio o las indicaciones son demasiado largos.", valores };
  }
  if (!CIUDADES_COLOMBIA.includes(valores.ciudad)) {
    return { error: "Elige una ciudad de la lista.", valores };
  }
  if (!/^3\d{9}$/.test(telefono)) {
    return { error: "Escribe un celular colombiano de 10 dígitos que empiece por 3.", valores };
  }

  const guardada = await guardarDireccion(
    visitante.id,
    {
      etiqueta: valores.etiqueta,
      direccion: valores.direccion,
      barrio: valores.barrio || undefined,
      ciudad: valores.ciudad,
      indicaciones: valores.indicaciones || undefined,
      telefono,
    },
    leer(datos, "id") || undefined,
  );
  if (!guardada) {
    return { error: `Puedes guardar hasta ${MAX_DIRECCIONES} direcciones.`, valores };
  }
  revalidatePath("/", "layout");
  return { ok: "Dirección guardada.", envio: Date.now() };
}

export async function accionEliminarDireccion(datos: FormData) {
  const visitante = await exigirSesion("/configuracion?seccion=direcciones");
  await eliminarDireccion(visitante.id, leer(datos, "id"));
  revalidatePath("/", "layout");
}

export async function accionDireccionPredeterminada(datos: FormData) {
  const visitante = await exigirSesion("/configuracion?seccion=direcciones");
  await marcarPredeterminada(visitante.id, leer(datos, "id"));
  revalidatePath("/", "layout");
}

export async function accionActualizarNotificaciones(
  _: EstadoConfiguracion,
  datos: FormData,
): Promise<EstadoConfiguracion> {
  const visitante = await exigirSesion("/configuracion?seccion=notificaciones");
  await actualizarNotificaciones(visitante.id, {
    respuestas: datos.get("respuestas") === "on",
    disponibilidad: datos.get("disponibilidad") === "on",
    novedades: datos.get("novedades") === "on",
  });
  revalidatePath("/configuracion");
  return { ok: "Tus preferencias de correo se guardaron.", envio: Date.now() };
}

export async function accionActualizarPerfil(
  _: EstadoConfiguracion,
  datos: FormData,
): Promise<EstadoConfiguracion> {
  const visitante = await exigirSesion("/configuracion");
  const nombre = leer(datos, "nombre").trim().replace(/\s+/g, " ");
  const ciudad = leer(datos, "ciudad");

  if (nombre.length < 2 || nombre.length > 60) {
    return { error: "Tu nombre debe tener entre 2 y 60 caracteres.", nombre, ciudad };
  }
  if (!CIUDADES_COLOMBIA.includes(ciudad)) {
    return { error: "Elige una ciudad de la lista.", nombre, ciudad };
  }

  await actualizarPerfil(visitante.id, nombre, ciudad);
  revalidatePath("/", "layout");
  return { ok: "Tu perfil se actualizó.", envio: Date.now() };
}

export async function accionCambiarContrasena(
  _: EstadoConfiguracion,
  datos: FormData,
): Promise<EstadoConfiguracion> {
  const visitante = await exigirSesion("/configuracion");
  const actual = leer(datos, "actual");
  const nueva = leer(datos, "nueva");

  if (!actual || !nueva) return { error: "Completa todos los campos." };
  if (nueva.length < 8) return { error: "La nueva contraseña debe tener al menos 8 caracteres." };
  if (nueva !== leer(datos, "confirmar")) return { error: "Las contraseñas nuevas no coinciden." };
  if (nueva === actual) return { error: "La nueva contraseña debe ser distinta de la actual." };

  if (!(await cambiarContrasena(visitante.id, actual, nueva))) {
    return { error: "Tu contraseña actual no es correcta." };
  }
  const cerradas = await cerrarOtrasSesiones(visitante.id);
  revalidatePath("/configuracion");
  return {
    ok:
      cerradas > 0
        ? `Tu contraseña se cambió y cerramos ${cerradas} ${cerradas === 1 ? "sesión abierta" : "sesiones abiertas"} en otros dispositivos.`
        : "Tu contraseña se cambió.",
    envio: Date.now(),
  };
}

export async function accionCerrarSesionDispositivo(datos: FormData) {
  const visitante = await exigirSesion("/configuracion");
  await cerrarSesionDe(visitante.id, leer(datos, "sesion"));
  revalidatePath("/configuracion");
}

export async function accionCerrarOtrasSesiones() {
  const visitante = await exigirSesion("/configuracion");
  await cerrarOtrasSesiones(visitante.id);
  revalidatePath("/configuracion");
}

export async function accionActualizarPrivacidad(
  _: EstadoConfiguracion,
  datos: FormData,
): Promise<EstadoConfiguracion> {
  const visitante = await exigirSesion("/configuracion");
  const nombrePublico = leer(datos, "nombrePublico");
  if (nombrePublico !== "completo" && nombrePublico !== "inicial") {
    return { error: "Elige una opción." };
  }

  await actualizarPrivacidad(visitante.id, nombrePublico);
  revalidatePath("/", "layout");
  return { ok: "Tus preferencias de privacidad se guardaron.", envio: Date.now() };
}

export async function accionEliminarCuenta(
  _: EstadoConfiguracion,
  datos: FormData,
): Promise<EstadoConfiguracion> {
  const visitante = await exigirSesion("/configuracion");
  if (leer(datos, "confirmacion").trim() !== CONFIRMACION_ELIMINAR) {
    return { error: `Escribe ${CONFIRMACION_ELIMINAR} en mayúsculas para confirmar.` };
  }

  await cerrarOtrasSesiones(visitante.id);
  await eliminarCuenta(visitante.id);
  await borrarSesion();
  revalidatePath("/", "layout");
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
