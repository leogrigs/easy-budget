import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Category, Expense } from "@/types/expense";

vi.mock("recharts", () => {
  const Noop = ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  );
  return {
    ResponsiveContainer: Noop,
    BarChart: Noop,
    Bar: () => null,
    PieChart: Noop,
    Pie: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    Cell: () => null,
    CartesianGrid: () => null,
    XAxis: () => null,
    YAxis: () => null,
    Legend: () => null,
    Tooltip: () => null,
  };
});

const mockSubscribeExpenses = vi.fn();
const mockSubscribeCategories = vi.fn();

vi.mock("@/services/expenses", () => ({
  subscribeExpenses: (...args: unknown[]) => mockSubscribeExpenses(...args),
}));
vi.mock("@/services/categories", () => ({
  subscribeCategories: (...args: unknown[]) => mockSubscribeCategories(...args),
}));

import Insights from "./Insights";

const ts = { seconds: 0, nanoseconds: 0 } as unknown as Expense["createdAt"];

const mkExpense = (
  id: string,
  date: string,
  amount: number,
  categoryId: string
): Expense => ({
  id,
  name: `Expense ${id}`,
  amount,
  date,
  categoryId,
  createdAt: ts,
  updatedAt: ts,
});

const cat = (id: string, name: string, color: string): Category => ({
  id,
  name,
  color,
  icon: "Package",
  order: 0,
  createdAt: ts,
});

const primeSubscriptions = (expenses: Expense[], categories: Category[]) => {
  mockSubscribeExpenses.mockImplementation(
    (_uid: string, onNext: (items: Expense[]) => void) => {
      onNext(expenses);
      return () => {};
    }
  );
  mockSubscribeCategories.mockImplementation(
    (_uid: string, onNext: (items: Category[]) => void) => {
      onNext(categories);
      return () => {};
    }
  );
};

const renderPage = () =>
  render(
    <MemoryRouter>
      <Insights uid="u1" />
    </MemoryRouter>
  );

describe("Insights page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows empty state when there are no expenses", async () => {
    primeSubscriptions([], []);
    renderPage();
    expect(await screen.findByText(/Nothing to chart yet/i)).toBeInTheDocument();
  });

  it("renders cards and top category from the seeded data", async () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const within = `${y}-${m}-01`;

    primeSubscriptions(
      [mkExpense("1", within, 100, "a"), mkExpense("2", within, 50, "b")],
      [cat("a", "Food", "#111"), cat("b", "Fun", "#222")]
    );

    renderPage();
    expect(await screen.findByText("Top category")).toBeInTheDocument();
    expect(screen.getAllByText("Food").length).toBeGreaterThan(0);
    expect(screen.getByText(/Monthly trend/i)).toBeInTheDocument();
    expect(screen.getByText(/By category/i)).toBeInTheDocument();
    expect(screen.getByText(/Top 5 expenses/i)).toBeInTheDocument();
  });

  it("defaults the period selector to Last 6 months", async () => {
    primeSubscriptions(
      [mkExpense("1", "2025-01-01", 100, "a")],
      [cat("a", "Food", "#111")]
    );
    renderPage();
    const trigger = await screen.findByRole("combobox", { name: /period/i });
    expect(trigger).toHaveTextContent(/Last 6 months/i);
  });

  it("excludes refunded expenses from aggregations but keeps the page rendered", async () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const within = `${y}-${m}-01`;

    const kept = mkExpense("1", within, 200, "a");
    kept.name = "Kept expense";
    const refunded = { ...mkExpense("2", within, 500, "b"), refunded: true };
    refunded.name = "Refunded expense";

    primeSubscriptions(
      [kept, refunded],
      [cat("a", "Food", "#111"), cat("b", "Fun", "#222")]
    );
    renderPage();

    // KPIs render (not empty state)
    expect(await screen.findByText("Top category")).toBeInTheDocument();

    // Refunded expense is absent from the Top 5 list
    expect(screen.queryByText(/Refunded expense/)).not.toBeInTheDocument();
    expect(screen.getByText(/Kept expense/)).toBeInTheDocument();

    // Top category reflects the kept expense's category, not the refunded one
    expect(screen.getAllByText("Food").length).toBeGreaterThan(0);
    expect(screen.queryByText("Fun")).not.toBeInTheDocument();
  });
});
