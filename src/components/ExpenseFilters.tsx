import { format } from "date-fns";
import { CalendarIcon, Filter, Search, X } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import type { Category } from "../types/expense";

export interface ExpenseFiltersState {
  search: string;
  categoryIds: string[];
  dateRange: DateRange | undefined;
}

interface ExpenseFiltersProps {
  categories: Category[];
  value: ExpenseFiltersState;
  onChange: (next: ExpenseFiltersState) => void;
}

const ExpenseFilters = ({
  categories,
  value,
  onChange,
}: ExpenseFiltersProps) => {
  const toggleCategory = (id: string, checked: boolean) => {
    const next = checked
      ? [...value.categoryIds, id]
      : value.categoryIds.filter((x) => x !== id);
    onChange({ ...value, categoryIds: next });
  };

  const activeCategoryLabel =
    value.categoryIds.length === 0
      ? "All categories"
      : value.categoryIds.length === 1
        ? (categories.find((c) => c.id === value.categoryIds[0])?.name ??
          "1 category")
        : `${value.categoryIds.length} categories`;

  const rangeLabel = value.dateRange?.from
    ? value.dateRange.to
      ? `${format(value.dateRange.from, "MMM d")} → ${format(value.dateRange.to, "MMM d")}`
      : format(value.dateRange.from, "MMM d, yyyy")
    : "Any date";

  const hasActive =
    value.search.length > 0 ||
    value.categoryIds.length > 0 ||
    !!value.dateRange;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search expenses..."
          value={value.search}
          onChange={(e) => onChange({ ...value, search: e.target.value })}
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="justify-start">
            <Filter className="h-4 w-4" /> {activeCategoryLabel}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Filter by category</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {categories.length === 0 ? (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              No categories yet
            </div>
          ) : (
            categories.map((category) => (
              <DropdownMenuCheckboxItem
                key={category.id}
                checked={value.categoryIds.includes(category.id)}
                onCheckedChange={(checked) =>
                  toggleCategory(category.id, checked === true)
                }
              >
                {category.name}
              </DropdownMenuCheckboxItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start">
            <CalendarIcon className="h-4 w-4" /> {rangeLabel}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={value.dateRange}
            onSelect={(range) => onChange({ ...value, dateRange: range })}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      {hasActive && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            onChange({ search: "", categoryIds: [], dateRange: undefined })
          }
        >
          <X className="h-4 w-4" /> Clear
        </Button>
      )}
    </div>
  );
};

export default ExpenseFilters;
