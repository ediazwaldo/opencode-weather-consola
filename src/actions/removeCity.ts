// ─── Eliminar una ciudad ────────────────────────────────────────────

import type { Almacenamiento } from "../types/index.ts";
import { eliminarCiudad } from "../storage/citiesStorage.ts";
import { leerEntrada } from "../presentation/input.ts";
import { rojo } from "../utils/colors.ts";
import { mostrarAdvertencia, mostrarExito, mostrarError } from "../presentation/output.ts";

export async function eliminarCiudadAction(datos: Almacenamiento): Promise<void> {
  if (datos.ciudades.length === 0) {
    mostrarAdvertencia("No hay ciudades para eliminar.");
    return;
  }

  console.log("  Ciudades registradas:");
  datos.ciudades.forEach((c, i) => {
    console.log(`    ${i + 1}. ${c.nombre}`);
  });

  const entrada = await leerEntrada("  Número de la ciudad a eliminar: ");
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

  const eliminada = eliminarCiudad(datos, ciudad.nombre);
  if (eliminada) {
    mostrarExito(`Ciudad "${ciudad.nombre}" eliminada.`);
  } else {
    mostrarError(`No se encontró la ciudad "${ciudad.nombre}".`);
  }
}
