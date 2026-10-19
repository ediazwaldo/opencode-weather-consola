import { describe, it, expect, afterEach } from "bun:test";
import { obtenerTemperatura, obtenerPronostico7Dias } from "../../src/api/weather.ts";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

function mockFetch(response: Partial<Response>) {
  globalThis.fetch = (async () => response) as unknown as typeof fetch;
}

describe("obtenerTemperatura", () => {
  it("debe retornar la temperatura actual", async () => {
    const body = { current: { temperature_2m: 22.5 } };
    mockFetch({ ok: true, json: async () => body });

    const temp = await obtenerTemperatura(40.42, -3.7);
    expect(temp).toBe(22.5);
  });

  it("debe construir la URL correctamente", async () => {
    let calledUrl = "";
    globalThis.fetch = (async (url: string | URL | Request) => {
      calledUrl = String(url);
      return { ok: true, json: async () => ({ current: { temperature_2m: 20 } }) } as Response;
    }) as typeof fetch;

    await obtenerTemperatura(48.85, 2.35);
    expect(calledUrl).toContain("latitude=48.85");
    expect(calledUrl).toContain("longitude=2.35");
    expect(calledUrl).toContain("current=temperature_2m");
  });

  it("debe lanzar error si la respuesta no es ok", async () => {
    mockFetch({ ok: false, status: 404 });
    await expect(obtenerTemperatura(0, 0)).rejects.toThrow(
      "Error en forecast: HTTP 404",
    );
  });

  it("debe lanzar error si no se encuentra la temperatura", async () => {
    mockFetch({ ok: true, json: async () => ({ current: {} }) });
    await expect(obtenerTemperatura(0, 0)).rejects.toThrow(
      "No se encontró la temperatura en la respuesta",
    );
  });
});

describe("obtenerPronostico7Dias", () => {
  it("debe retornar el pronóstico de 7 días", async () => {
    const body = {
      daily: {
        time: ["2026-10-19", "2026-10-20", "2026-10-21"],
        temperature_2m_max: [25, 26, 24],
        temperature_2m_min: [15, 16, 14],
        weathercode: [0, 1, 2],
      },
    };
    mockFetch({ ok: true, json: async () => body });

    const pronostico = await obtenerPronostico7Dias(40.42, -3.7);
    expect(pronostico).toHaveLength(3);
    expect(pronostico[0]).toEqual({
      fecha: "2026-10-19",
      tempMax: 25,
      tempMin: 15,
      codigoClima: 0,
    });
  });

  it("debe construir la URL correctamente", async () => {
    let calledUrl = "";
    globalThis.fetch = (async (url: string | URL | Request) => {
      calledUrl = String(url);
      return {
        ok: true,
        json: async () => ({
          daily: {
            time: ["2026-10-19"],
            temperature_2m_max: [25],
            temperature_2m_min: [15],
            weathercode: [0],
          },
        }),
      } as Response;
    }) as typeof fetch;

    await obtenerPronostico7Dias(48.85, 2.35);
    expect(calledUrl).toContain("latitude=48.85");
    expect(calledUrl).toContain("longitude=2.35");
    expect(calledUrl).toContain("daily=temperature_2m_max");
    expect(calledUrl).toContain("forecast_days=7");
  });

  it("debe lanzar error si la respuesta no es ok", async () => {
    mockFetch({ ok: false, status: 500 });
    await expect(obtenerPronostico7Dias(0, 0)).rejects.toThrow(
      "Error en forecast extendido: HTTP 500",
    );
  });

  it("debe lanzar error si no hay datos de pronóstico", async () => {
    mockFetch({ ok: true, json: async () => ({}) });
    await expect(obtenerPronostico7Dias(0, 0)).rejects.toThrow(
      "No se encontraron datos de pronóstico",
    );
  });

  it("debe lanzar error si los datos están incompletos", async () => {
    const body = {
      daily: {
        time: ["2026-10-19", "2026-10-20"],
        temperature_2m_max: [25],
        temperature_2m_min: [15, 16],
        weathercode: [0, 1],
      },
    };
    mockFetch({ ok: true, json: async () => body });
    await expect(obtenerPronostico7Dias(0, 0)).rejects.toThrow(
      "Datos incompletos en la respuesta del pronóstico",
    );
  });
});
