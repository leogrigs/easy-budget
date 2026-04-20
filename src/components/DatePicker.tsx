import { format, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface DatePickerProps {
  value: string;
  onChange: (iso: string) => void;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
}

const toIso = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const fromIso = (iso: string): Date | undefined => {
  if (!iso) return undefined;
  const parsed = parse(iso, "yyyy-MM-dd", new Date());
  return isNaN(parsed.getTime()) ? undefined : parsed;
};

const DatePicker = ({
  value,
  onChange,
  placeholder = "Pick a date",
  id,
  disabled,
  className,
}: DatePickerProps) => {
  const selected = fromIso(value);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start font-normal",
            !selected && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="h-4 w-4" />
          {selected ? format(selected, "PP") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(d) => d && onChange(toIso(d))}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
