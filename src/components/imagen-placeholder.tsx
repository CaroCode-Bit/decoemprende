type Props = {
  texto: string;
  color: string;
  className?: string;
};

// En modo oscuro --tinte baja y el color de la tienda se funde con el fondo.
export function tinte(color: string) {
  return `color-mix(in oklab, ${color} var(--tinte), var(--background))`;
}

export function ImagenPlaceholder({ texto, color, className = "" }: Props) {
  return (
    <div
      role="img"
      aria-label={texto}
      style={{ backgroundColor: tinte(color) }}
      className={`@container flex items-center justify-center ${className}`}
    >
      <span className="font-serif text-[clamp(1.25rem,30cqw,3rem)] text-foreground/40">{texto.charAt(0)}</span>
    </div>
  );
}
