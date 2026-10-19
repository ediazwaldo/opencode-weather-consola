import { describe, it, expect } from "bun:test";
import { leerEntrada } from "../../src/presentation/input.ts";

describe("leerEntrada", () => {
  it("debe estar definido como función", () => {
    expect(typeof leerEntrada).toBe("function");
  });

  it("debe retornar un Promise", () => {
    // No podemos probar la lectura real sin stdin, pero verificamos que retorne una promesa
    const resultado = leerEntrada("test: ");
    expect(resultado).toBeInstanceOf(Promise);
    // Cancelar para no dejar colgando
  });
});
