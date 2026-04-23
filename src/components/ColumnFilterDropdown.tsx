import { Filter } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Separator } from "./ui/separator";
import { cn } from "../lib/utils";

export interface ColumnFilterOption {
  value: string;
  label: string;
  italic?: boolean;
}

interface ColumnFilterDropdownProps {
  label: string;
  options: ColumnFilterOption[];
  values: string[];
  onChange: (values: string[]) => void;
  emptyMessage?: string;
}

const ColumnFilterDropdown = ({
  label,
  options,
  values,
  onChange,
  emptyMessage = "No options",
}: ColumnFilterDropdownProps) => {
  const active = values.length > 0;

  const toggle = (value: string, checked: boolean) => {
    const next = checked
      ? [...values, value]
      : values.filter((v) => v !== value);
    onChange(next);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "-ml-2 h-7 gap-1 font-medium",
            active && "text-primary"
          )}
          aria-label={`Filter by ${label.toLowerCase()}`}
        >
          <span>{label}</span>
          <Filter
            className={cn("h-3.5 w-3.5", active && "fill-primary")}
          />
          {active && (
            <span className="text-xs tabular-nums">{values.length}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-0">
        {options.length === 0 ? (
          <p className="p-3 text-sm text-muted-foreground">{emptyMessage}</p>
        ) : (
          <div className="max-h-64 overflow-auto p-2 space-y-0.5">
            {options.map((option) => {
              const id = `col-filter-${label}-${option.value}`;
              const checked = values.includes(option.value);
              return (
                <label
                  key={option.value}
                  htmlFor={id}
                  className="flex items-center gap-2 text-sm cursor-pointer rounded-sm px-1.5 py-1.5 hover:bg-muted"
                >
                  <Checkbox
                    id={id}
                    checked={checked}
                    onCheckedChange={(c) => toggle(option.value, c === true)}
                  />
                  <span
                    className={cn(
                      "truncate",
                      option.italic && "italic text-muted-foreground"
                    )}
                  >
                    {option.label}
                  </span>
                </label>
              );
            })}
          </div>
        )}
        {active && (
          <>
            <Separator />
            <div className="p-1.5 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="h-7"
                onClick={() => onChange([])}
              >
                Clear
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default ColumnFilterDropdown;
