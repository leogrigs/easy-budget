import { CalendarIcon, Search, X } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import MonthSwitcher from "./MonthSwitcher";

export const NO_GROUP_FILTER = "__none__";

export interface ExpenseFiltersState {
  search: string;
  categoryIds: string[];
  groupIds: string[];
  dateRange: DateRange | undefined;
}

interface ExpenseFiltersProps {
  value: ExpenseFiltersState;
  onChange: (next: ExpenseFiltersState) => void;
}

const EMPTY: ExpenseFiltersState = {
  search: "",
  categoryIds: [],
  groupIds: [],
  dateRange: undefined,
};

const ExpenseFilters = ({ value, onChange }: ExpenseFiltersProps) => {
  const hasActive =
    value.search.length > 0 ||
    value.categoryIds.length > 0 ||
    value.groupIds.length > 0 ||
    !!value.dateRange;

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative lg:flex-1 lg:min-w-[240px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search expenses..."
          value={value.search}
          onChange={(e) => onChange({ ...value, search: e.target.value })}
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              aria-label="Custom date range"
              title="Custom date range"
            >
              <CalendarIcon className="h-4 w-4" />
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

        <MonthSwitcher
          value={value.dateRange}
          onChange={(range) => onChange({ ...value, dateRange: range })}
        />

        {hasActive && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange(EMPTY)}
          >
            <X className="h-4 w-4" /> Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default ExpenseFilters;
