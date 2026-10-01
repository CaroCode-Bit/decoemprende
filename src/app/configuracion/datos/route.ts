import { exportarDatos } from "@/lib/comunidad";
import { obtenerSesion } from "@/lib/sesion";

export async function GET() {
  const visitante = await obtenerSesion();
  if (!visitante) {
    return new Response("Inicia sesión para descargar tus datos.", { status: 401 });
  }

  const datos = await exportarDatos(visitante.id);
  return new Response(JSON.stringify(datos, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": 'attachment; filename="decoemprende-mis-datos.json"',
      "Cache-Control": "no-store",
    },
  });
}
