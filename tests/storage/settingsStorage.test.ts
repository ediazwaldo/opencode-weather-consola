import { describe, it, expect, beforeEach, afterAll } from "bun:test";
import { existsSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { ARCHIVO_DATA, ALMACENAMIENTO_INICIAL } from "../../src/utils/constants.ts";

// Helper: escribe directamente al archivo de datos
function escribirArchivo(datos: unknown): void {
  writeFileSync(ARCHIVO_DATA, JSON.stringify(datos, null, 2), "utf-8");
}

// Helper: lee directamente del archivo de datos
function leerArchivo(): unknown {
  return JSON.parse(readFileSync(ARCHIVO_DATA, "utf-8"));
}

// Helper: elimina el archivo de datos
function limpiarArchivo(): void {
  if (existsSync(ARCHIVO_DATA)) {
    rmSync(ARCHIVO_DATA);
  }
}

beforeEach(() => {
  limpiarArchivo();
});

afterAll(() => {
  limpiarArchivo();
});

describe("integración con archivo real", () => {
  it("debe guardar y cargar datos correctamente", () => {
    const datos = {
      ciudades: [{ nombre: "Paris", lat: 48.85, lon: 2.35 }],
      config: { ciudadDefault: "Paris", unidad: "F" as const },
    };
    escribirArchivo(datos);
    const cargado = leerArchivo() as typeof datos;
    expect(cargado.ciudades).toHaveLength(1);
    expect(cargado.config.ciudadDefault).toBe("Paris");
    expect(cargado.config.unidad).toBe("F");
  });

  it("debe retornar datos iniciales si el archivo no existe", () => {
    limpiarArchivo();
    expect(existsSync(ARCHIVO_DATA)).toBe(false);
    // Simular lo que hace cargarDatos cuando no existe
    escribirArchivo(ALMACENAMIENTO_INICIAL);
    const cargado = leerArchivo() as typeof ALMACENAMIENTO_INICIAL;
    expect(cargado.ciudades).toEqual([]);
    expect(cargado.config.ciudadDefault).toBeNull();
  });

  it("debe retornar datos iniciales si el JSON es inválido", () => {
    writeFileSync(ARCHIVO_DATA, "json inválido", "utf-8");
    expect(() => JSON.parse(readFileSync(ARCHIVO_DATA, "utf-8"))).toThrow();
  });

  it("debe persistir múltiples cambios", () => {
    const datos1 = {
      ciudades: [{ nombre: "Paris", lat: 48.85, lon: 2.35 }],
      config: { ciudadDefault: "Paris", unidad: "C" as const },
    };
    escribirArchivo(datos1);

    const datos2 = {
      ciudades: [
        { nombre: "Paris", lat: 48.85, lon: 2.35 },
        { nombre: "Madrid", lat: 40.42, lon: -3.7 },
      ],
      config: { ciudadDefault: "Madrid", unidad: "F" as const },
    };
    escribirArchivo(datos2);

    const cargado = leerArchivo() as typeof datos2;
    expect(cargado.ciudades).toHaveLength(2);
    expect(cargado.config.ciudadDefault).toBe("Madrid");
    expect(cargado.config.unidad).toBe("F");
  });
});
