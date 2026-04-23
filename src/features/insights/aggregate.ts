import type { DateRange } from "react-day-picker";
import { describePeriod } from "@/lib/describePeriod";
import type { Category, Expense, Group } from "@/types/expense";

export type PeriodKey =
  | "last30"
  | "thisMonth"
  | "last3m"
  | "last6m"
  | "last12m"
  | "ytd"
  | "all"
  | "custom";

export interface Period {
  key: PeriodKey;
  start: string;
  end: string;
  label: string;
}

export const PERIOD_OPTIONS: Array<{ key: PeriodKey; label: string }> = [
  { key: "last30", label: "Last 30 days" },
  { key: "thisMonth", label: "This month" },
  { key: "last3m", label: "Last 3 months" },
  { key: "last6m", label: "Last 6 months" },
  { key: "last12m", label: "Last 12 months" },
  { key: "ytd", label: "Year to date" },
  { key: "all", label: "All time" },
];

const toISO = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const addDays = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth() + n, d.getDate());

const MIN_ISO = "0000-01-01";

export const periodFromDateRange = (
  range: DateRange | undefined,
  today: Date
): Period => {
  const endIso = toISO(today);
  const desc = describePeriod(range);
  if (!range?.from) {
    return { key: "all", start: MIN_ISO, end: endIso, label: desc.label };
  }
  return {
    key: "custom",
    start: toISO(range.from),
    end: range.to ? toISO(range.to) : toISO(range.from),
    label: desc.label,
  };
};

export const resolvePeriod = (key: PeriodKey, today: Date): Period => {
  if (key === "custom") {
    // Custom ranges are produced by periodFromDateRange, not this function.
    return { key, start: toISO(today), end: toISO(today), label: "Custom" };
  }
  const endIso = toISO(today);
  const label = PERIOD_OPTIONS.find((p) => p.key === key)?.label ?? "";

  switch (key) {
    case "last30":
      return { key, start: toISO(addDays(today, -29)), end: endIso, label };
    case "thisMonth":
      return { key, start: toISO(startOfMonth(today)), end: endIso, label };
    case "last3m":
      return { key, start: toISO(addMonths(today, -2)), end: endIso, label };
    case "last6m":
      return { key, start: toISO(addMonths(today, -5)), end: endIso, label };
    case "last12m":
      return { key, start: toISO(addMonths(today, -11)), end: endIso, label };
    case "ytd":
      return {
        key,
        start: toISO(new Date(today.getFullYear(), 0, 1)),
        end: endIso,
        label,
      };
    case "all":
      return { key, start: MIN_ISO, end: endIso, label };
  }
};

export const filterByPeriod = (
  expenses: Expense[],
  period: Period
): Expense[] =>
  expenses.filter((e) => e.date >= period.start && e.date <= period.end);

const monthKey = (iso: string) => iso.slice(0, 7);

