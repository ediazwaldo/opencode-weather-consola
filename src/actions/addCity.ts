// ─── Agregar una ciudad a la lista ──────────────────────────────────

import type { Almacenamiento } from "../types/index.ts";
import { buscarCiudad } from "../api/geocoding.ts";
import { agregarCiudad, existeCiudad } from "../storage/citiesStorage.ts";
import { leerEntrada } from "../presentation/input.ts";
import { amarillo } from "../utils/colors.ts";
import { mostrarAdvertencia, mostrarExito, mostrarInfo } from "../presentation/output.ts";

export async function buscarYAgregarCiudad(datos: Almacenamiento): Promise<void> {
  const nombre = await leerEntrada("  Nombre de la ciudad: ");
  if (!nombre) {
    mostrarAdvertencia("No ingresaste ningún nombre.");
    return;
  }

  console.log(`  🔍 Buscando "${nombre}"...`);

  let ciudad;
  try {
    ciudad = await buscarCiudad(nombre);
  } catch (error) {
    mostrarAdvertencia(
      `Error al buscar la ciudad: ${error instanceof Error ? error.message : error}`,
    );
    return;
  }

  if (!ciudad) {
    mostrarAdvertencia(`No se encontró la ciudad "${nombre}".`);
    return;
  }

  if (existeCiudad(datos, ciudad.nombre)) {
    mostrarInfo(`La ciudad "${ciudad.nombre}" ya está en tu lista.`);
    return;
  }

  const agregada = agregarCiudad(datos, ciudad);
  if (agregada) {
    mostrarExito(`Ciudad "${ciudad.nombre}" agregada correctamente.`);
    if (datos.config.ciudadDefault === ciudad.nombre) {
      console.log(amarillo("     Establecida como ciudad default."));
    }
  }
}
