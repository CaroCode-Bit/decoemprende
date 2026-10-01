export const MAX_FOTOS_PRODUCTO = 8;

// Sin url se dibuja un placeholder con la descripción, hasta que haya fotos reales en Supabase Storage.
export type Foto = {
  descripcion: string;
  url?: string;
};

export type Producto = {
  slug: string;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  disponible: boolean;
  destacado?: boolean;
  // La primera es la portada: es la única que se ve en las tarjetas de las listas.
  fotos?: Foto[];
};

export function fotosDe(producto: Producto): Foto[] {
  const fotos = producto.fotos?.slice(0, MAX_FOTOS_PRODUCTO) ?? [];
  return fotos.length ? fotos : [{ descripcion: producto.nombre }];
}

export type Tienda = {
  slug: string;
  nombre: string;
  descripcion: string;
  ciudad: string;
  whatsapp: string;
  instagram?: string;
  color: string;
  productos: Producto[];
};

// Datos de ejemplo hasta conectar Supabase. Los números de WhatsApp son ficticios.
const tiendas: Tienda[] = [
  {
    slug: "casa-lino",
    nombre: "Casa Lino",
    descripcion: "Textiles de lino lavado, tejidos en pequeños lotes para espacios tranquilos.",
    ciudad: "Medellín",
    whatsapp: "570000000001",
    instagram: "casalino",
    color: "#d9cbb8",
    productos: [
      {
        slug: "cojin-lino-arena",
        nombre: "Cojín de lino arena",
        descripcion: "Funda de lino lavado 45 × 45 cm con relleno de fibra. Cierre invisible.",
        precio: 89000,
        categoria: "Textiles",
        disponible: true,
        destacado: true,
        fotos: [
          { descripcion: "Cojín de lino arena sobre un sofá" },
          { descripcion: "Vista de frente" },
          { descripcion: "Detalle de la textura del lino" },
          { descripcion: "Cierre invisible en la costura" },
          { descripcion: "Relleno de fibra" },
          { descripcion: "Junto a otros cojines" },
          { descripcion: "Medidas: 45 × 45 cm" },
          { descripcion: "Empaque de envío" },
        ],
      },
      {
        slug: "camino-de-mesa-natural",
        nombre: "Camino de mesa natural",
        descripcion: "Lino crudo con bordes deshilachados a mano. 40 × 180 cm.",
        precio: 65000,
        categoria: "Textiles",
        disponible: true,
      },
      {
        slug: "cortina-lino-crudo",
        nombre: "Cortina de lino crudo",
        descripcion: "Panel de 140 × 240 cm, caída suave y luz filtrada.",
        precio: 240000,
        categoria: "Textiles",
        disponible: false,
      },
    ],
  },
  {
    slug: "barro-quieto",
    nombre: "Barro Quieto",
    descripcion: "Cerámica hecha a mano con acabados mate y formas sencillas.",
    ciudad: "Bogotá",
    whatsapp: "570000000002",
    color: "#e2d3cf",
    productos: [
      {
        slug: "jarron-terracota-mate",
        nombre: "Jarrón terracota mate",
        descripcion: "Pieza torneada de 30 cm de alto, sellada por dentro para flores frescas.",
        precio: 120000,
        categoria: "Cerámica",
        disponible: true,
        destacado: true,
        fotos: [
          { descripcion: "Jarrón terracota mate con flores" },
          { descripcion: "Vista de perfil" },
          { descripcion: "Interior sellado" },
          { descripcion: "Base con la firma del taller" },
        ],
      },
      {
        slug: "set-cuencos-arena",
        nombre: "Set de cuencos arena",
        descripcion: "Tres cuencos de gres esmaltado, aptos para lavavajillas.",
        precio: 98000,
        categoria: "Cerámica",
        disponible: true,
      },
      {
        slug: "portavelas-gres",
        nombre: "Portavelas de gres",
        descripcion: "Portavelas bajo para velas de té, textura de piedra.",
        precio: 45000,
        categoria: "Cerámica",
        disponible: true,
      },
    ],
  },
  {
    slug: "luz-de-madera",
    nombre: "Luz de Madera",
    descripcion: "Lámparas en maderas nativas, diseñadas y ensambladas en nuestro taller.",
    ciudad: "Cali",
    whatsapp: "570000000003",
    instagram: "luzdemadera",
    color: "#c9d1c3",
    productos: [
      {
        slug: "lampara-colgante-roble",
        nombre: "Lámpara colgante de roble",
        descripcion: "Pantalla curva de roble de 40 cm con cable textil de 1,5 m.",
        precio: 350000,
        categoria: "Iluminación",
        disponible: true,
        destacado: true,
      },
      {
        slug: "lampara-mesa-nogal",
        nombre: "Lámpara de mesa en nogal",
        descripcion: "Base torneada en nogal y pantalla de papel de arroz.",
        precio: 280000,
        categoria: "Iluminación",
        disponible: true,
      },
      {
        slug: "aplique-pared-fresno",
        nombre: "Aplique de pared en fresno",
        descripcion: "Luz indirecta cálida, ideal para pasillos y mesas de noche.",
        precio: 190000,
        categoria: "Iluminación",
        disponible: true,
      },
    ],
  },
  {
    slug: "hilo-y-nudo",
    nombre: "Hilo & Nudo",
    descripcion: "Macramé y tejidos en algodón natural, anudados a mano uno por uno.",
    ciudad: "Bucaramanga",
    whatsapp: "570000000005",
    instagram: "hiloynudo",
    color: "#e8dcc8",
    productos: [
      {
        slug: "tapiz-macrame-luna",
        nombre: "Tapiz de macramé Luna",
        descripcion: "Tapiz de 60 × 90 cm en cordón de algodón crudo sobre vara de madera.",
        precio: 150000,
        categoria: "Arte de pared",
        disponible: true,
        destacado: true,
        fotos: [
          { descripcion: "Tapiz de macramé Luna colgado en la pared" },
          { descripcion: "Detalle de los nudos" },
        ],
      },
      {
        slug: "colgador-plantas-algodon",
        nombre: "Colgador de plantas en algodón",
        descripcion: "Para macetas de hasta 18 cm de diámetro. Largo total de 1 m.",
        precio: 55000,
        categoria: "Plantas y macetas",
        disponible: true,
      },
      {
        slug: "posavasos-trenzados",
        nombre: "Posavasos trenzados (x4)",
        descripcion: "Juego de cuatro posavasos redondos tejidos en algodón reciclado.",
        precio: 38000,
        categoria: "Textiles",
        disponible: true,
      },
    ],
  },
  {
    slug: "verde-pausa",
    nombre: "Verde Pausa",
    descripcion: "Macetas de cemento y terrarios para llenar de verde los rincones de casa.",
    ciudad: "Pereira",
    whatsapp: "570000000006",
    color: "#cfd6cb",
    productos: [
      {
        slug: "maceta-cemento-gris",
        nombre: "Maceta de cemento gris",
        descripcion: "Maceta de 15 cm con drenaje y plato incluido. Acabado liso sellado.",
        precio: 42000,
        categoria: "Plantas y macetas",
        disponible: true,
        destacado: true,
      },
      {
        slug: "terrario-vidrio-geometrico",
        nombre: "Terrario de vidrio geométrico",
        descripcion: "Estructura en latón y vidrio de 25 cm, ideal para suculentas.",
        precio: 130000,
        categoria: "Plantas y macetas",
        disponible: true,
      },
      {
        slug: "set-macetas-colgantes",
        nombre: "Set de macetas colgantes",
        descripcion: "Tres macetas pequeñas de cemento con cuerdas de yute.",
        precio: 85000,
        categoria: "Plantas y macetas",
        disponible: false,
      },
    ],
  },
  {
    slug: "papel-y-muro",
    nombre: "Papel & Muro",
    descripcion: "Láminas de arte impresas en papel de algodón y marcos en madera clara.",
    ciudad: "Cartagena",
    whatsapp: "570000000007",
    instagram: "papelymuro",
    color: "#e4d9d0",
    productos: [
      {
        slug: "lamina-botanica-a3",
        nombre: "Lámina botánica A3",
        descripcion: "Ilustración de hojas tropicales en tonos tierra, impresa en papel de 300 g.",
        precio: 60000,
        categoria: "Arte de pared",
        disponible: true,
        destacado: true,
      },
      {
        slug: "triptico-abstracto-tierra",
        nombre: "Tríptico abstracto Tierra",
        descripcion: "Tres láminas de 30 × 40 cm con formas orgánicas en ocre y arena.",
        precio: 180000,
        categoria: "Arte de pared",
        disponible: true,
      },
      {
        slug: "marco-roble-30x40",
        nombre: "Marco de roble 30 × 40",
        descripcion: "Marco en roble macizo con vidrio y paspartú blanco.",
        precio: 95000,
        categoria: "Arte de pared",
        disponible: true,
      },
    ],
  },
  {
    slug: "madera-serena",
    nombre: "Madera Serena",
    descripcion: "Muebles pequeños en maderas certificadas, líneas simples y acabado natural.",
    ciudad: "Manizales",
    whatsapp: "570000000008",
    color: "#d8cdbd",
    productos: [
      {
        slug: "banco-pino-natural",
        nombre: "Banco de pino natural",
        descripcion: "Banco de 90 cm para entrada o pie de cama, acabado en aceite vegetal.",
        precio: 420000,
        categoria: "Muebles",
        disponible: true,
        destacado: true,
      },
      {
        slug: "repisa-flotante-cedro",
        nombre: "Repisa flotante de cedro",
        descripcion: "Repisa de 60 cm con soporte oculto, soporta hasta 15 kg.",
        precio: 110000,
        categoria: "Muebles",
        disponible: true,
      },
      {
        slug: "mesa-auxiliar-redonda",
        nombre: "Mesa auxiliar redonda",
        descripcion: "Mesa de 45 cm de diámetro con patas torneadas en fresno.",
        precio: 390000,
        categoria: "Muebles",
        disponible: true,
      },
    ],
  },
  {
    slug: "taller-blanco",
    nombre: "Taller Blanco",
    descripcion: "Tienda recién creada, todavía sin productos.",
    ciudad: "Barranquilla",
    whatsapp: "570000000004",
    color: "#e6e1d8",
    productos: [],
  },
];

