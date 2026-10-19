import { describe, it, expect, spyOn } from "bun:test";
import { proximamente } from "../../src/actions/placeholder.ts";

describe("proximamente", () => {
  it("debe mostrar mensaje de próximamente", () => {
    const consoleSpy = spyOn(console, "log").mockImplementation(() => {});

    proximamente();

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("próximamente"),
    );
    consoleSpy.mockRestore();
  });
});
