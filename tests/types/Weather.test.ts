import { describe, it, expect } from "bun:test";
import type {
  ResultadoGeocoding,
  RespuestaForecast,
  PronosticoDiario,
  RespuestaForecastExtendido,
} from "../../src/types/index.ts";

describe("tipos de Weather", () => {
  it("debe crear un ResultadoGeocoding válido", () => {
    const resultado: ResultadoGeocoding = {
      results: [
        {
          name: "Buenos Aires",
          latitude: -34.6,
          longitude: -58.38,
          country: "Argentina",
          admin1: "Buenos Aires",
        },
      ],
    };

    expect(resultado.results?.[0]?.name).toBe("Buenos Aires");
  });

  it("debe crear un RespuestaForecast válido", () => {
    const respuesta: RespuestaForecast = {
      current: {
        temperature_2m: 22.5,
      },
    };

    expect(respuesta.current?.temperature_2m).toBe(22.5);
  });

  it("debe crear un PronosticoDiario válido", () => {
    const pronostico: PronosticoDiario = {
      fecha: "2026-10-19",
      tempMax: 25,
      tempMin: 15,
      codigoClima: 0,
    };

    expect(pronostico.fecha).toBe("2026-10-19");
    expect(pronostico.tempMax).toBe(25);
  });

  it("debe crear un RespuestaForecastExtendido válido", () => {
    const respuesta: RespuestaForecastExtendido = {
      daily: {
        time: ["2026-10-19", "2026-10-20"],
        temperature_2m_max: [25, 26],
        temperature_2m_min: [15, 16],
        weathercode: [0, 1],
      },
    };

    expect(respuesta.daily.time).toHaveLength(2);
    expect(respuesta.daily.temperature_2m_max[0]).toBe(25);
  });
});
