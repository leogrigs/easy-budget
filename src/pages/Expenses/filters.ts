import type { DateRange } from "react-day-picker";
import { NO_GROUP_FILTER } from "../../components/ExpenseFilters";
import type { Category, Expense } from "../../types/expense";

export interface ExpenseFilterInput {
  search: string;
  categoryIds: string[];
  groupIds: string[];
  dateRange: DateRange | undefined;
}

const toIsoDate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const applyExpenseFilters = (
  expenses: Expense[],
  byId: Map<string, Pick<Category, "name">>,
  filters: ExpenseFilterInput
): Expense[] => {
  const search = filters.search.trim().toLowerCase();
  const fromIso = filters.dateRange?.from
    ? toIsoDate(filters.dateRange.from)
    : undefined;
  const toIso = filters.dateRange?.to
    ? toIsoDate(filters.dateRange.to)
    : filters.dateRange?.from
      ? toIsoDate(filters.dateRange.from)
      : undefined;

  return expenses.filter((e) => {
    if (search) {
      const category = byId.get(e.categoryId)?.name?.toLowerCase() ?? "";
      if (
        !e.name.toLowerCase().includes(search) &&
        !category.includes(search)
      ) {
        return false;
      }
    }
    if (filters.categoryIds.length > 0) {
      if (!filters.categoryIds.includes(e.categoryId)) return false;
    }
    if (filters.groupIds.length > 0) {
      const wantsNone = filters.groupIds.includes(NO_GROUP_FILTER);
      const realIds = filters.groupIds.filter((x) => x !== NO_GROUP_FILTER);
      const eg = e.groupId;
      const matches =
        (wantsNone && !eg) || (!!eg && realIds.includes(eg));
      if (!matches) return false;
    }
    if (fromIso && e.date < fromIso) return false;
    if (toIso && e.date > toIso) return false;
    return true;
  });
};
