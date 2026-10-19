// ─── Lógica para obtener el clima actual y pronóstico ────────────────

import type {
  PronosticoDiario,
  RespuestaForecast,
  RespuestaForecastExtendido,
} from "../types/index.ts";
import { FORECAST_URL } from "../utils/constants.ts";

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

export async function obtenerTemperatura(
  lat: number,
  lon: number,
): Promise<number> {
  const url = `${FORECAST_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m`;

  const res = await fetchConReintento(url);
  if (!res.ok) {
    throw new Error(`Error en forecast: HTTP ${res.status}`);
  }

  const data = (await res.json()) as RespuestaForecast;
  const temp = data.current?.temperature_2m;

  if (temp === undefined) {
    throw new Error("No se encontró la temperatura en la respuesta");
  }

  return temp;
}

export async function obtenerPronostico7Dias(
  lat: number,
  lon: number,
): Promise<PronosticoDiario[]> {
  const url = `${FORECAST_URL}?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&forecast_days=7`;

  const res = await fetchConReintento(url);
  if (!res.ok) {
    throw new Error(`Error en forecast extendido: HTTP ${res.status}`);
  }

  const data = (await res.json()) as RespuestaForecastExtendido;
  const daily = data.daily;

  if (!daily || !daily.time || daily.time.length === 0) {
    throw new Error("No se encontraron datos de pronóstico");
  }

  const pronostico: PronosticoDiario[] = [];
  for (let i = 0; i < daily.time.length; i++) {
    const fecha = daily.time[i];
    const tempMax = daily.temperature_2m_max[i];
    const tempMin = daily.temperature_2m_min[i];
    const codigoClima = daily.weathercode[i];

    if (fecha === undefined || tempMax === undefined || tempMin === undefined || codigoClima === undefined) {
      throw new Error("Datos incompletos en la respuesta del pronóstico");
    }

    pronostico.push({ fecha, tempMax, tempMin, codigoClima });
  }

  return pronostico;
}
