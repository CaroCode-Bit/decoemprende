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

export function enlaceWhatsApp(numero: string, mensaje: string) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}
