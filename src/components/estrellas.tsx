import { formatearPromedio } from "@/lib/formato";

export function IconoEstrella({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.8l2.7 5.9 6.4.6-4.8 4.3 1.4 6.3L12 16.6l-5.7 3.3 1.4-6.3L2.9 9.3l6.4-.6z" />
    </svg>
  );
}

type Props = {
  promedio: number;
  total: number;
};

export function ResumenCalificacion({ promedio, total }: Props) {
  if (total === 0) {
    return <p className="text-sm text-muted">Sin calificaciones todavía</p>;
  }

  return (
    <p className="flex items-center gap-1.5 text-sm">
      <IconoEstrella className="size-4 text-accent" />
      <span className="font-medium">{formatearPromedio(promedio)}</span>
      <span className="sr-only">de 5,</span>
      <span className="text-muted">
        · {total} {total === 1 ? "calificación" : "calificaciones"} de visitantes
      </span>
    </p>
  );
}
