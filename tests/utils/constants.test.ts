import { describe, it, expect } from "bun:test";
import {
  GEOCODING_URL,
  FORECAST_URL,
  ARCHIVO_DATA,
  ALMACENAMIENTO_INICIAL,
} from "../../src/utils/constants.ts";

describe("constantes de la app", () => {
  it("GEOCODING_URL debe ser la URL correcta", () => {
    expect(GEOCODING_URL).toBe("https://geocoding-api.open-meteo.com/v1/search");
  });

  it("FORECAST_URL debe ser la URL correcta", () => {
    expect(FORECAST_URL).toBe("https://api.open-meteo.com/v1/forecast");
  });

  it("ARCHIVO_DATA debe ser data.json", () => {
    expect(ARCHIVO_DATA).toBe("data.json");
  });

  it("ALMACENAMIENTO_INICIAL debe tener la estructura correcta", () => {
    expect(ALMACENAMIENTO_INICIAL.ciudades).toEqual([]);
    expect(ALMACENAMIENTO_INICIAL.config.ciudadDefault).toBeNull();
    expect(ALMACENAMIENTO_INICIAL.config.unidad).toBe("C");
  });
});
