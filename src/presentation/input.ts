// ─── Funciones para capturar y validar inputs del usuario ────────────

import { createInterface } from "node:readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

export function leerEntrada(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (respuesta) => {
      resolve(respuesta.trim());
    });
  });
}
