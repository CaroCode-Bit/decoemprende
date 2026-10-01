import Image from "next/image";

function iniciales(nombre: string) {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  const letras = partes.length > 1 ? [partes[0], partes[partes.length - 1]] : partes;
  return letras.map((p) => p[0]).join("").toUpperCase() || "?";
}

export function Avatar({
  nombre,
  foto,
  tamano = "size-9 text-xs",
}: {
  nombre: string;
  foto?: string;
  tamano?: string;
}) {
  return (
    <span
      role="img"
      aria-label={`Sesión de ${nombre}`}
      className={`flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-accent font-medium tracking-wide text-background ring-2 ring-background ${tamano}`}
    >
      {foto ? (
        <Image src={foto} alt="" width={256} height={256} unoptimized className="size-full object-cover" />
      ) : (
        iniciales(nombre)
      )}
    </span>
  );
}
