import { addMonths, endOfMonth, format, startOfMonth } from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { describePeriod } from "../lib/describePeriod";
import { Button } from "./ui/button";

interface MonthSwitcherProps {
  value: DateRange | undefined;
  onChange: (next: DateRange | undefined) => void;
}

const rangeForMonth = (anchor: Date): DateRange => ({
  from: startOfMonth(anchor),
  to: endOfMonth(anchor),
});

const MonthSwitcher = ({ value, onChange }: MonthSwitcherProps) => {
  const state = describePeriod(value);
  const label =
    state.mode === "month"
      ? format(state.month!, "MMMM yyyy")
      : state.mode === "custom"
      ? "Custom range"
      : "All time";

  const goPrev = () => {
    const anchor =
      state.mode === "month"
        ? addMonths(state.month!, -1)
        : addMonths(new Date(), -1);
    onChange(rangeForMonth(anchor));
  };
  const goNext = () => {
    const anchor =
      state.mode === "month"
        ? addMonths(state.month!, 1)
        : new Date();
    onChange(rangeForMonth(anchor));
  };

  return (
    <div className="inline-flex items-center gap-1">
      <div className="inline-flex items-center rounded-md border border-border bg-background">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-r-none"
          onClick={goPrev}
          disabled={state.mode === "custom"}
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="px-3 text-sm font-medium tabular-nums min-w-[108px] text-center">
          {label}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-l-none"
          onClick={goNext}
          disabled={state.mode === "custom"}
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      {state.mode === "all" ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange(rangeForMonth(new Date()))}
        >
          <CalendarDays className="h-4 w-4" /> This month
        </Button>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange(undefined)}
        >
          All time
        </Button>
      )}
    </div>
  );
};

export default MonthSwitcher;
