import { describe, it, expect } from "bun:test";
import { cyan, amarillo, rojo } from "../../src/utils/colors.ts";

describe("cyan", () => {
  it("debe envolver el texto en color cyan", () => {
    const resultado = cyan("texto");
    expect(resultado).toBe("\x1b[96mtexto\x1b[0m");
  });

  it("debe manejar texto vacío", () => {
    const resultado = cyan("");
    expect(resultado).toBe("\x1b[96m\x1b[0m");
  });
});

describe("amarillo", () => {
  it("debe envolver el texto en color amarillo", () => {
    const resultado = amarillo("texto");
    expect(resultado).toBe("\x1b[33mtexto\x1b[0m");
  });

  it("debe manejar texto vacío", () => {
    const resultado = amarillo("");
    expect(resultado).toBe("\x1b[33m\x1b[0m");
  });
});

describe("rojo", () => {
  it("debe envolver el texto en color rojo", () => {
    const resultado = rojo("texto");
    expect(resultado).toBe("\x1b[31mtexto\x1b[0m");
  });

  it("debe manejar texto vacío", () => {
    const resultado = rojo("");
    expect(resultado).toBe("\x1b[31m\x1b[0m");
  });
});
