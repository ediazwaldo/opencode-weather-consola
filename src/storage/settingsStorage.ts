// ─── Persistencia de configuración y preferencias ───────────────────

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import type { Almacenamiento } from "../types/index.ts";
import { ALMACENAMIENTO_INICIAL, ARCHIVO_DATA } from "../utils/constants.ts";

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

export function guardarDatos(datos: Almacenamiento): void {
  writeFileSync(ARCHIVO_DATA, JSON.stringify(datos, null, 2), "utf-8");
}

export function establecerCiudadDefault(datos: Almacenamiento, nombre: string): void {
  datos.config.ciudadDefault = nombre;
  guardarDatos(datos);
}

export function cambiarUnidad(datos: Almacenamiento, unidad: "C" | "F"): void {
  datos.config.unidad = unidad;
  guardarDatos(datos);
}
