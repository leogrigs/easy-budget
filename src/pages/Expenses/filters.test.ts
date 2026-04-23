import { describe, expect, it } from "vitest";
import type { Category, Expense } from "@/types/expense";
import { NO_GROUP_FILTER } from "@/components/ExpenseFilters";
import { applyExpenseFilters } from "./filters";

const ts = { seconds: 0, nanoseconds: 0 } as unknown as Expense["createdAt"];

const mkExpense = (
  id: string,
  date: string,
  amount: number,
  categoryId: string,
  name: string,
  groupId?: string
): Expense => ({
  id,
  name,
  amount,
  date,
  categoryId,
  groupId,
  createdAt: ts,
  updatedAt: ts,
});

const cat = (id: string, name: string): Category => ({
  id,
  name,
  color: "#000000",
  icon: "Package",
  order: 0,
  createdAt: ts,
});

const byId = new Map(
  [cat("cat1", "Food"), cat("cat2", "Travel")].map((c) => [c.id, c])
);

const expenses: Expense[] = [
  mkExpense("1", "2026-04-01", 10, "cat1", "Pizza", "g1"),
  mkExpense("2", "2026-04-02", 20, "cat2", "Shinkansen", "g1"),
  mkExpense("3", "2026-04-03", 30, "cat1", "Sushi", "g2"),
  mkExpense("4", "2026-04-04", 40, "cat2", "Taxi"),
];

const baseFilters = {
  search: "",
  categoryIds: [] as string[],
  groupIds: [] as string[],
  dateRange: undefined,
};

describe("applyExpenseFilters", () => {
  it("returns all expenses when no filters are set", () => {
    expect(applyExpenseFilters(expenses, byId, baseFilters)).toEqual(expenses);
  });

  it("groupIds: ['g1'] keeps only g1 and excludes ungrouped + other groups", () => {
    const result = applyExpenseFilters(expenses, byId, {
      ...baseFilters,
      groupIds: ["g1"],
    });
    expect(result.map((e) => e.id)).toEqual(["1", "2"]);
  });

  it("groupIds: ['__none__'] returns only expenses with no groupId", () => {
    const result = applyExpenseFilters(expenses, byId, {
      ...baseFilters,
      groupIds: [NO_GROUP_FILTER],
    });
    expect(result.map((e) => e.id)).toEqual(["4"]);
  });

  it("groupIds: ['g1', '__none__'] returns the union", () => {
    const result = applyExpenseFilters(expenses, byId, {
      ...baseFilters,
      groupIds: ["g1", NO_GROUP_FILTER],
    });
    expect(result.map((e) => e.id).sort()).toEqual(["1", "2", "4"]);
  });

  it("combines search + category + group with AND", () => {
    const result = applyExpenseFilters(expenses, byId, {
      ...baseFilters,
      search: "sushi",
      categoryIds: ["cat1"],
      groupIds: ["g2"],
    });
    expect(result.map((e) => e.id)).toEqual(["3"]);
  });

  it("categoryIds alone still works", () => {
    const result = applyExpenseFilters(expenses, byId, {
      ...baseFilters,
      categoryIds: ["cat2"],
    });
    expect(result.map((e) => e.id)).toEqual(["2", "4"]);
  });
});
