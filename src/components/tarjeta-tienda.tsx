import Link from "next/link";
import type { Tienda } from "@/lib/datos";
import { ImagenPlaceholder } from "./imagen-placeholder";

export function TarjetaTienda({ tienda }: { tienda: Tienda }) {
  const total = tienda.productos.length;

  return (
    <Link
      href={`/${tienda.slug}`}
      className="group flex items-center gap-4 border border-line bg-surface p-4 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-foreground/30 hover:shadow-lg hover:shadow-foreground/5"
    >
      <ImagenPlaceholder
        texto={tienda.nombre}
        color={tienda.color}
        className="size-16 shrink-0 rounded-full [&>span]:text-2xl"
      />
      <div className="min-w-0">
        <h3 className="font-serif text-lg group-hover:underline">{tienda.nombre}</h3>
        <p className="text-sm text-muted">
          {tienda.ciudad} · {total} {total === 1 ? "producto" : "productos"}
        </p>
      </div>
    </Link>
  );
}
