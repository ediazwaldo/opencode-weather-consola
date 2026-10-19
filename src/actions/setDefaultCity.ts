// ─── Establecer la ciudad por defecto ───────────────────────────────

import type { Almacenamiento } from "../types/index.ts";
import { establecerCiudadDefault } from "../storage/settingsStorage.ts";
import { leerEntrada } from "../presentation/input.ts";
import { mostrarAdvertencia, mostrarExito, mostrarError } from "../presentation/output.ts";

export async function establecerDefault(datos: Almacenamiento): Promise<void> {
  if (datos.ciudades.length === 0) {
    mostrarAdvertencia("No hay ciudades registradas.");
    return;
  }

  console.log("  Ciudades registradas:");
  datos.ciudades.forEach((c, i) => {
    const esDefault = c.nombre === datos.config.ciudadDefault ? " ← default" : "";
    console.log(`    ${i + 1}. ${c.nombre}${esDefault}`);
  });

  const entrada = await leerEntrada("  Número de la ciudad default: ");
  if (!entrada) {
    mostrarAdvertencia("No ingresaste ningún número.");
    return;
  }

  const numero = Number(entrada);
  const indice = numero - 1;
  const ciudad =
    numero >= 1 && numero <= datos.ciudades.length
      ? datos.ciudades[indice]
      : undefined;

  if (!ciudad) {
    mostrarError(`No se encontró la ciudad número "${entrada}".`);
    return;
  }

  establecerCiudadDefault(datos, ciudad.nombre);
  mostrarExito(`"${ciudad.nombre}" establecida como ciudad default.`);
}
