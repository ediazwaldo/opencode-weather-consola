// ─── Tipos compartidos ───────────────────────────────────────────────

export interface Ciudad {
  nombre: string;
  lat: number;
  lon: number;
}

export interface Configuracion {
  ciudadDefault: string | null; // nombre de la ciudad
  unidad: "C" | "F";
}

export interface Almacenamiento {
  ciudades: Ciudad[];
  config: Configuracion;
}

// ─── Respuestas de las APIs de OpenMeteo ────────────────────────────

export interface ResultadoGeocoding {
  results?: Array<{
    name: string;
    latitude: number;
    longitude: number;
    country?: string;
    admin1?: string;
  }>;
}

export interface RespuestaForecast {
  current?: {
    temperature_2m: number;
  };
}

export interface PronosticoDiario {
  fecha: string;
  tempMax: number;
  tempMin: number;
  codigoClima: number;
}

export interface RespuestaForecastExtendido {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weathercode: number[];
  };
}
