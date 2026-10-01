import { enlaceWhatsApp } from "@/lib/formato";

type Props = {
  numero: string;
  mensaje: string;
  children: React.ReactNode;
  variante?: "solido" | "borde";
};

export function BotonWhatsApp({ numero, mensaje, children, variante = "solido" }: Props) {
  const estilos =
    variante === "solido"
      ? "bg-foreground text-background hover:bg-accent"
      : "border border-foreground hover:bg-foreground hover:text-background";

  return (
    <a
      href={enlaceWhatsApp(numero, mensaje)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center px-6 py-3 text-sm tracking-wide transition-[background-color,color,transform] duration-200 active:scale-[0.98] ${estilos}`}
    >
      {children}
    </a>
  );
}
