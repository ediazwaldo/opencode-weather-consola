// ─── Comunicación con las APIs de OpenMeteo ─────────────────────────

import type { Ciudad, ResultadoGeocoding, RespuestaForecast } from "./types";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

/**
 * Reintenta el fetch hasta `maxIntentos` veces con delay creciente
 * si la conexión falla (ECONNRESET, timeouts, etc.).
 */
async function fetchConReintento(url: string, maxIntentos = 3): Promise<Response> {
  for (let intento = 1; intento <= maxIntentos; intento++) {
    try {
      const res = await fetch(url);
      return res;
    } catch (error) {
      if (intento === maxIntentos) throw error;
      await new Promise((r) => setTimeout(r, 300 * intento));
    }
  }
  throw new Error("No debería llegar aquí");
}

/**
 * Busca una ciudad por nombre y devuelve la primera coincidencia.
 * Retorna null si no se encuentra ningún resultado.
 */
export async function buscarCiudad(nombre: string): Promise<Ciudad | null> {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(nombre)}&count=1&language=es&format=json`;

  const res = await fetchConReintento(url);
  if (!res.ok) {
    throw new Error(`Error en geocoding: ${res.status}`);
  }

  const data = (await res.json()) as ResultadoGeocoding;
  const primerResultado = data.results?.[0];

  if (!primerResultado) {
    return null;
  }

  return {
    nombre: primerResultado.name,
    lat: primerResultado.latitude,
    lon: primerResultado.longitude,
  };
}

/**
 * Obtiene la temperatura actual (en °C) para unas coordenadas dadas.
 */
export async function obtenerTemperatura(
  lat: number,
  lon: number,
): Promise<number> {
  const url = `${FORECAST_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m`;

  const res = await fetchConReintento(url);
  if (!res.ok) {
    throw new Error(`Error en forecast: ${res.status}`);
  }

  const data = (await res.json()) as RespuestaForecast;
  const temp = data.current?.temperature_2m;

  if (temp === undefined) {
    throw new Error("No se encontró la temperatura en la respuesta");
  }

  return temp;
}
