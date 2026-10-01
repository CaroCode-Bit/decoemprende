import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { obtenerProducto, obtenerTienda, type Producto, type Tienda } from "./datos";
import { compartido } from "./memoria";

export type NombrePublico = "completo" | "inicial";

export type Direccion = {
  id: string;
  etiqueta: string;
  direccion: string;
  barrio?: string;
  ciudad: string;
  indicaciones?: string;
  telefono: string;
  predeterminada: boolean;
};

export type Notificaciones = {
  respuestas: boolean;
  disponibilidad: boolean;
  novedades: boolean;
};

// Novedades va apagado por defecto: la publicidad necesita autorización expresa (Ley 1581 de 2012).
export const NOTIFICACIONES_INICIALES: Notificaciones = {
  respuestas: true,
  disponibilidad: true,
  novedades: false,
};

export const MAX_DIRECCIONES = 3;

export type Visitante = {
  id: string;
  nombre: string;
  correo: string;
  ciudad: string;
  nombrePublico?: NombrePublico;
  // Foto ya recortada a 256×256 en el navegador, como data URL JPEG (hasta conectar Supabase Storage).
  foto?: string;
  correoPendiente?: { correo: string; token: string; expira: string };
  direcciones?: Direccion[];
  notificaciones?: Notificaciones;
};

export type Comentario = {
  id: string;
  visitanteId: string;
  tienda: string;
  // Sin producto, el comentario es sobre la tienda.
  producto?: string;
  texto: string;
  fecha: string;
};

export type ComentarioConAutor = Comentario & { autor: string };

type Calificacion = {
  visitanteId: string;
  tienda: string;
  producto: string;
  estrellas: number;
};

type Guardado = {
  visitanteId: string;
  tienda: string;
  producto: string;
};

// Datos de ejemplo en memoria hasta conectar Supabase: los cambios se pierden al reiniciar el servidor.
export const CONTRASENA_DEMO = "demo1234";

export const visitantes = compartido<Visitante[]>("visitantes", [
  { id: "v1", nombre: "Laura Gómez", correo: "laura@example.com", ciudad: "Bogotá" },
  { id: "v2", nombre: "Andrés Ruiz", correo: "andres@example.com", ciudad: "Medellín" },
  { id: "v3", nombre: "Camila Torres", correo: "camila@example.com", ciudad: "Cali" },
  { id: "v4", nombre: "Santiago Mejía", correo: "santiago@example.com", ciudad: "Barranquilla" },
  { id: "v5", nombre: "Valentina Rojas", correo: "valentina@example.com", ciudad: "Bucaramanga" },
  { id: "v6", nombre: "Mateo Herrera", correo: "mateo@example.com", ciudad: "Pereira" },
]);

const calificaciones = compartido<Calificacion[]>("calificaciones", [
  { visitanteId: "v1", tienda: "casa-lino", producto: "cojin-lino-arena", estrellas: 5 },
  { visitanteId: "v2", tienda: "casa-lino", producto: "cojin-lino-arena", estrellas: 4 },
  { visitanteId: "v3", tienda: "casa-lino", producto: "cojin-lino-arena", estrellas: 5 },
  { visitanteId: "v4", tienda: "casa-lino", producto: "camino-de-mesa-natural", estrellas: 4 },
  { visitanteId: "v1", tienda: "barro-quieto", producto: "jarron-terracota-mate", estrellas: 5 },
  { visitanteId: "v5", tienda: "barro-quieto", producto: "jarron-terracota-mate", estrellas: 5 },
  { visitanteId: "v6", tienda: "barro-quieto", producto: "jarron-terracota-mate", estrellas: 4 },
  { visitanteId: "v2", tienda: "barro-quieto", producto: "set-cuencos-arena", estrellas: 3 },
  { visitanteId: "v3", tienda: "luz-de-madera", producto: "lampara-colgante-roble", estrellas: 5 },
  { visitanteId: "v4", tienda: "luz-de-madera", producto: "lampara-colgante-roble", estrellas: 4 },
  { visitanteId: "v6", tienda: "luz-de-madera", producto: "lampara-mesa-nogal", estrellas: 5 },
  { visitanteId: "v2", tienda: "hilo-y-nudo", producto: "tapiz-macrame-luna", estrellas: 5 },
  { visitanteId: "v5", tienda: "hilo-y-nudo", producto: "tapiz-macrame-luna", estrellas: 4 },
  { visitanteId: "v1", tienda: "verde-pausa", producto: "maceta-cemento-gris", estrellas: 4 },
  { visitanteId: "v3", tienda: "verde-pausa", producto: "maceta-cemento-gris", estrellas: 3 },
  { visitanteId: "v6", tienda: "papel-y-muro", producto: "lamina-botanica-a3", estrellas: 5 },
  { visitanteId: "v4", tienda: "madera-serena", producto: "banco-pino-natural", estrellas: 5 },
  { visitanteId: "v5", tienda: "madera-serena", producto: "banco-pino-natural", estrellas: 4 },
]);

