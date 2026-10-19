// ─── Tipos de respuestas de APIs OpenMeteo ──────────────────────────

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
