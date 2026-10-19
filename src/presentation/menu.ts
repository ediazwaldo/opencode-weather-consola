// ─── Renderizado del menú y manejo de selección de opciones ─────────

import type { Almacenamiento } from "../types/index.ts";
import { cyan } from "../utils/colors.ts";

function linea(): string {
  return "════════════════════════════════════════";
}

export function mostrarMenu(datos: Almacenamiento): void {
  console.log(cyan(linea()));
  console.log(cyan("          WEATHER CLI"));
  console.log(cyan(linea()));
  console.log(cyan("  1. Clima de ciudad default"));
  console.log(cyan(`  2. Clima de todas las ciudades (${datos.ciudades.length})`));
  console.log(cyan("  3. Buscar y agregar ciudad"));
  console.log(cyan("  4. Eliminar ciudad"));
  console.log(cyan("  5. Establecer ciudad default"));
  console.log(cyan("  6. Pronóstico 7 días (ciudad default)"));
  console.log(cyan("  7. Próximamente"));
  console.log(cyan(`  8. Ajustes (°${datos.config.unidad})`));
  console.log(cyan("  9. Salir"));
  console.log(cyan(linea()));
}