const comentarios = compartido<Comentario[]>("comentarios", [
  {
    id: "c1",
    visitanteId: "v2",
    tienda: "casa-lino",
    producto: "cojin-lino-arena",
    texto: "La tela es suavecita y el color es igual al de la foto. Llegó bien empacado.",
    fecha: "2026-09-12T15:20:00.000Z",
  },
  {
    id: "c2",
    visitanteId: "v3",
    tienda: "casa-lino",
    producto: "cojin-lino-arena",
    texto: "Pedí dos y me respondieron por WhatsApp en minutos.",
    fecha: "2026-09-18T19:05:00.000Z",
  },
  {
    id: "c3",
    visitanteId: "v5",
    tienda: "barro-quieto",
    producto: "jarron-terracota-mate",
    texto: "Precioso, aunque es un poco más pequeño de lo que imaginaba.",
    fecha: "2026-09-20T13:40:00.000Z",
  },
  {
    id: "c4",
    visitanteId: "v1",
    tienda: "barro-quieto",
    texto: "Muy buena atención, me explicaron cómo cuidar la cerámica.",
    fecha: "2026-09-15T17:10:00.000Z",
  },
  {
    id: "c5",
    visitanteId: "v4",
    tienda: "luz-de-madera",
    producto: "lampara-colgante-roble",
    texto: "La luz que da es muy cálida. La instalación fue sencilla.",
    fecha: "2026-09-22T21:30:00.000Z",
  },
  {
    id: "c6",
    visitanteId: "v6",
    tienda: "luz-de-madera",
    texto: "Hicieron una lámpara a la medida de mi comedor. Recomendados.",
    fecha: "2026-09-10T16:00:00.000Z",
  },
  {
    id: "c7",
    visitanteId: "v2",
    tienda: "hilo-y-nudo",
    producto: "tapiz-macrame-luna",
    texto: "Se ve aún más lindo en persona.",
    fecha: "2026-09-25T14:15:00.000Z",
  },
  {
    id: "c8",
    visitanteId: "v3",
    tienda: "madera-serena",
    texto: "Tardaron un poco en responder, pero el banco quedó perfecto.",
    fecha: "2026-09-27T18:45:00.000Z",
  },
]);

const guardados = compartido<Guardado[]>("guardados", [
  { visitanteId: "v1", tienda: "luz-de-madera", producto: "lampara-colgante-roble" },
  { visitanteId: "v1", tienda: "hilo-y-nudo", producto: "tapiz-macrame-luna" },
]);

// Contraseñas cambiadas por el visitante, guardadas como "sal:hash" (scrypt). Sin entrada, vale la de demo.
const contrasenas = compartido("contrasenas", new Map<string, string>());

function hashear(contrasena: string) {
  const sal = randomBytes(16).toString("hex");
  return `${sal}:${scryptSync(contrasena, sal, 64).toString("hex")}`;
}

function contrasenaValida(visitanteId: string, contrasena: string) {
  const guardada = contrasenas.get(visitanteId);
  if (!guardada) return contrasena === CONTRASENA_DEMO;
  const [sal, hash] = guardada.split(":");
  return timingSafeEqual(scryptSync(contrasena, sal, 64), Buffer.from(hash, "hex"));
}

export async function verificarCredenciales(correo: string, contrasena: string) {
  const visitante = visitantes.find((v) => v.correo === correo);
  return visitante && contrasenaValida(visitante.id, contrasena) ? visitante : undefined;
}

export async function obtenerVisitante(id: string) {
  return visitantes.find((v) => v.id === id);
}

