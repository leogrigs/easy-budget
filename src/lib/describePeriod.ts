import { endOfMonth, format, isSameDay, startOfMonth } from "date-fns";
import type { DateRange } from "react-day-picker";

export const describePeriod = (
  value: DateRange | undefined
): { mode: "month" | "custom" | "all"; month: Date | null; label: string } => {
  if (!value?.from) return { mode: "all", month: null, label: "All time" };
  if (!value.to) {
    return {
      mode: "custom",
      month: null,
      label: format(value.from, "MMM d, yyyy"),
    };
  }
  const start = startOfMonth(value.from);
  const end = endOfMonth(value.from);
  if (isSameDay(value.from, start) && isSameDay(value.to, end)) {
    return {
      mode: "month",
      month: start,
      label: format(start, "MMMM yyyy"),
    };
  }
  return {
    mode: "custom",
    month: null,
    label: `${format(value.from, "MMM d")} → ${format(value.to, "MMM d, yyyy")}`,
  };
};
