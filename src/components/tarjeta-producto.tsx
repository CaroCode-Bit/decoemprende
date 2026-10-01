import { obtenerResumen } from "@/lib/comunidad";
import type { Producto, Tienda } from "@/lib/datos";
import { obtenerSesion } from "@/lib/sesion";
import { TarjetaProductoCliente } from "./tarjeta-producto-cliente";
import { estaGuardado } from "@/lib/comunidad";

type Props = {
  tienda: Tienda;
  producto: Producto;
  mostrarTienda?: boolean;
};

export async function TarjetaProducto({ tienda, producto, mostrarTienda = false }: Props) {
  const { promedio, total } = await obtenerResumen(tienda.slug, producto.slug);
  const visitante = await obtenerSesion();
  const guardado = visitante ? await estaGuardado(visitante.id, tienda.slug, producto.slug) : false;

  return (
    <TarjetaProductoCliente
      tienda={tienda}
      producto={producto}
      mostrarTienda={mostrarTienda}
      promedio={promedio}
      total={total}
      guardado={guardado}
      conSesion={visitante !== undefined}
    />
  );
}
