import { describe, it, expect, spyOn } from "bun:test";
import { mostrarError, mostrarExito, mostrarInfo, mostrarAdvertencia, limpiarPantalla } from "../../src/presentation/output.ts";

describe("mostrarError", () => {
  it("debe mostrar mensaje de error en rojo", () => {
    const consoleSpy = spyOn(console, "error").mockImplementation(() => {});

    mostrarError("Error de prueba");

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Error de prueba"),
    );
    consoleSpy.mockRestore();
  });
});

describe("mostrarExito", () => {
  it("debe mostrar mensaje de éxito en amarillo", () => {
    const consoleSpy = spyOn(console, "log").mockImplementation(() => {});

    mostrarExito("Éxito de prueba");

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Éxito de prueba"),
    );
    consoleSpy.mockRestore();
  });
});

describe("mostrarInfo", () => {
  it("debe mostrar mensaje de info", () => {
    const consoleSpy = spyOn(console, "log").mockImplementation(() => {});

    mostrarInfo("Info de prueba");

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Info de prueba"),
    );
    consoleSpy.mockRestore();
  });
});

describe("mostrarAdvertencia", () => {
  it("debe mostrar mensaje de advertencia", () => {
    const consoleSpy = spyOn(console, "log").mockImplementation(() => {});

    mostrarAdvertencia("Advertencia de prueba");

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Advertencia de prueba"),
    );
    consoleSpy.mockRestore();
  });
});

describe("limpiarPantalla", () => {
  it("debe escribir secuencia de escape para limpiar pantalla", () => {
    const writeSpy = spyOn(process.stdout, "write").mockImplementation(() => true);

    limpiarPantalla();

    expect(writeSpy).toHaveBeenCalledWith("\x1b[2J\x1b[0f");
    writeSpy.mockRestore();
  });
});
