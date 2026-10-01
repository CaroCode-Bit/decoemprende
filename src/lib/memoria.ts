// Next carga los módulos por separado para páginas y rutas (ej. /configuracion/datos);
// guardar los datos en globalThis hace que todas vean la misma memoria hasta conectar Supabase.
export function compartido<T>(clave: string, inicial: T): T {
  const global = globalThis as unknown as Record<string, unknown>;
  return (global[`__decoemprende_${clave}`] ??= inicial) as T;
}
