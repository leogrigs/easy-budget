import { describe, expect, it } from "vitest";
import type { Category, Expense, Group } from "@/types/expense";
import {
  computeKpis,
  filterByPeriod,
  resolvePeriod,
  sumByCategory,
  sumByGroup,
  sumByMonth,
  sumByMonthAndCategory,
  topExpenses,
} from "./aggregate";

const ts = { seconds: 0, nanoseconds: 0 } as unknown as Expense["createdAt"];

const mkExpense = (
  id: string,
  date: string,
  amount: number,
  categoryId: string,
  name = "X",
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

const grp = (id: string, name: string): Group => ({
  id,
  name,
  order: 0,
  createdAt: ts,
});

const cat = (id: string, name: string, color: string): Category => ({
  id,
  name,
  color,
  icon: "Package",
  order: 0,
  createdAt: ts,
});

describe("resolvePeriod", () => {
  const today = new Date(2026, 3, 19); // 2026-04-19

  it("last30 = 30 inclusive days ending today", () => {
    const p = resolvePeriod("last30", today);
    expect(p.end).toBe("2026-04-19");
    expect(p.start).toBe("2026-03-21");
  });

  it("thisMonth starts on day 1", () => {
    expect(resolvePeriod("thisMonth", today).start).toBe("2026-04-01");
  });

  it("last6m starts 5 months before today", () => {
    expect(resolvePeriod("last6m", today).start).toBe("2025-11-19");
  });

  it("ytd starts on Jan 1", () => {
    expect(resolvePeriod("ytd", today).start).toBe("2026-01-01");
  });

  it("all starts at the minimum", () => {
    expect(resolvePeriod("all", today).start).toBe("0000-01-01");
  });
});

describe("filterByPeriod", () => {
  it("includes boundary dates and excludes outsiders", () => {
    const items = [
      mkExpense("1", "2026-03-31", 10, "a"),
      mkExpense("2", "2026-04-01", 20, "a"),
      mkExpense("3", "2026-04-19", 30, "a"),
      mkExpense("4", "2026-04-20", 40, "a"),
    ];
    const p = resolvePeriod("thisMonth", new Date(2026, 3, 19));
    const filtered = filterByPeriod(items, p);
    expect(filtered.map((e) => e.id)).toEqual(["2", "3"]);
  });
});

describe("sumByMonth", () => {
  it("returns zero rows for months with no expenses", () => {
    const p = resolvePeriod("last3m", new Date(2026, 3, 15)); // Feb, Mar, Apr
    const rows = sumByMonth([mkExpense("1", "2026-03-10", 50, "a")], p);
    expect(rows).toEqual([
      { month: "2026-02", total: 0 },
      { month: "2026-03", total: 50 },
      { month: "2026-04", total: 0 },
    ]);
  });

  it("handles empty inputs", () => {
    const p = resolvePeriod("last30", new Date(2026, 3, 19));
    expect(sumByMonth([], p).every((r) => r.total === 0)).toBe(true);
  });

  it("for key=all derives months from the expense range", () => {
    const p = resolvePeriod("all", new Date(2026, 3, 19));
    const rows = sumByMonth(
      [
        mkExpense("1", "2025-11-01", 10, "a"),
        mkExpense("2", "2026-01-15", 20, "a"),
      ],
      p
    );
    expect(rows.map((r) => r.month)).toEqual([
      "2025-11",
      "2025-12",
      "2026-01",
    ]);
  });
});

describe("sumByCategory", () => {
  it("aggregates and skips empty categories, sorted by total desc", () => {
    const cats = [cat("a", "Food", "#111"), cat("b", "Fun", "#222"), cat("c", "Zero", "#333")];
    const expenses = [
      mkExpense("1", "2026-04-01", 30, "a"),
      mkExpense("2", "2026-04-02", 70, "b"),
      mkExpense("3", "2026-04-03", 20, "a"),
    ];
    const rows = sumByCategory(expenses, cats);
    expect(rows).toEqual([
      { categoryId: "b", name: "Fun", color: "#222", total: 70, pct: 70 / 120 },
      { categoryId: "a", name: "Food", color: "#111", total: 50, pct: 50 / 120 },
    ]);
  });

  it("handles zero grand total", () => {
    expect(sumByCategory([], [cat("a", "Food", "#111")])).toEqual([]);
  });
});

describe("sumByMonthAndCategory", () => {
  it("one row per month; zero entries for missing category+month", () => {
    const cats = [cat("a", "Food", "#111"), cat("b", "Fun", "#222")];
    const p = resolvePeriod("last3m", new Date(2026, 3, 15));
    const expenses = [
      mkExpense("1", "2026-03-01", 100, "a"),
      mkExpense("2", "2026-04-01", 40, "b"),
    ];
    const rows = sumByMonthAndCategory(expenses, cats, p);
    expect(rows).toEqual([
      { month: "2026-02", a: 0, b: 0 },
      { month: "2026-03", a: 100, b: 0 },
      { month: "2026-04", a: 0, b: 40 },
    ]);
  });
});

describe("sumByGroup", () => {
  const groups = [
    grp("g1", "Japan"),
    grp("g2", "Birthday"),
    grp("g3", "Empty"),
  ];

  it("aggregates and skips ungrouped expenses, sorted by total desc", () => {
    const expenses = [
      mkExpense("1", "2026-04-01", 30, "a", "a", "g1"),
      mkExpense("2", "2026-04-02", 70, "a", "b", "g2"),
      mkExpense("3", "2026-04-03", 20, "a", "c", "g1"),
      mkExpense("4", "2026-04-04", 999, "a", "ungrouped"),
    ];
    const rows = sumByGroup(expenses, groups);
    expect(rows).toEqual([
      { groupId: "g2", name: "Birthday", total: 70, pct: 70 / 120 },
      { groupId: "g1", name: "Japan", total: 50, pct: 50 / 120 },
    ]);
  });

  it("pct denominator excludes ungrouped spending", () => {
    const expenses = [
      mkExpense("1", "2026-04-01", 100, "a", "a", "g1"),
      mkExpense("2", "2026-04-02", 900, "a", "b"), // ungrouped, should not affect pct
    ];
    const rows = sumByGroup(expenses, groups);
    expect(rows).toHaveLength(1);
    expect(rows[0].pct).toBe(1);
  });

  it("empty inputs return []", () => {
    expect(sumByGroup([], groups)).toEqual([]);
    expect(sumByGroup([], [])).toEqual([]);
  });
});

describe("topExpenses", () => {
  it("returns the n largest by amount desc", () => {
    const expenses = [
      mkExpense("1", "2026-04-01", 10, "a"),
      mkExpense("2", "2026-04-02", 100, "a"),
      mkExpense("3", "2026-04-03", 50, "a"),
    ];
    expect(topExpenses(expenses, 2).map((e) => e.id)).toEqual(["2", "3"]);
  });
});

describe("computeKpis", () => {
  const cats = [cat("a", "Food", "#111"), cat("b", "Fun", "#222")];

  it("total, avgPerDay, and topCategory", () => {
    const today = new Date(2026, 3, 19);
    const p = resolvePeriod("last30", today);
    const expenses = [
      mkExpense("1", "2026-04-15", 100, "a"),
      mkExpense("2", "2026-04-16", 50, "b"),
    ];
    const k = computeKpis(expenses, cats, p);
    expect(k.total).toBe(150);
    expect(k.topCategory?.name).toBe("Food");
    expect(k.avgPerDay).toBeCloseTo(150 / 30);
  });

  it("deltaPct when previous period has expenses", () => {
    const today = new Date(2026, 3, 30);
    const p = resolvePeriod("thisMonth", today); // 2026-04-01..30 (30 days)
    const expenses = [
      mkExpense("1", "2026-04-10", 200, "a"), // current
      mkExpense("2", "2026-03-05", 100, "a"), // previous (same length ending 03-31)
    ];
    const k = computeKpis(expenses, cats, p);
    expect(k.total).toBe(200);
    expect(k.previousTotal).toBe(100);
    expect(k.deltaPct).toBe(1); // +100%
  });

  it("deltaPct is null when period=all", () => {
    const p = resolvePeriod("all", new Date(2026, 3, 19));
    const k = computeKpis([mkExpense("1", "2026-04-01", 10, "a")], cats, p);
    expect(k.deltaPct).toBeNull();
  });

  it("deltaPct is +1 (100%) when previous period was zero but current is positive", () => {
    const today = new Date(2026, 3, 19);
    const p = resolvePeriod("last30", today);
    const k = computeKpis(
      [mkExpense("1", "2026-04-10", 50, "a")],
      cats,
      p
    );
    expect(k.previousTotal).toBe(0);
    expect(k.deltaPct).toBe(1);
  });

  it("no expenses yields zero total and null topCategory", () => {
    const p = resolvePeriod("last6m", new Date(2026, 3, 19));
    const k = computeKpis([], cats, p);
    expect(k.total).toBe(0);
    expect(k.topCategory).toBeNull();
  });
});
