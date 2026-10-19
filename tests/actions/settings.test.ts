import { describe, it, expect, spyOn } from "bun:test";
import { ajustes } from "../../src/actions/settings.ts";
import type { Almacenamiento } from "../../src/types/index.ts";

function createTestData(): Almacenamiento {
  return {
    ciudades: [],
    config: { ciudadDefault: null, unidad: "C" },
  };
}

describe("ajustes", () => {
  it("debe mostrar las opciones de unidad", async () => {
    const datos = createTestData();
    const consoleSpy = spyOn(console, "log").mockImplementation(() => {});

    // Simular entrada inválida para evitar esperar input
    spyOn(await import("../../src/presentation/input.ts"), "leerEntrada").mockResolvedValue("3");

    await ajustes(datos);

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Unidad actual"));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Celsius"));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Fahrenheit"));
    consoleSpy.mockRestore();
  });
});
