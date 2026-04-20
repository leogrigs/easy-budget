import Papa from "papaparse";
import type { Category, Expense } from "../../types/expense";

const today = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const buildExpenseCsv = (
  expenses: Expense[],
  categoriesById: Map<string, Category>
): string => {
  const rows = expenses.map((e) => ({
    name: e.name,
    amount: e.amount,
    date: e.date,
    category: categoriesById.get(e.categoryId)?.name ?? "",
    recurring: e.recurringId ? "yes" : "no",
  }));
  return Papa.unparse(rows, {
    columns: ["name", "amount", "date", "category", "recurring"],
  });
};

export const downloadExpenseCsv = (
  expenses: Expense[],
  categoriesById: Map<string, Category>
): void => {
  const csv = buildExpenseCsv(expenses, categoriesById);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `easy-budget_${today()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