function normalizar(texto: string) {
  return texto.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

// Una tienda sin productos no aparece en el directorio (RN-05).
export async function obtenerTiendasPublicas() {
  return tiendas.filter((t) => t.productos.length > 0);
}

export const CIUDADES_COLOMBIA = [
  "Armenia",
  "Barranquilla",
  "Bogotá",
  "Bucaramanga",
  "Cali",
  "Cartagena",
  "Cúcuta",
  "Ibagué",
  "Manizales",
  "Medellín",
  "Montería",
  "Neiva",
  "Pasto",
  "Pereira",
  "Popayán",
  "Santa Marta",
  "Sincelejo",
  "Tunja",
  "Valledupar",
  "Villavicencio",
];

export function slugCategoria(categoria: string) {
  return normalizar(categoria)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Salen de los productos publicados: una categoría nueva aparece sola al publicar el primer producto.
export async function obtenerCategorias() {
  const conteo = new Map<string, { nombre: string; slug: string; total: number }>();
  for (const tienda of await obtenerTiendasPublicas()) {
    for (const p of tienda.productos) {
      const slug = slugCategoria(p.categoria);
      const actual = conteo.get(slug) ?? { nombre: p.categoria, slug, total: 0 };
      actual.total += 1;
      conteo.set(slug, actual);
    }
  }
  return [...conteo.values()].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
}

export async function obtenerProductosPorCategoria(slug: string) {
  const publicas = await obtenerTiendasPublicas();
  return publicas.flatMap((tienda) =>
    tienda.productos
      .filter((p) => slugCategoria(p.categoria) === slug)
      .map((producto) => ({ tienda, producto })),
  );
}

export async function obtenerCiudades() {
  const conteo = new Map<string, number>();
  for (const t of await obtenerTiendasPublicas()) {
    conteo.set(t.ciudad, (conteo.get(t.ciudad) ?? 0) + 1);
  }
  return [...conteo]
    .map(([nombre, total]) => ({ nombre, total }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
}

export async function obtenerTiendasPorCiudad(ciudad: string) {
  const buscada = normalizar(ciudad);
  const publicas = await obtenerTiendasPublicas();
  return publicas.filter((t) => normalizar(t.ciudad) === buscada);
}

export async function obtenerTienda(slug: string) {
  return tiendas.find((t) => t.slug === slug);
}

export async function obtenerProducto(tiendaSlug: string, productoSlug: string) {
  const tienda = await obtenerTienda(tiendaSlug);
  const producto = tienda?.productos.find((p) => p.slug === productoSlug);
  return tienda && producto ? { tienda, producto } : undefined;
}

export async function obtenerDestacados() {
  const publicas = await obtenerTiendasPublicas();
  return publicas.flatMap((tienda) =>
    tienda.productos.filter((p) => p.destacado).map((producto) => ({ tienda, producto })),
  );
}

export async function buscar(consulta: string) {
  const q = normalizar(consulta);
  const publicas = await obtenerTiendasPublicas();
  const coincide = (...campos: string[]) => campos.some((c) => normalizar(c).includes(q));

  return {
    tiendas: publicas.filter((t) => coincide(t.nombre, t.descripcion, t.ciudad)),
    productos: publicas.flatMap((tienda) =>
      tienda.productos
        .filter((p) => coincide(p.nombre, p.descripcion, p.categoria))
        .map((producto) => ({ tienda, producto })),
    ),
  };
}
