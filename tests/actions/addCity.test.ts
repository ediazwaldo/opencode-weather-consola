import { describe, it, expect, spyOn, beforeEach } from "bun:test";
import { buscarYAgregarCiudad } from "../../src/actions/addCity.ts";
import type { Almacenamiento } from "../../src/types/index.ts";

function createTestData(): Almacenamiento {
  return {
    ciudades: [],
    config: { ciudadDefault: null, unidad: "C" },
  };
}

describe("buscarYAgregarCiudad", () => {
  it("debe mostrar advertencia si no se ingresa nombre", async () => {
    const datos = createTestData();
    const consoleSpy = spyOn(console, "log").mockImplementation(() => {});

    // Simular entrada vacía
    const { leerEntrada } = await import("../../src/presentation/input.ts");
    spyOn(await import("../../src/presentation/input.ts"), "leerEntrada").mockResolvedValue("");

    await buscarYAgregarCiudad(datos);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("No ingresaste ningún nombre"),
    );
    consoleSpy.mockRestore();
  });
});
