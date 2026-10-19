// ─── Obtener clima actual de una ciudad ─────────────────────────────

import type { Almacenamiento, Ciudad } from "../types/index.ts";
import { obtenerTemperatura } from "../api/weather.ts";
import { convertirTemp } from "../utils/format.ts";
import { amarillo } from "../utils/colors.ts";
import { mostrarError, mostrarAdvertencia } from "../presentation/output.ts";
import { obtenerCiudadPorNombre } from "../storage/citiesStorage.ts";

async function mostrarClimaCiudad(
  ciudad: Ciudad,
  datos: Almacenamiento,
): Promise<void> {
  try {
    const temp = await obtenerTemperatura(ciudad.lat, ciudad.lon);
    const tempConvertida = convertirTemp(temp, datos.config.unidad);
    console.log(
      amarillo(
        `  📍 ${ciudad.nombre}: ${tempConvertida.toFixed(1)}°${datos.config.unidad}`,
      ),
    );
  } catch (error) {
    mostrarError(
      `Error para ${ciudad.nombre}: ${error instanceof Error ? error.message : error}`,
    );
  }
}

export async function climaCiudadDefault(datos: Almacenamiento): Promise<void> {
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

  await mostrarClimaCiudad(ciudad, datos);
}

export async function climaTodasLasCiudades(datos: Almacenamiento): Promise<void> {
  if (datos.ciudades.length === 0) {
    mostrarAdvertencia("No hay ciudades registradas.");
    console.log("     Usa la opción 3 para agregar una ciudad.");
    return;
  }

  for (const ciudad of datos.ciudades) {
    await mostrarClimaCiudad(ciudad, datos);
  }
}
