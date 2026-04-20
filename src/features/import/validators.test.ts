import { describe, expect, it } from "vitest";
import { parseImportedRow } from "./validators";

describe("parseImportedRow", () => {
  it("accepts a well-formed row", () => {
    const row = parseImportedRow(1, {
      name: "Coffee",
      amount: "4.50",
      date: "2026-04-19",
      category: "Food",
    });
    expect(row.error).toBeUndefined();
    expect(row.parsed).toEqual({
      name: "Coffee",
      amount: 4.5,
      date: "2026-04-19",
      category: "Food",
    });
  });

  it("accepts header variations (Name/Price/Date/Category)", () => {
    const row = parseImportedRow(1, {
      Name: "Coffee",
      Price: "4.50",
      Date: "2026-04-19",
      Category: "Food",
    });
    expect(row.parsed?.name).toBe("Coffee");
    expect(row.parsed?.amount).toBe(4.5);
  });

  it("rejects a negative amount", () => {
    const row = parseImportedRow(1, {
      name: "x",
      amount: "-1",
      date: "2026-04-19",
      category: "Food",
    });
    expect(row.parsed).toBeUndefined();
    expect(row.error).toMatch(/amount/i);
  });

  it("rejects a bad date", () => {
    const row = parseImportedRow(1, {
      name: "x",
      amount: "1",
      date: "04/19/2026",
      category: "Food",
    });
    expect(row.error).toMatch(/date/i);
  });

  it("rejects a missing category", () => {
    const row = parseImportedRow(1, {
      name: "x",
      amount: "1",
      date: "2026-04-19",
      category: "",
    });
    expect(row.error).toMatch(/category/i);
  });
});
