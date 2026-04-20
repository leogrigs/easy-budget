import { describe, expect, it } from "vitest";
import { COLOR_PALETTE } from "./categoryPalette";
import { pickNextColor } from "./categoryDefaults";

describe("pickNextColor", () => {
  it("returns the first palette color when none are used", () => {
    expect(pickNextColor([])).toBe(COLOR_PALETTE[0]);
  });

  it("skips used colors (case-insensitive)", () => {
    const used = [COLOR_PALETTE[0], COLOR_PALETTE[1].toUpperCase()];
    expect(pickNextColor(used)).toBe(COLOR_PALETTE[2]);
  });

  it("falls back to palette[0] when every color is used", () => {
    expect(pickNextColor([...COLOR_PALETTE])).toBe(COLOR_PALETTE[0]);
  });
});