// "Andrés Ruiz" se muestra como "Andrés R." si el visitante lo pidió en Privacidad.
export function nombreVisible(visitante: Visitante) {
  if (visitante.nombrePublico !== "inicial") return visitante.nombre;
  const [nombre, ...resto] = visitante.nombre.trim().split(/\s+/);
  const apellido = resto.at(-1);
  return apellido ? `${nombre} ${apellido[0]}.` : nombre;
}

export async function actualizarPerfil(visitanteId: string, nombre: string, ciudad: string) {
  const visitante = await obtenerVisitante(visitanteId);
  if (!visitante) return;
  visitante.nombre = nombre;
  visitante.ciudad = ciudad;
}

export async function actualizarPrivacidad(visitanteId: string, nombrePublico: NombrePublico) {
  const visitante = await obtenerVisitante(visitanteId);
  if (visitante) visitante.nombrePublico = nombrePublico;
}

export async function actualizarFoto(visitanteId: string, foto: string | undefined) {
  const visitante = await obtenerVisitante(visitanteId);
  if (visitante) visitante.foto = foto;
}

export async function actualizarNotificaciones(visitanteId: string, notificaciones: Notificaciones) {
  const visitante = await obtenerVisitante(visitanteId);
  if (visitante) visitante.notificaciones = notificaciones;
}

export async function contrasenaCorrecta(visitanteId: string, contrasena: string) {
  return contrasenaValida(visitanteId, contrasena);
}

export async function correoEnUso(correo: string, salvoVisitanteId?: string) {
  return visitantes.some(
    (v) =>
      v.id !== salvoVisitanteId &&
      (v.correo === correo || v.correoPendiente?.correo === correo),
  );
}

const HORAS_PARA_CONFIRMAR = 24;

// El correo no cambia hasta que se abre el enlace que llega a la dirección nueva.
export async function solicitarCambioCorreo(visitanteId: string, correo: string) {
  const visitante = await obtenerVisitante(visitanteId);
  if (!visitante) return undefined;
  const token = randomBytes(24).toString("base64url");
  const expira = new Date(Date.now() + HORAS_PARA_CONFIRMAR * 3600 * 1000).toISOString();
  visitante.correoPendiente = { correo, token, expira };
  return token;
}

export async function cancelarCambioCorreo(visitanteId: string) {
  const visitante = await obtenerVisitante(visitanteId);
  if (visitante) visitante.correoPendiente = undefined;
}

export async function confirmarCambioCorreo(token: string) {
  const visitante = visitantes.find((v) => v.correoPendiente?.token === token);
  const pendiente = visitante?.correoPendiente;
  if (!visitante || !pendiente) return "invalido";
  visitante.correoPendiente = undefined;
  if (pendiente.expira < new Date().toISOString()) return "vencido";
  if (visitantes.some((v) => v.id !== visitante.id && v.correo === pendiente.correo)) return "en-uso";
  visitante.correo = pendiente.correo;
  return "ok";
}

export async function guardarDireccion(
  visitanteId: string,
  datos: Omit<Direccion, "id" | "predeterminada">,
  direccionId?: string,
) {
  const visitante = await obtenerVisitante(visitanteId);
  if (!visitante) return false;
  const lista = (visitante.direcciones ??= []);
  const existente = direccionId ? lista.find((d) => d.id === direccionId) : undefined;
  if (existente) {
    Object.assign(existente, datos);
    return true;
  }
  if (lista.length >= MAX_DIRECCIONES) return false;
  lista.push({ ...datos, id: crypto.randomUUID(), predeterminada: lista.length === 0 });
  return true;
}

export async function eliminarDireccion(visitanteId: string, direccionId: string) {
  const visitante = await obtenerVisitante(visitanteId);
  const lista = visitante?.direcciones;
  if (!lista) return;
  const indice = lista.findIndex((d) => d.id === direccionId);
  if (indice === -1) return;
  const [quitada] = lista.splice(indice, 1);
  if (quitada.predeterminada && lista[0]) lista[0].predeterminada = true;
}

export async function marcarPredeterminada(visitanteId: string, direccionId: string) {
  const visitante = await obtenerVisitante(visitanteId);
  const lista = visitante?.direcciones;
  if (!lista?.some((d) => d.id === direccionId)) return;
  for (const d of lista) d.predeterminada = d.id === direccionId;
}

export async function cambiarContrasena(visitanteId: string, actual: string, nueva: string) {
  if (!contrasenaValida(visitanteId, actual)) return false;
  contrasenas.set(visitanteId, hashear(nueva));
  return true;
}

