// ─── Persistencia en archivo JSON local ─────────────────────────────

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import type { Almacenamiento, Ciudad } from "./types";

const ARCHIVO_DATA = "data.json";

const ALMACENAMIENTO_INICIAL: Almacenamiento = {
  ciudades: [],
  config: {
    ciudadDefault: null,
    unidad: "C",
  },
};

/** Carga los datos desde data.json. Si no existe, crea uno nuevo. */
export function cargarDatos(): Almacenamiento {
  if (!existsSync(ARCHIVO_DATA)) {
    guardarDatos(ALMACENAMIENTO_INICIAL);
    return ALMACENAMIENTO_INICIAL;
  }

  try {
    const crudo = readFileSync(ARCHIVO_DATA, "utf-8");
    return JSON.parse(crudo) as Almacenamiento;
  } catch {
    return ALMACENAMIENTO_INICIAL;
  }
}

/** Guarda los datos en data.json. */
export function guardarDatos(datos: Almacenamiento): void {
  writeFileSync(ARCHIVO_DATA, JSON.stringify(datos, null, 2), "utf-8");
}

/** Agrega una ciudad si no existe ya (por nombre). */
export function agregarCiudad(datos: Almacenamiento, ciudad: Ciudad): boolean {
  const existe = datos.ciudades.some(
    (c) => c.nombre.toLowerCase() === ciudad.nombre.toLowerCase(),
  );
  if (existe) return false;

  datos.ciudades.push(ciudad);

  // Si es la primera ciudad, la establecemos como default
  if (datos.config.ciudadDefault === null) {
    datos.config.ciudadDefault = ciudad.nombre;
  }

  guardarDatos(datos);
  return true;
}

/** Elimina una ciudad por nombre. */
export function eliminarCiudad(datos: Almacenamiento, nombre: string): boolean {
  const indice = datos.ciudades.findIndex(
    (c) => c.nombre.toLowerCase() === nombre.toLowerCase(),
  );
  if (indice === -1) return false;

  const ciudadEliminada = datos.ciudades[indice];
  if (ciudadEliminada) {
    datos.ciudades.splice(indice, 1);

    // Si eliminamos la ciudad default, ponemos otra o null
    if (datos.config.ciudadDefault === ciudadEliminada.nombre) {
      datos.config.ciudadDefault = datos.ciudades[0]?.nombre ?? null;
    }
  }

  guardarDatos(datos);
  return true;
}
