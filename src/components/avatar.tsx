function iniciales(nombre: string) {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  const letras = partes.length > 1 ? [partes[0], partes[partes.length - 1]] : partes;
  return letras.map((p) => p[0]).join("").toUpperCase() || "?";
}

export function Avatar({ nombre, className = "" }: { nombre: string; className?: string }) {
  return (
    <span
      role="img"
      aria-label={`Sesión de ${nombre}`}
      className={`flex size-9 shrink-0 select-none items-center justify-center rounded-full bg-accent text-xs font-medium tracking-wide text-background ring-2 ring-background ${className}`}
    >
      {iniciales(nombre)}
    </span>
  );
}
