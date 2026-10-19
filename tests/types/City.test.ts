import { describe, it, expect } from "bun:test";
import type { Ciudad, Configuracion, Almacenamiento } from "../../src/types/index.ts";

describe("tipos de Ciudad", () => {
  it("debe crear una ciudad válida", () => {
    const ciudad: Ciudad = {
      nombre: "Buenos Aires",
      lat: -34.6,
      lon: -58.38,
    };

    expect(ciudad.nombre).toBe("Buenos Aires");
    expect(ciudad.lat).toBe(-34.6);
    expect(ciudad.lon).toBe(-58.38);
  });
});

describe("tipos de Configuracion", () => {
  it("debe crear una configuración válida con ciudad default", () => {
    const config: Configuracion = {
      ciudadDefault: "Paris",
      unidad: "C",
    };

    expect(config.ciudadDefault).toBe("Paris");
    expect(config.unidad).toBe("C");
  });

  it("debe crear una configuración válida sin ciudad default", () => {
    const config: Configuracion = {
      ciudadDefault: null,
      unidad: "F",
    };

    expect(config.ciudadDefault).toBeNull();
    expect(config.unidad).toBe("F");
  });
});

describe("tipos de Almacenamiento", () => {
  it("debe crear un almacenamiento válido", () => {
    const almacenamiento: Almacenamiento = {
      ciudades: [
        { nombre: "Paris", lat: 48.85, lon: 2.35 },
        { nombre: "Madrid", lat: 40.42, lon: -3.7 },
      ],
      config: {
        ciudadDefault: "Paris",
        unidad: "C",
      },
    };

    expect(almacenamiento.ciudades).toHaveLength(2);
    expect(almacenamiento.config.ciudadDefault).toBe("Paris");
  });
});
