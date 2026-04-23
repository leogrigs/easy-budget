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

import { normalizePatch } from "./expenses";

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
