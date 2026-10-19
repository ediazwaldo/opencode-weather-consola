import { describe, it, expect, spyOn } from "bun:test";
import { climaCiudadDefault, climaTodasLasCiudades } from "../../src/actions/getWeather.ts";
import type { Almacenamiento, Ciudad } from "../../src/types/index.ts";

function createTestData(): Almacenamiento {
  return {
    ciudades: [],
    config: { ciudadDefault: null, unidad: "C" },
  };
}

describe("climaCiudadDefault", () => {
  it("debe mostrar advertencia si no hay ciudad default", async () => {
    const datos = createTestData();
    datos.config.ciudadDefault = null;
    const consoleSpy = spyOn(console, "log").mockImplementation(() => {});

    await climaCiudadDefault(datos);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("No hay ciudad default establecida"),
    );
    consoleSpy.mockRestore();
  });

  it("debe mostrar advertencia si la ciudad default no existe", async () => {
    const datos = createTestData();
    datos.config.ciudadDefault = "Paris";
    const consoleSpy = spyOn(console, "log").mockImplementation(() => {});

    await climaCiudadDefault(datos);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("La ciudad default ya no existe en tu lista"),
    );
    consoleSpy.mockRestore();
  });
});

describe("climaTodasLasCiudades", () => {
  it("debe mostrar advertencia si no hay ciudades", async () => {
    const datos = createTestData();
    datos.ciudades = [];
    const consoleSpy = spyOn(console, "log").mockImplementation(() => {});

    await climaTodasLasCiudades(datos);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("No hay ciudades registradas"),
    );
    consoleSpy.mockRestore();
  });
});
