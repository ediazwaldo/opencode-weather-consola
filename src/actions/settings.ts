// ─── Ajustes (unidad °C/°F) ─────────────────────────────────────────

import type { Almacenamiento } from "../types/index.ts";
import { cambiarUnidad } from "../storage/settingsStorage.ts";
import { leerEntrada } from "../presentation/input.ts";
import { mostrarAdvertencia, mostrarExito } from "../presentation/output.ts";

export async function ajustes(datos: Almacenamiento): Promise<void> {
  console.log(`  Unidad actual: °${datos.config.unidad}`);
  console.log("  1. Celsius (°C)");
  console.log("  2. Fahrenheit (°F)");

  const opcion = await leerEntrada("  Selecciona una opción: ");
  if (opcion === "1") {
    cambiarUnidad(datos, "C");
    mostrarExito("Unidad cambiada a °C.");
  } else if (opcion === "2") {
    cambiarUnidad(datos, "F");
    mostrarExito("Unidad cambiada a °F.");
  } else {
    mostrarAdvertencia("Opción no válida.");
  }
}
