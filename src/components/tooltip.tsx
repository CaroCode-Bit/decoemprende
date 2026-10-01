type Props = {
  texto: string;
  children: React.ReactNode;
  lado?: "abajo" | "arriba";
  // "inicio" y "fin" evitan que la burbuja se salga de la pantalla en elementos pegados a un borde.
  alinear?: "inicio" | "centro" | "fin";
  className?: string;
  claseBurbuja?: string;
};

const posiciones = {
  abajo: { burbuja: "top-full mt-2 origin-top", flecha: "-top-1" },
  arriba: { burbuja: "bottom-full mb-2 origin-bottom", flecha: "-bottom-1" },
};

const alineaciones = {
  inicio: { burbuja: "left-0", flecha: "left-3" },
  centro: { burbuja: "left-1/2 -translate-x-1/2", flecha: "left-1/2 -translate-x-1/2" },
  fin: { burbuja: "right-0", flecha: "right-3" },
};

// Solo CSS: aparece al pasar el mouse (no en pantallas táctiles) o al llegar con el teclado.
// Es decorativo (aria-hidden): el control debe tener su propio aria-label o texto.
export function Tooltip({
  texto,
  children,
  lado = "abajo",
  alinear = "centro",
  className = "",
  claseBurbuja = "",
}: Props) {
  const p = posiciones[lado];
  const a = alineaciones[alinear];

  return (
    <span className={`group/tip relative inline-flex ${className}`}>
      {children}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute z-50 scale-95 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1.5 font-sans text-xs font-normal normal-case tracking-normal text-background opacity-0 shadow-lg transition-[opacity,scale] duration-150 group-has-[:focus-visible]/tip:scale-100 group-has-[:focus-visible]/tip:opacity-100 group-has-[[aria-expanded=true]]/tip:hidden pointer-fine:group-hover/tip:scale-100 pointer-fine:group-hover/tip:opacity-100 pointer-fine:group-hover/tip:delay-300 ${p.burbuja} ${a.burbuja} ${claseBurbuja}`}
      >
        {texto}
        <span className={`absolute size-2 rotate-45 bg-foreground ${p.flecha} ${a.flecha}`} />
      </span>
    </span>
  );
}
