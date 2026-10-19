import { describe, it, expect, spyOn } from "bun:test";
import { eliminarCiudadAction } from "../../src/actions/removeCity.ts";
import type { Almacenamiento } from "../../src/types/index.ts";

function createTestData(): Almacenamiento {
  return {
    ciudades: [],
    config: { ciudadDefault: null, unidad: "C" },
  };
}

describe("eliminarCiudadAction", () => {
  it("debe mostrar advertencia si no hay ciudades", async () => {
    const datos = createTestData();
    datos.ciudades = [];
    const consoleSpy = spyOn(console, "log").mockImplementation(() => {});

    await eliminarCiudadAction(datos);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("No hay ciudades para eliminar"),
    );
    consoleSpy.mockRestore();
  });
});
