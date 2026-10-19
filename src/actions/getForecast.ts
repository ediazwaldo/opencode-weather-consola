// ─── Pronóstico del clima para los próximos 7 días ───────────────────

import type { Almacenamiento } from "../types/index.ts";
import { obtenerPronostico7Dias } from "../api/weather.ts";
import { convertirTemp, describirClima } from "../utils/format.ts";
import { amarillo } from "../utils/colors.ts";
import { mostrarError, mostrarAdvertencia } from "../presentation/output.ts";
import { obtenerCiudadPorNombre } from "../storage/citiesStorage.ts";

export async function pronostico7Dias(datos: Almacenamiento): Promise<void> {
  const nombre = datos.config.ciudadDefault;
  if (!nombre) {
    mostrarAdvertencia("No hay ciudad default establecida.");
    console.log("     Usa la opción 3 para agregar una ciudad.");
    return;
  }

  const ciudad = obtenerCiudadPorNombre(datos, nombre);
  if (!ciudad) {
    mostrarAdvertencia("La ciudad default ya no existe en tu lista.");
    return;
  }

  try {
    const pronostico = await obtenerPronostico7Dias(ciudad.lat, ciudad.lon);
    console.log(amarillo(`  Pronóstico para ${ciudad.nombre} — próximos 7 días:`));
    console.log();
    console.log(
      `  ${"Fecha".padEnd(12)} ${"Mín".padStart(6)} ${"Máx".padStart(6)}  Clima`,
    );
    console.log(
      `  ${"─".repeat(12)} ${"─".repeat(6)} ${"─".repeat(6)}  ${"─".repeat(20)}`,
    );
    for (const dia of pronostico) {
      const tempMin = convertirTemp(dia.tempMin, datos.config.unidad).toFixed(1);
      const tempMax = convertirTemp(dia.tempMax, datos.config.unidad).toFixed(1);
      console.log(
        `  ${dia.fecha.padEnd(12)} ${tempMin.padStart(5)}°${datos.config.unidad} ${tempMax.padStart(5)}°${datos.config.unidad}  ${describirClima(dia.codigoClima)}`,
      );
    }
  } catch (error) {
    mostrarError(
      `Error al obtener el pronóstico: ${error instanceof Error ? error.message : error}`,
    );
  }
}
