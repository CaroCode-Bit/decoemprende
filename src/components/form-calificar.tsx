import { accionCalificar } from "@/app/acciones";
import { IconoEstrella } from "./estrellas";

type Props = {
  tienda: string;
  producto: string;
  actual?: number;
};

export function FormCalificar({ tienda, producto, actual }: Props) {
  return (
    <form action={accionCalificar}>
      <input type="hidden" name="tienda" value={tienda} />
      <input type="hidden" name="producto" value={producto} />
      <fieldset>
        <legend className="text-sm text-muted">
          {actual ? `Tu calificación: ${actual} de 5. Pulsa otra estrella para cambiarla.` : "¿Qué te pareció?"}
        </legend>
        {/* Orden inverso en el DOM para que el hover ilumine las estrellas anteriores con CSS. */}
        <div className="calificar mt-2 flex flex-row-reverse justify-end gap-1">
          {[5, 4, 3, 2, 1].map((n) => (
            <button
              key={n}
              type="submit"
              name="estrellas"
              value={n}
              aria-label={`Calificar con ${n} ${n === 1 ? "estrella" : "estrellas"}`}
              aria-pressed={actual === n}
              className={actual && n <= actual ? "text-accent" : "text-foreground/20"}
            >
              <IconoEstrella className="size-8" />
            </button>
          ))}
        </div>
      </fieldset>
    </form>
  );
}
