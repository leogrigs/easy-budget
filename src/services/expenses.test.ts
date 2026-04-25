import { describe, expect, it, vi } from "vitest";

const DELETE_SENTINEL = Symbol("deleteField()");

vi.mock("firebase/firestore", () => ({
  addDoc: vi.fn(),
  collection: vi.fn(),
  deleteDoc: vi.fn(),
  deleteField: () => DELETE_SENTINEL,
  doc: vi.fn(),
  getDocs: vi.fn(),
  onSnapshot: vi.fn(),
  orderBy: vi.fn(),
  query: vi.fn(),
  serverTimestamp: vi.fn(() => "__now__"),
  updateDoc: vi.fn(),
  writeBatch: vi.fn(),
}));

vi.mock("./firebase", () => ({
  db: {},
}));

import { buildInstallmentInputs, normalizePatch } from "./expenses";

describe("buildInstallmentInputs", () => {
  const base = {
    name: "Geladeira",
    categoryId: "cat1",
    firstDate: "2026-04-24",
  };

  it("splits an evenly-divisible total equally", () => {
    const inputs = buildInstallmentInputs(
      { ...base, totalAmount: 1200, parts: 12 },
      "grp"
    );
    expect(inputs).toHaveLength(12);
    for (const e of inputs) expect(e.amount).toBe(100);
    const sum = inputs.reduce((a, e) => a + e.amount, 0);
    expect(sum).toBeCloseTo(1200, 2);
  });

  it("puts the remainder on the last installment and sums to the total", () => {
    const inputs = buildInstallmentInputs(
      { ...base, totalAmount: 1000, parts: 3 },
      "grp"
    );
    expect(inputs.map((e) => e.amount)).toEqual([333.33, 333.33, 333.34]);
    const sumCents = inputs.reduce(
      (a, e) => a + Math.round(e.amount * 100),
      0
    );
    expect(sumCents).toBe(100000);
  });

  it("increments installmentNumber and carries installmentTotal/groupId", () => {
    const inputs = buildInstallmentInputs(
      { ...base, totalAmount: 200, parts: 2 },
      "grp-xyz"
    );
    expect(inputs[0]).toMatchObject({
      installmentNumber: 1,
      installmentTotal: 2,
      installmentGroupId: "grp-xyz",
    });
    expect(inputs[1]).toMatchObject({
      installmentNumber: 2,
      installmentTotal: 2,
      installmentGroupId: "grp-xyz",
    });
  });

  it("advances the date one month at a time, clamping to the last day of shorter months", () => {
    const inputs = buildInstallmentInputs(
      { ...base, firstDate: "2026-01-31", totalAmount: 300, parts: 3 },
      "grp"
    );
    expect(inputs.map((e) => e.date)).toEqual([
      "2026-01-31",
      "2026-02-28",
      "2026-03-31",
    ]);
  });

  it("carries the optional groupId when provided", () => {
    const inputs = buildInstallmentInputs(
      { ...base, totalAmount: 100, parts: 2, groupId: "g1" },
      "grp"
    );
    expect(inputs.every((e) => e.groupId === "g1")).toBe(true);
  });
});

describe("normalizePatch", () => {
  it("passes concrete values through", () => {
    const result = normalizePatch({ groupId: "g1", name: "x" });
    expect(result).toEqual({ groupId: "g1", name: "x" });
  });

  it("translates null to deleteField() sentinel", () => {
    const result = normalizePatch({ groupId: null });
    expect(result.groupId).toBe(DELETE_SENTINEL);
  });

  it("omits undefined keys entirely", () => {
    const result = normalizePatch({ groupId: undefined, name: "x" });
    expect(result).toEqual({ name: "x" });
    expect("groupId" in result).toBe(false);
  });

  it("handles a mix of concrete, null, and undefined", () => {
    const result = normalizePatch({
      name: "x",
      categoryId: undefined,
      groupId: null,
      amount: 42,
    });
    expect(result).toEqual({
      name: "x",
      groupId: DELETE_SENTINEL,
      amount: 42,
    });
  });
});
