import { describe, it, expect, beforeEach, afterAll } from "bun:test";
import { existsSync, rmSync } from "node:fs";
import {
  existeCiudad,
  obtenerCiudadPorNombre,
  agregarCiudad,
  eliminarCiudad,
} from "../../src/storage/citiesStorage.ts";
import type { Almacenamiento, Ciudad } from "../../src/types/index.ts";
import { ARCHIVO_DATA } from "../../src/utils/constants.ts";

function createTestData(): Almacenamiento {
  return {
    ciudades: [],
    config: { ciudadDefault: null, unidad: "C" },
  };
}

beforeEach(() => {
  if (existsSync(ARCHIVO_DATA)) {
    rmSync(ARCHIVO_DATA);
  }
});

afterAll(() => {
  if (existsSync(ARCHIVO_DATA)) {
    rmSync(ARCHIVO_DATA);
  }
});

describe("existeCiudad", () => {
  it("debe retornar true si la ciudad existe", () => {
    const datos = createTestData();
    datos.ciudades.push({ nombre: "Buenos Aires", lat: -34.6, lon: -58.38 });
    expect(existeCiudad(datos, "Buenos Aires")).toBe(true);
  });

  it("debe retornar false si la ciudad no existe", () => {
    const datos = createTestData();
    expect(existeCiudad(datos, "Buenos Aires")).toBe(false);
  });

  it("debe ser case-insensitive", () => {
    const datos = createTestData();
    datos.ciudades.push({ nombre: "Buenos Aires", lat: -34.6, lon: -58.38 });
    expect(existeCiudad(datos, "buenos aires")).toBe(true);
    expect(existeCiudad(datos, "BUENOS AIRES")).toBe(true);
  });
});

describe("obtenerCiudadPorNombre", () => {
  it("debe retornar la ciudad si existe", () => {
    const datos = createTestData();
    const ciudad: Ciudad = { nombre: "Madrid", lat: 40.42, lon: -3.7 };
    datos.ciudades.push(ciudad);
    expect(obtenerCiudadPorNombre(datos, "Madrid")).toEqual(ciudad);
  });

  it("debe retornar undefined si no existe", () => {
    const datos = createTestData();
    expect(obtenerCiudadPorNombre(datos, "Madrid")).toBeUndefined();
  });

  it("debe ser case-insensitive", () => {
    const datos = createTestData();
    const ciudad: Ciudad = { nombre: "Madrid", lat: 40.42, lon: -3.7 };
    datos.ciudades.push(ciudad);
    expect(obtenerCiudadPorNombre(datos, "madrid")).toEqual(ciudad);
  });
});

describe("agregarCiudad", () => {
  it("debe agregar una ciudad nueva y retornar true", () => {
    const datos = createTestData();
    const ciudad: Ciudad = { nombre: "Paris", lat: 48.85, lon: 2.35 };
    const resultado = agregarCiudad(datos, ciudad);
    expect(resultado).toBe(true);
    expect(datos.ciudades).toHaveLength(1);
    expect(datos.ciudades[0]?.nombre).toBe("Paris");
  });

  it("debe establecer la ciudad default si es la primera", () => {
    const datos = createTestData();
    const ciudad: Ciudad = { nombre: "Paris", lat: 48.85, lon: 2.35 };
    agregarCiudad(datos, ciudad);
    expect(datos.config.ciudadDefault).toBe("Paris");
  });

  it("debe retornar false si la ciudad ya existe", () => {
    const datos = createTestData();
    const ciudad: Ciudad = { nombre: "Paris", lat: 48.85, lon: 2.35 };
    agregarCiudad(datos, ciudad);
    const resultado = agregarCiudad(datos, ciudad);
    expect(resultado).toBe(false);
    expect(datos.ciudades).toHaveLength(1);
  });

  it("no debe sobrescribir el default si ya existe", () => {
    const datos = createTestData();
    datos.config.ciudadDefault = "Madrid";
    const ciudad: Ciudad = { nombre: "Paris", lat: 48.85, lon: 2.35 };
    agregarCiudad(datos, ciudad);
    expect(datos.config.ciudadDefault).toBe("Madrid");
  });
});

describe("eliminarCiudad", () => {
  it("debe eliminar una ciudad y retornar true", () => {
    const datos = createTestData();
    datos.ciudades.push({ nombre: "Paris", lat: 48.85, lon: 2.35 });
    const resultado = eliminarCiudad(datos, "Paris");
    expect(resultado).toBe(true);
    expect(datos.ciudades).toHaveLength(0);
  });

  it("debe retornar false si la ciudad no existe", () => {
    const datos = createTestData();
    const resultado = eliminarCiudad(datos, "Paris");
    expect(resultado).toBe(false);
  });

  it("debe actualizar el default si se elimina la ciudad default", () => {
    const datos = createTestData();
    datos.ciudades.push({ nombre: "Paris", lat: 48.85, lon: 2.35 });
    datos.ciudades.push({ nombre: "Madrid", lat: 40.42, lon: -3.7 });
    datos.config.ciudadDefault = "Paris";
    eliminarCiudad(datos, "Paris");
    expect(datos.config.ciudadDefault).toBe("Madrid");
  });

  it("debe setear default a null si no quedan ciudades", () => {
    const datos = createTestData();
    datos.ciudades.push({ nombre: "Paris", lat: 48.85, lon: 2.35 });
    datos.config.ciudadDefault = "Paris";
    eliminarCiudad(datos, "Paris");
    expect(datos.config.ciudadDefault).toBeNull();
  });
});
