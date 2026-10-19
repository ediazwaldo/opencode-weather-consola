// ─── Utilidades de colores ANSI para consola ─────────────────────────

const CYAN = "\x1b[96m";
const AMARILLO = "\x1b[33m";
const ROJO = "\x1b[31m";
const RESET = "\x1b[0m";

export function cyan(texto: string): string {
  return `${CYAN}${texto}${RESET}`;
}

export function amarillo(texto: string): string {
  return `${AMARILLO}${texto}${RESET}`;
}

export function rojo(texto: string): string {
  return `${ROJO}${texto}${RESET}`;
}
