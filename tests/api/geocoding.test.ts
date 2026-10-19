import { describe, it, expect, afterEach } from "bun:test";
import { buscarCiudad } from "../../src/api/geocoding.ts";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

function mockFetch(response: Partial<Response>) {
  globalThis.fetch = (async () => response) as unknown as typeof fetch;
}

describe("buscarCiudad", () => {
  it("debe retornar la primera ciudad encontrada", async () => {
    const body = {
      results: [
        { name: "Buenos Aires", latitude: -34.6, longitude: -58.38 },
        { name: "Buenos Aires", latitude: -34.7, longitude: -58.5 },
      ],
    };
    mockFetch({ ok: true, json: async () => body });

    const result = await buscarCiudad("Buenos Aires");
    expect(result).toEqual({
      nombre: "Buenos Aires",
      lat: -34.6,
      lon: -58.38,
    });
  });

  it("debe retornar null si no hay resultados", async () => {
    mockFetch({ ok: true, json: async () => ({ results: [] }) });
    const result = await buscarCiudad("CiudadInexistente");
    expect(result).toBeNull();
  });

  it("debe retornar null si results es undefined", async () => {
    mockFetch({ ok: true, json: async () => ({}) });
    const result = await buscarCiudad("CiudadInexistente");
    expect(result).toBeNull();
  });

  it("debe lanzar error si la respuesta no es ok", async () => {
    mockFetch({ ok: false, status: 500 });
    await expect(buscarCiudad("Buenos Aires")).rejects.toThrow(
      "Error en geocoding: HTTP 500",
    );
  });

  it("debe codificar correctamente el nombre en la URL", async () => {
    let calledUrl = "";
    globalThis.fetch = (async (url: string | URL | Request) => {
      calledUrl = String(url);
      return {
        ok: true,
        json: async () => ({
          results: [{ name: "São Paulo", latitude: -23.55, longitude: -46.63 }],
        }),
      } as Response;
    }) as typeof fetch;

    await buscarCiudad("São Paulo");
    expect(calledUrl).toContain("S%C3%A3o%20Paulo");
  });

  it("debe usar los parámetros correctos en la URL", async () => {
    let calledUrl = "";
    globalThis.fetch = (async (url: string | URL | Request) => {
      calledUrl = String(url);
      return {
        ok: true,
        json: async () => ({
          results: [{ name: "Madrid", latitude: 40.42, longitude: -3.7 }],
        }),
      } as Response;
    }) as typeof fetch;

    await buscarCiudad("Madrid");
    expect(calledUrl).toContain("count=1");
    expect(calledUrl).toContain("language=es");
    expect(calledUrl).toContain("format=json");
  });
});
