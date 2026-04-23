import { Filter, Search, X } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";
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

const EMPTY: ExpenseFiltersState = {
  search: "",
  categoryIds: [],
  groupIds: [],
  dateRange: undefined,
};

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

  const hasGroupsUi = !!groups;

  const activeCount =
    value.categoryIds.length +
    value.groupIds.length +
    (value.dateRange ? 1 : 0);

  const hasActive = activeCount > 0 || value.search.length > 0;

  const reset = () => onChange(EMPTY);

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
              size={activeCount === 0 ? "icon" : "default"}
              aria-label="Filters"
              title="Filters"
            >
              <Filter className="h-4 w-4" />
              {activeCount > 0 && (
                <span className="ml-1 text-xs font-medium tabular-nums">
                  {activeCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-80 p-0">
            <div className="p-3 space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Categories
                </Label>
                {categories.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No categories yet
                  </p>
                ) : (
                  <div className="max-h-48 overflow-auto space-y-1.5 pr-1">
                    {categories.map((category) => {
                      const id = `filter-cat-${category.id}`;
                      const checked = value.categoryIds.includes(category.id);
                      return (
                        <label
                          key={category.id}
                          htmlFor={id}
                          className="flex items-center gap-2 text-sm cursor-pointer rounded-sm px-1 py-1 hover:bg-muted"
                        >
                          <Checkbox
                            id={id}
                            checked={checked}
                            onCheckedChange={(c) =>
                              toggleCategory(category.id, c === true)
                            }
                          />
                          <span className="truncate">{category.name}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {hasGroupsUi && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-muted-foreground">
                      Groups
                    </Label>
                    <div className="max-h-48 overflow-auto space-y-1.5 pr-1">
                      <label
                        htmlFor="filter-grp-none"
                        className="flex items-center gap-2 text-sm cursor-pointer rounded-sm px-1 py-1 hover:bg-muted"
                      >
                        <Checkbox
                          id="filter-grp-none"
                          checked={value.groupIds.includes(NO_GROUP_FILTER)}
                          onCheckedChange={(c) =>
                            toggleGroup(NO_GROUP_FILTER, c === true)
                          }
                        />
                        <span className="italic text-muted-foreground">
                          No group
                        </span>
                      </label>
                      {groups!.length === 0 ? (
                        <p className="px-1 py-1 text-xs text-muted-foreground">
                          No groups yet
                        </p>
                      ) : (
                        groups!.map((group) => {
                          const id = `filter-grp-${group.id}`;
                          const checked = value.groupIds.includes(group.id);
                          return (
                            <label
                              key={group.id}
                              htmlFor={id}
                              className="flex items-center gap-2 text-sm cursor-pointer rounded-sm px-1 py-1 hover:bg-muted"
                            >
                              <Checkbox
                                id={id}
                                checked={checked}
                                onCheckedChange={(c) =>
                                  toggleGroup(group.id, c === true)
                                }
                              />
                              <span className="truncate">{group.name}</span>
                            </label>
                          );
                        })
                      )}
                    </div>
                  </div>
                </>
              )}

              <Separator />
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Custom date range
                </Label>
                <Calendar
                  mode="range"
                  selected={value.dateRange}
                  onSelect={(range) => onChange({ ...value, dateRange: range })}
                  numberOfMonths={1}
                />
              </div>
            </div>
            <Separator />
            <div className="p-2 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={reset}
                disabled={!hasActive}
              >
                Clear all
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <MonthSwitcher
          value={value.dateRange}
          onChange={(range) => onChange({ ...value, dateRange: range })}
        />

        {hasActive && (
          <Button variant="ghost" size="sm" onClick={reset}>
            <X className="h-4 w-4" /> Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default ExpenseFilters;
