import CategoryBadge from "@/components/CategoryBadge";
import type { Category, Expense } from "@/types/expense";
import { formatBRL } from "./formatBRL";

interface TopExpensesListProps {
  expenses: Expense[];
  categoriesById: Map<string, Category>;
}

const formatDate = (iso: string): string => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

const TopExpensesList = ({ expenses, categoriesById }: TopExpensesListProps) => {
  if (expenses.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        No expenses in this period.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {expenses.map((e) => (
        <li
          key={e.id}
          className="flex items-center gap-3 rounded-md border border-border/60 bg-card p-3 text-sm"
        >
          <div className="flex-1 min-w-0">
            <p className="truncate font-medium">{e.name}</p>
            <p className="text-xs text-muted-foreground">{formatDate(e.date)}</p>
          </div>
          <CategoryBadge category={categoriesById.get(e.categoryId)} />
          <span className="font-mono font-medium tabular-nums">
            {formatBRL(e.amount)}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default TopExpensesList;
