import { obtenerProducto, type Producto, type Tienda } from "./datos";

export type Visitante = {
  id: string;
  nombre: string;
  correo: string;
  ciudad: string;
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

export const visitantes: Visitante[] = [
  { id: "v1", nombre: "Laura Gómez", correo: "laura@example.com", ciudad: "Bogotá" },
  { id: "v2", nombre: "Andrés Ruiz", correo: "andres@example.com", ciudad: "Medellín" },
  { id: "v3", nombre: "Camila Torres", correo: "camila@example.com", ciudad: "Cali" },
  { id: "v4", nombre: "Santiago Mejía", correo: "santiago@example.com", ciudad: "Barranquilla" },
  { id: "v5", nombre: "Valentina Rojas", correo: "valentina@example.com", ciudad: "Bucaramanga" },
  { id: "v6", nombre: "Mateo Herrera", correo: "mateo@example.com", ciudad: "Pereira" },
];

const calificaciones: Calificacion[] = [
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
];

const comentarios: Comentario[] = [
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
];

const guardados: Guardado[] = [
  { visitanteId: "v1", tienda: "luz-de-madera", producto: "lampara-colgante-roble" },
  { visitanteId: "v1", tienda: "hilo-y-nudo", producto: "tapiz-macrame-luna" },
];

export async function verificarCredenciales(correo: string, contrasena: string) {
  const visitante = visitantes.find((v) => v.correo === correo);
  return visitante && contrasena === CONTRASENA_DEMO ? visitante : undefined;
}

export async function obtenerVisitante(id: string) {
  return visitantes.find((v) => v.id === id);
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
    .map((c) => ({
      ...c,
      autor: visitantes.find((v) => v.id === c.visitanteId)?.nombre ?? "Visitante",
    }));
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

type ItemCarro = {
  visitanteId: string;
  tienda: string;
  producto: string;
  cantidad: number;
};

export const MAX_CANTIDAD = 20;

const carro: ItemCarro[] = [];

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
