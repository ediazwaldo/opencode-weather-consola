// ─── Lógica para obtener coordenadas de una ciudad ───────────────────

import type { Ciudad, ResultadoGeocoding } from "../types/index.ts";
import { GEOCODING_URL } from "../utils/constants.ts";

async function fetchConReintento(url: string, maxIntentos = 3): Promise<Response> {
  for (let intento = 1; intento <= maxIntentos; intento++) {
    try {
      return await fetch(url);
    } catch (error) {
      if (intento === maxIntentos) throw error;
      await new Promise((r) => setTimeout(r, 300 * intento));
    }
  }
  throw new Error("No se pudo completar la petición");
}

export async function buscarCiudad(nombre: string): Promise<Ciudad | null> {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(nombre)}&count=1&language=es&format=json`;

  const res = await fetchConReintento(url);
  if (!res.ok) {
    throw new Error(`Error en geocoding: HTTP ${res.status}`);
  }

  const data = (await res.json()) as ResultadoGeocoding;
  const primerResultado = data.results?.[0];

  if (!primerResultado) return null;

  return {
    nombre: primerResultado.name,
    lat: primerResultado.latitude,
    lon: primerResultado.longitude,
  };
}
