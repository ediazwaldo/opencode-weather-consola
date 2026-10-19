import { describe, it, expect, spyOn } from "bun:test";
import { pronostico7Dias } from "../../src/actions/getForecast.ts";
import type { Almacenamiento } from "../../src/types/index.ts";

function createTestData(): Almacenamiento {
  return {
    ciudades: [],
    config: { ciudadDefault: null, unidad: "C" },
  };
}

describe("pronostico7Dias", () => {
  it("debe mostrar advertencia si no hay ciudad default", async () => {
    const datos = createTestData();
    datos.config.ciudadDefault = null;
    const consoleSpy = spyOn(console, "log").mockImplementation(() => {});

    await pronostico7Dias(datos);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("No hay ciudad default establecida"),
    );
    consoleSpy.mockRestore();
  });

  it("debe mostrar advertencia si la ciudad default no existe", async () => {
    const datos = createTestData();
    datos.config.ciudadDefault = "Paris";
    const consoleSpy = spyOn(console, "log").mockImplementation(() => {});

    await pronostico7Dias(datos);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("La ciudad default ya no existe en tu lista"),
    );
    consoleSpy.mockRestore();
  });
});