function quitarDe<T>(lista: T[], debeIrse: (elemento: T) => boolean) {
  for (let i = lista.length - 1; i >= 0; i--) if (debeIrse(lista[i])) lista.splice(i, 1);
}

// Borra la cuenta y todo lo que dejó en la plataforma (derecho de supresión, Ley 1581 de 2012).
export async function eliminarCuenta(visitanteId: string) {
  const deEste = (x: { visitanteId: string }) => x.visitanteId === visitanteId;
  quitarDe(calificaciones, deEste);
  quitarDe(comentarios, deEste);
  quitarDe(guardados, deEste);
  quitarDe(carro, deEste);
  quitarDe(visitantes, (v) => v.id === visitanteId);
  contrasenas.delete(visitanteId);
}

export async function exportarDatos(visitanteId: string) {
  const visitante = await obtenerVisitante(visitanteId);
  if (!visitante) return undefined;
  const deEste = (x: { visitanteId: string }) => x.visitanteId === visitanteId;
  return {
    exportado: new Date().toISOString(),
    perfil: {
      nombre: visitante.nombre,
      correo: visitante.correo,
      ciudad: visitante.ciudad,
      nombrePublico: visitante.nombrePublico ?? "completo",
      foto: visitante.foto ?? null,
    },
    direcciones: (visitante.direcciones ?? []).map(
      ({ etiqueta, direccion, barrio, ciudad, indicaciones, telefono, predeterminada }) => ({
        etiqueta,
        direccion,
        barrio,
        ciudad,
        indicaciones,
        telefono,
        predeterminada,
      }),
    ),
    notificaciones: visitante.notificaciones ?? NOTIFICACIONES_INICIALES,
    calificaciones: calificaciones
      .filter(deEste)
      .map(({ tienda, producto, estrellas }) => ({ tienda, producto, estrellas })),
    comentarios: comentarios
      .filter(deEste)
      .map(({ tienda, producto, texto, fecha }) => ({ tienda, producto, texto, fecha })),
    favoritos: guardados.filter(deEste).map(({ tienda, producto }) => ({ tienda, producto })),
    carro: carro.filter(deEste).map(({ tienda, producto, cantidad }) => ({ tienda, producto, cantidad })),
  };
}

// Sin producto, resume todas las calificaciones de los productos de la tienda.
export async function obtenerResumen(tienda: string, producto?: string) {
  const lista = calificaciones.filter(
    (c) => c.tienda === tienda && (producto === undefined || c.producto === producto),
  );
  const total = lista.length;
  const promedio = total ? lista.reduce((suma, c) => suma + c.estrellas, 0) / total : 0;
  return { promedio, total };
}

function buscarCalificacion(visitanteId: string, tienda: string, producto: string) {
  return calificaciones.find(
    (c) => c.visitanteId === visitanteId && c.tienda === tienda && c.producto === producto,
  );
}

export async function calificacionDe(visitanteId: string, tienda: string, producto: string) {
  return buscarCalificacion(visitanteId, tienda, producto)?.estrellas;
}

export async function calificar(
  visitanteId: string,
  tienda: string,
  producto: string,
  estrellas: number,
) {
  const existente = buscarCalificacion(visitanteId, tienda, producto);
  if (existente) existente.estrellas = estrellas;
  else calificaciones.push({ visitanteId, tienda, producto, estrellas });
}

export async function obtenerComentarios(
  tienda: string,
  producto?: string,
): Promise<ComentarioConAutor[]> {
  return comentarios
    .filter((c) => c.tienda === tienda && c.producto === producto)
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .map((c) => {
      const autor = visitantes.find((v) => v.id === c.visitanteId);
      return { ...c, autor: autor ? nombreVisible(autor) : "Visitante" };
    });
}

export async function agregarComentario(
  visitanteId: string,
  tienda: string,
  producto: string | undefined,
  texto: string,
) {
  comentarios.push({
    id: crypto.randomUUID(),
    visitanteId,
    tienda,
    producto,
    texto,
    fecha: new Date().toISOString(),
  });
}

// Solo el autor puede borrar su comentario.
export async function eliminarComentario(id: string, visitanteId: string) {
  const indice = comentarios.findIndex((c) => c.id === id && c.visitanteId === visitanteId);
  return indice === -1 ? undefined : comentarios.splice(indice, 1)[0];
}