const monthsBetween = (startMonth: string, endMonth: string): string[] => {
  const [sy, sm] = startMonth.split("-").map(Number);
  const [ey, em] = endMonth.split("-").map(Number);
  const out: string[] = [];
  let y = sy;
  let m = sm;
  while (y < ey || (y === ey && m <= em)) {
    out.push(`${y}-${String(m).padStart(2, "0")}`);
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
  return out;
};

export interface MonthlyTotal {
  month: string;
  total: number;
}

export const sumByMonth = (
  expenses: Expense[],
  period: Period
): MonthlyTotal[] => {
  const months =
    period.key === "all"
      ? allMonthsFromExpenses(expenses)
      : monthsBetween(monthKey(period.start), monthKey(period.end));

  if (months.length === 0) return [];

  const totals = new Map<string, number>(months.map((m) => [m, 0]));
  for (const e of expenses) {
    const mk = monthKey(e.date);
    if (totals.has(mk)) totals.set(mk, (totals.get(mk) ?? 0) + e.amount);
  }
  return months.map((m) => ({ month: m, total: totals.get(m) ?? 0 }));
};

const allMonthsFromExpenses = (expenses: Expense[]): string[] => {
  if (expenses.length === 0) return [];
  let min = expenses[0].date;
  let max = expenses[0].date;
  for (const e of expenses) {
    if (e.date < min) min = e.date;
    if (e.date > max) max = e.date;
  }
  return monthsBetween(monthKey(min), monthKey(max));
};

export interface CategoryTotal {
  categoryId: string;
  name: string;
  color: string;
  total: number;
  pct: number;
}

export const sumByCategory = (
  expenses: Expense[],
  categories: Category[]
): CategoryTotal[] => {
  const byId = new Map<string, number>();
  let grand = 0;
  for (const e of expenses) {
    byId.set(e.categoryId, (byId.get(e.categoryId) ?? 0) + e.amount);
    grand += e.amount;
  }

  const rows: CategoryTotal[] = [];
  for (const c of categories) {
    const total = byId.get(c.id) ?? 0;
    if (total === 0) continue;
    rows.push({
      categoryId: c.id,
      name: c.name,
      color: c.color,
      total,
      pct: grand > 0 ? total / grand : 0,
    });
  }
  rows.sort((a, b) => b.total - a.total);
  return rows;
};

export interface GroupTotal {
  groupId: string;
  name: string;
  color: string;
  total: number;
  pct: number;
}

/**
 * Totals per group, sorted desc by total. Expenses without a groupId are
 * ignored. `pct` is share of total spending *within grouped expenses* — i.e.
 * ungrouped spending is excluded from the denominator.
 */
export const sumByGroup = (
  expenses: Expense[],
  groups: Group[]
): GroupTotal[] => {
  const byId = new Map<string, number>();
  let grand = 0;
  for (const e of expenses) {
    if (!e.groupId) continue;
    byId.set(e.groupId, (byId.get(e.groupId) ?? 0) + e.amount);
    grand += e.amount;
  }

  const rows: GroupTotal[] = [];
  for (const g of groups) {
    const total = byId.get(g.id) ?? 0;
    if (total === 0) continue;
    rows.push({
      groupId: g.id,
      name: g.name,
      color: g.color,
      total,
      pct: grand > 0 ? total / grand : 0,
    });
  }
  rows.sort((a, b) => b.total - a.total);
  return rows;
};

export type MonthlyCategoryRow = {
  month: string;
  [categoryId: string]: number | string;
};

export const sumByMonthAndCategory = (
  expenses: Expense[],
  categories: Category[],
  period: Period
): MonthlyCategoryRow[] => {
  const months =
    period.key === "all"
      ? allMonthsFromExpenses(expenses)
      : monthsBetween(monthKey(period.start), monthKey(period.end));

  if (months.length === 0) return [];

  const rows: MonthlyCategoryRow[] = months.map((m) => {
    const row: MonthlyCategoryRow = { month: m };
    for (const c of categories) row[c.id] = 0;
    return row;
  });
  const byMonth = new Map(rows.map((r) => [r.month, r]));

  for (const e of expenses) {
    const row = byMonth.get(monthKey(e.date));
    if (!row) continue;
    if (e.categoryId in row) {
      row[e.categoryId] = (row[e.categoryId] as number) + e.amount;
    }
  }
  return rows;
};

export const topExpenses = (expenses: Expense[], n: number): Expense[] =>
  [...expenses].sort((a, b) => b.amount - a.amount).slice(0, n);

export interface Kpis {
  total: number;
  previousTotal: number;
  deltaPct: number | null;
  avgPerDay: number;
  topCategory: { name: string; color: string; total: number } | null;
}

const daysBetween = (startIso: string, endIso: string): number => {
  const [sy, sm, sd] = startIso.split("-").map(Number);
  const [ey, em, ed] = endIso.split("-").map(Number);
  const start = new Date(sy, sm - 1, sd).getTime();
  const end = new Date(ey, em - 1, ed).getTime();
  return Math.max(1, Math.round((end - start) / 86400000) + 1);
};

const previousPeriod = (period: Period): Period | null => {
  if (period.key === "all") return null;
  const length = daysBetween(period.start, period.end);
  const [sy, sm, sd] = period.start.split("-").map(Number);
  const start = new Date(sy, sm - 1, sd);
  const prevEnd = addDays(start, -1);
  const prevStart = addDays(prevEnd, -(length - 1));
  return {
    key: period.key,
    start: toISO(prevStart),
    end: toISO(prevEnd),
    label: "previous",
  };
};

export const computeKpis = (
  expenses: Expense[],
  categories: Category[],
  period: Period
): Kpis => {
  const current = filterByPeriod(expenses, period);
  const total = current.reduce((s, e) => s + e.amount, 0);

  const prev = previousPeriod(period);
  const previousTotal = prev
    ? filterByPeriod(expenses, prev).reduce((s, e) => s + e.amount, 0)
    : 0;

  const deltaPct =
    prev === null
      ? null
      : previousTotal === 0
      ? total > 0
        ? 1
        : null
      : (total - previousTotal) / previousTotal;

  const days =
    period.key === "all"
      ? Math.max(1, daysBetween(earliestDate(expenses) ?? period.end, period.end))
      : daysBetween(period.start, period.end);
  const avgPerDay = total / days;

  const byCat = sumByCategory(current, categories);
  const topCategory = byCat.length
    ? { name: byCat[0].name, color: byCat[0].color, total: byCat[0].total }
    : null;

  return { total, previousTotal, deltaPct, avgPerDay, topCategory };
};

const earliestDate = (expenses: Expense[]): string | null => {
  if (expenses.length === 0) return null;
  let min = expenses[0].date;
  for (const e of expenses) if (e.date < min) min = e.date;
  return min;
};
