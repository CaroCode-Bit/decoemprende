// Solo rutas internas: evita que ?volver= mande al usuario a otro sitio.
export function rutaSegura(valor: unknown) {
  return typeof valor === "string" && /^\/(?![/\\])/.test(valor) ? valor : "/";
}

export function enlaceIngresar(volver: string) {
  return `/ingresar?volver=${encodeURIComponent(volver)}`;
}

export function rutaDe(tienda: string, producto?: string) {
  return producto ? `/${tienda}/${producto}` : `/${tienda}`;
}
