import { describe, it, expect, spyOn } from "bun:test";
import { establecerDefault } from "../../src/actions/setDefaultCity.ts";
import type { Almacenamiento } from "../../src/types/index.ts";

function createTestData(): Almacenamiento {
  return {
    ciudades: [],
    config: { ciudadDefault: null, unidad: "C" },
  };
}

describe("establecerDefault", () => {
  it("debe mostrar advertencia si no hay ciudades", async () => {
    const datos = createTestData();
    datos.ciudades = [];
    const consoleSpy = spyOn(console, "log").mockImplementation(() => {});

    await establecerDefault(datos);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("No hay ciudades registradas"),
    );
    consoleSpy.mockRestore();
  });
});