function indiceGuardado(visitanteId: string, tienda: string, producto: string) {
  return guardados.findIndex(
    (g) => g.visitanteId === visitanteId && g.tienda === tienda && g.producto === producto,
  );
}

export async function estaGuardado(visitanteId: string, tienda: string, producto: string) {
  return indiceGuardado(visitanteId, tienda, producto) !== -1;
}

export async function alternarGuardado(visitanteId: string, tienda: string, producto: string) {
  const indice = indiceGuardado(visitanteId, tienda, producto);
  if (indice === -1) guardados.push({ visitanteId, tienda, producto });
  else guardados.splice(indice, 1);
}

export async function obtenerActividad(visitanteId: string) {
  const misCalificaciones = (
    await Promise.all(
      calificaciones
        .filter((c) => c.visitanteId === visitanteId)
        .map(async (c) => {
          const encontrado = await obtenerProducto(c.tienda, c.producto);
          return encontrado && { ...encontrado, estrellas: c.estrellas };
        }),
    )
  ).filter((c) => c !== undefined);

  const misComentarios = (
    await Promise.all(
      comentarios
        .filter((c) => c.visitanteId === visitanteId)
        .sort((a, b) => b.fecha.localeCompare(a.fecha))
        .map(async (c) => {
          const tienda = await obtenerTienda(c.tienda);
          const producto = c.producto
            ? tienda?.productos.find((p) => p.slug === c.producto)
            : undefined;
          return tienda && { id: c.id, texto: c.texto, fecha: c.fecha, tienda, producto };
        }),
    )
  ).filter((c) => c !== undefined);

  return { calificaciones: misCalificaciones, comentarios: misComentarios };
}

type ItemCarro = {
  visitanteId: string;
  tienda: string;
  producto: string;
  cantidad: number;
};

export const MAX_CANTIDAD = 20;

const carro = compartido<ItemCarro[]>("carro", []);

function buscarEnCarro(visitanteId: string, tienda: string, producto: string) {
  return carro.find(
    (i) => i.visitanteId === visitanteId && i.tienda === tienda && i.producto === producto,
  );
}

export async function agregarAlCarro(visitanteId: string, tienda: string, producto: string) {
  const existente = buscarEnCarro(visitanteId, tienda, producto);
  if (existente) existente.cantidad = Math.min(existente.cantidad + 1, MAX_CANTIDAD);
  else carro.push({ visitanteId, tienda, producto, cantidad: 1 });
}

// Con cantidad 0 el producto sale del carro.
export async function cambiarCantidad(
  visitanteId: string,
  tienda: string,
  producto: string,
  cantidad: number,
) {
  const existente = buscarEnCarro(visitanteId, tienda, producto);
  if (!existente) return;
  if (cantidad <= 0) carro.splice(carro.indexOf(existente), 1);
  else existente.cantidad = Math.min(cantidad, MAX_CANTIDAD);
}

export async function contarCarro(visitanteId: string) {
  return carro.filter((i) => i.visitanteId === visitanteId).reduce((n, i) => n + i.cantidad, 0);
}

// Agrupado por tienda porque cada emprendedor recibe su pedido por separado.
export async function obtenerCarro(visitanteId: string) {
  const grupos = new Map<
    string,
    { tienda: Tienda; items: { producto: Producto; cantidad: number }[]; subtotal: number }
  >();
  for (const item of carro.filter((i) => i.visitanteId === visitanteId)) {
    const encontrado = await obtenerProducto(item.tienda, item.producto);
    if (!encontrado) continue;
    const grupo = grupos.get(item.tienda) ?? { tienda: encontrado.tienda, items: [], subtotal: 0 };
    grupo.items.push({ producto: encontrado.producto, cantidad: item.cantidad });
    grupo.subtotal += encontrado.producto.precio * item.cantidad;
    grupos.set(item.tienda, grupo);
  }
  return [...grupos.values()];
}

export async function obtenerGuardados(visitanteId: string) {
  const propios = guardados.filter((g) => g.visitanteId === visitanteId).reverse();
  const resultados = await Promise.all(propios.map((g) => obtenerProducto(g.tienda, g.producto)));
  return resultados.filter((r): r is { tienda: Tienda; producto: Producto } => r !== undefined);
}
