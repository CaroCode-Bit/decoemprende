export const SITIO_URL = process.env.NEXT_PUBLIC_SITIO_URL ?? "http://localhost:3000";

const pesos = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export function formatearPrecio(valor: number) {
  return pesos.format(valor);
}

const promedio = new Intl.NumberFormat("es-CO", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function formatearPromedio(valor: number) {
  return promedio.format(valor);
}

const fecha = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "America/Bogota",
});

export function formatearFecha(iso: string) {
  return fecha.format(new Date(iso));
}

const relativo = new Intl.RelativeTimeFormat("es-CO", { numeric: "auto" });

// "Hace 16 minutos", "Ayer", "Hace 3 días".
export function formatearHace(iso: string) {
  const segundos = Math.round((new Date(iso).getTime() - Date.now()) / 1000);
  const unidades: [Intl.RelativeTimeFormatUnit, number][] = [
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  const [unidad, tamano] = unidades.find(([, t]) => Math.abs(segundos) >= t) ?? [];
  if (!unidad || !tamano) return "Ahora mismo";
  const texto = relativo.format(Math.round(segundos / tamano), unidad);
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function enlaceWhatsApp(numero: string, mensaje: string) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}
