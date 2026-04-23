import { CalendarIcon, Filter, Search, Users, X } from "lucide-react";
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
import MonthSwitcher from "./MonthSwitcher";
import type { Category, Group } from "../types/expense";

export const NO_GROUP_FILTER = "__none__";

export interface ExpenseFiltersState {
  search: string;
  categoryIds: string[];
  groupIds: string[];
  dateRange: DateRange | undefined;
}

interface ExpenseFiltersProps {
  categories: Category[];
  groups?: Group[];
  value: ExpenseFiltersState;
  onChange: (next: ExpenseFiltersState) => void;
}

const ExpenseFilters = ({
  categories,
  groups,
  value,
  onChange,
}: ExpenseFiltersProps) => {
  const toggleCategory = (id: string, checked: boolean) => {
    const next = checked
      ? [...value.categoryIds, id]
      : value.categoryIds.filter((x) => x !== id);
    onChange({ ...value, categoryIds: next });
  };

  const toggleGroup = (id: string, checked: boolean) => {
    const next = checked
      ? [...value.groupIds, id]
      : value.groupIds.filter((x) => x !== id);
    onChange({ ...value, groupIds: next });
  };

  const categoryCount = value.categoryIds.length;
  const groupCount = value.groupIds.length;

  const hasGroupsUi = !!groups;

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

      <div className="flex flex-wrap items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size={categoryCount === 0 ? "icon" : "default"}
              aria-label="Filter by category"
              title="Filter by category"
            >
              <Filter className="h-4 w-4" />
              {categoryCount > 0 && (
                <span className="ml-1 text-xs font-medium tabular-nums">
                  {categoryCount}
                </span>
              )}
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
                  onSelect={(e) => e.preventDefault()}
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

        {hasGroupsUi && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size={groupCount === 0 ? "icon" : "default"}
                aria-label="Filter by group"
                title="Filter by group"
              >
                <Users className="h-4 w-4" />
                {groupCount > 0 && (
                  <span className="ml-1 text-xs font-medium tabular-nums">
                    {groupCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Filter by group</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={value.groupIds.includes(NO_GROUP_FILTER)}
                onSelect={(e) => e.preventDefault()}
                onCheckedChange={(checked) =>
                  toggleGroup(NO_GROUP_FILTER, checked === true)
                }
              >
                <span className="italic text-muted-foreground">No group</span>
              </DropdownMenuCheckboxItem>
              {groups!.length === 0 ? (
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  No groups yet
                </div>
              ) : (
                groups!.map((group) => (
                  <DropdownMenuCheckboxItem
                    key={group.id}
                    checked={value.groupIds.includes(group.id)}
                    onSelect={(e) => e.preventDefault()}
                    onCheckedChange={(checked) =>
                      toggleGroup(group.id, checked === true)
                    }
                  >
                    {group.name}
                  </DropdownMenuCheckboxItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <MonthSwitcher
          value={value.dateRange}
          onChange={(range) => onChange({ ...value, dateRange: range })}
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Custom date range">
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

        {hasActive && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              onChange({
                search: "",
                categoryIds: [],
                groupIds: [],
                dateRange: undefined,
              })
            }
          >
            <X className="h-4 w-4" /> Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default ExpenseFilters;
