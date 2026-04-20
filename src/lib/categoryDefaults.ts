import { COLOR_PALETTE } from "./categoryPalette";

export const DEFAULT_AUTO_ICON = "Package";

/**
 * Returns the first palette color not in `used`.
 * Falls back to palette[0] when every color is already taken.
 */
export const pickNextColor = (used: string[]): string => {
  const taken = new Set(used.map((c) => c.toLowerCase()));
  const free = COLOR_PALETTE.find((c) => !taken.has(c.toLowerCase()));
  return free ?? COLOR_PALETTE[0];
};
