// ─── Constantes generales de la app ─────────────────────────────────

export const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
export const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
export const ARCHIVO_DATA = "data.json";

export const ALMACENAMIENTO_INICIAL: {
  ciudades: never[];
  config: {
    ciudadDefault: null;
    unidad: "C" | "F";
  };
} = {
  ciudades: [],
  config: {
    ciudadDefault: null,
    unidad: "C",
  },
};
