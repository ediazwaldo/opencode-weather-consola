import { describe, it, expect } from "bun:test";
import { convertirTemp, describirClima } from "../../src/utils/format.ts";

describe("convertirTemp", () => {
  it("debe retornar la misma temperatura en Celsius", () => {
    expect(convertirTemp(25, "C")).toBe(25);
    expect(convertirTemp(0, "C")).toBe(0);
    expect(convertirTemp(-10, "C")).toBe(-10);
  });

  it("debe convertir correctamente a Fahrenheit", () => {
    expect(convertirTemp(0, "F")).toBe(32);
    expect(convertirTemp(100, "F")).toBe(212);
    expect(convertirTemp(37, "F")).toBeCloseTo(98.6, 1);
  });

  it("debe manejar temperaturas negativas", () => {
    expect(convertirTemp(-40, "F")).toBe(-40);
    expect(convertirTemp(-40, "C")).toBe(-40);
  });

  it("debe manejar decimales", () => {
    expect(convertirTemp(25.5, "C")).toBe(25.5);
    expect(convertirTemp(25.5, "F")).toBeCloseTo(77.9, 1);
  });
});

describe("describirClima", () => {
  it("debe describir código 0 como despejado", () => {
    expect(describirClima(0)).toContain("Despejado");
  });

  it("debe describir código 1 como mayormente despejado", () => {
    expect(describirClima(1)).toContain("Mayormente despejado");
  });

  it("debe describir código 2 como parcialmente nublado", () => {
    expect(describirClima(2)).toContain("Parcialmente nublado");
  });

  it("debe describir código 3 como nublado", () => {
    expect(describirClima(3)).toContain("Nublado");
  });

  it("debe describir códigos 45-48 como niebla", () => {
    expect(describirClima(45)).toContain("Niebla");
    expect(describirClima(48)).toContain("Niebla");
  });

  it("debe describir códigos 51-55 como llovizna", () => {
    expect(describirClima(51)).toContain("Llovizna");
    expect(describirClima(55)).toContain("Llovizna");
  });

  it("debe describir códigos 61-65 como lluvia", () => {
    expect(describirClima(61)).toContain("Lluvia");
    expect(describirClima(65)).toContain("Lluvia");
  });

  it("debe describir códigos 71-75 como nieve", () => {
    expect(describirClima(71)).toContain("Nieve");
    expect(describirClima(75)).toContain("Nieve");
  });

  it("debe describir código 95 como tormenta", () => {
    expect(describirClima(95)).toContain("Tormenta");
  });

  it("debe describir códigos desconocidos", () => {
    expect(describirClima(999)).toContain("Desconocido");
  });
});
