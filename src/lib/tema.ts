export type Tema = "light" | "dark" | "sistema";

const EVENTO_TEMA = "cambio-tema";

export function leerTema(): Tema {
  try {
    const guardado = localStorage.getItem("tema");
    return guardado === "light" || guardado === "dark" ? guardado : "sistema";
  } catch {
    return "sistema";
  }
}

export function suscribirTema(avisar: () => void) {
  window.addEventListener(EVENTO_TEMA, avisar);
  window.addEventListener("storage", avisar);
  return () => {
    window.removeEventListener(EVENTO_TEMA, avisar);
    window.removeEventListener("storage", avisar);
  };
}

export function aplicarTema(tema: Tema) {
  const raiz = document.documentElement;
  const sistemaOscuro = matchMedia("(prefers-color-scheme: dark)").matches;
  raiz.classList.add("cambiando-tema");
  raiz.dataset.theme = tema === "sistema" ? (sistemaOscuro ? "dark" : "light") : tema;
  try {
    if (tema === "sistema") localStorage.removeItem("tema");
    else localStorage.setItem("tema", tema);
  } catch {
    // Sin almacenamiento (modo privado): el tema dura solo esta visita.
  }
  window.setTimeout(() => raiz.classList.remove("cambiando-tema"), 300);
  window.dispatchEvent(new Event(EVENTO_TEMA));
}
