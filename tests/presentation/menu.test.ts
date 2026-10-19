import { describe, it, expect, spyOn } from "bun:test";
import { mostrarMenu } from "../../src/presentation/menu.ts";
import type { Almacenamiento } from "../../src/types/index.ts";

function createTestData(): Almacenamiento {
  return {
    ciudades: [],
    config: { ciudadDefault: null, unidad: "C" },
  };
}

describe("mostrarMenu", () => {
  it("debe mostrar el menú con todas las opciones", () => {
    const consoleSpy = spyOn(console, "log").mockImplementation(() => {});
    const datos = createTestData();

    mostrarMenu(datos);

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("WEATHER CLI"));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("1. Clima de ciudad default"));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("2. Clima de todas las ciudades"));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("3. Buscar y agregar ciudad"));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("4. Eliminar ciudad"));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("5. Establecer ciudad default"));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("9. Salir"));

    consoleSpy.mockRestore();
  });

  it("debe mostrar la cantidad de ciudades en la opción 2", () => {
    const consoleSpy = spyOn(console, "log").mockImplementation(() => {});
    const datos = createTestData();
    datos.ciudades = [
      { nombre: "Paris", lat: 48.85, lon: 2.35 },
      { nombre: "Madrid", lat: 40.42, lon: -3.7 },
    ];

    mostrarMenu(datos);

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("(2)"));

    consoleSpy.mockRestore();
  });

  it("debe mostrar la unidad actual en la opción 8", () => {
    const consoleSpy = spyOn(console, "log").mockImplementation(() => {});
    const datos = createTestData();
    datos.config.unidad = "F";

    mostrarMenu(datos);

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("°F"));

    consoleSpy.mockRestore();
  });
});
