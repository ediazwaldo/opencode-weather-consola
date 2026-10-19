// ─── Funciones para mostrar mensajes al usuario ─────────────────────

import { amarillo, rojo } from "../utils/colors.ts";

export function mostrarError(mensaje: string): void {
  console.error(rojo(`  ❌ ${mensaje}`));
}

export function mostrarExito(mensaje: string): void {
  console.log(amarillo(`  ✅ ${mensaje}`));
}

export function mostrarInfo(mensaje: string): void {
  console.log(`  ℹ️  ${mensaje}`);
}

export function mostrarAdvertencia(mensaje: string): void {
  console.log(`  ⚠️  ${mensaje}`);
}

export function limpiarPantalla(): void {
  process.stdout.write("\x1b[2J\x1b[0f");
}
