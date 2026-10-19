import { describe, it, expect } from "bun:test";
import type { MenuOption } from "../../src/types/index.ts";

describe("tipos de MenuOption", () => {
  it("debe crear una opción de menú válida", () => {
    const opcion: MenuOption = {
      id: "1",
      label: "Clima de ciudad default",
    };

    expect(opcion.id).toBe("1");
    expect(opcion.label).toBe("Clima de ciudad default");
  });
});
