// ─── Persistencia de ciudades guardadas ─────────────────────────────

import type { Almacenamiento, Ciudad } from "../types/index.ts";
import { guardarDatos } from "./settingsStorage.ts";

export function existeCiudad(datos: Almacenamiento, nombre: string): boolean {
  return datos.ciudades.some(
    (c) => c.nombre.toLowerCase() === nombre.toLowerCase(),
  );
}

export function obtenerCiudadPorNombre(
  datos: Almacenamiento,
  nombre: string,
): Ciudad | undefined {
  return datos.ciudades.find(
    (c) => c.nombre.toLowerCase() === nombre.toLowerCase(),
  );
}

export function agregarCiudad(datos: Almacenamiento, ciudad: Ciudad): boolean {
  if (existeCiudad(datos, ciudad.nombre)) return false;

  datos.ciudades.push(ciudad);

  if (datos.config.ciudadDefault === null) {
    datos.config.ciudadDefault = ciudad.nombre;
  }

  guardarDatos(datos);
  return true;
}

export function eliminarCiudad(datos: Almacenamiento, nombre: string): boolean {
  const indice = datos.ciudades.findIndex(
    (c) => c.nombre.toLowerCase() === nombre.toLowerCase(),
  );
  if (indice === -1) return false;

  const ciudadEliminada = datos.ciudades[indice];
  if (ciudadEliminada) {
    datos.ciudades.splice(indice, 1);

    if (datos.config.ciudadDefault === ciudadEliminada.nombre) {
      datos.config.ciudadDefault = datos.ciudades[0]?.nombre ?? null;
    }
  }

  guardarDatos(datos);
  return true;
}
