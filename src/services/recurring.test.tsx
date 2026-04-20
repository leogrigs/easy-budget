import { describe, expect, it } from "vitest";
import { occurrencesBetween } from "./recurring";

// Use local-midnight Dates (not UTC) so `now` lines up with toISODate()
// which uses the local calendar day.
const local = (y: number, m: number, d: number) => new Date(y, m - 1, d);

describe("occurrencesBetween", () => {
  it("returns only the start date when start === now", () => {
    expect(
      occurrencesBetween("2026-04-19", "monthly", undefined, local(2026, 4, 19))
    ).toEqual(["2026-04-19"]);
  });

  it("generates monthly occurrences up to now", () => {
    expect(
      occurrencesBetween("2026-01-19", "monthly", undefined, local(2026, 4, 19))
    ).toEqual(["2026-01-19", "2026-02-19", "2026-03-19", "2026-04-19"]);
  });

  it("generates weekly occurrences up to now", () => {
    expect(
      occurrencesBetween("2026-04-01", "weekly", undefined, local(2026, 4, 19))
    ).toEqual(["2026-04-01", "2026-04-08", "2026-04-15"]);
  });

  it("respects endDate in the past", () => {
    expect(
      occurrencesBetween(
        "2026-01-01",
        "monthly",
        "2026-02-15",
        local(2026, 4, 19)
      )
    ).toEqual(["2026-01-01", "2026-02-01"]);
  });

  it("handles leap-year Feb 29 by shifting to Feb 28 on non-leap years", () => {
    const out = occurrencesBetween(
      "2024-02-29",
      "monthly",
      undefined,
      local(2025, 4, 1)
    );
    expect(out[0]).toBe("2024-02-29");
    expect(out).toContain("2025-02-28");
  });

  it("returns empty when start is in the future", () => {
    expect(
      occurrencesBetween("2026-05-01", "monthly", undefined, local(2026, 4, 19))
    ).toEqual([]);
  });
});
