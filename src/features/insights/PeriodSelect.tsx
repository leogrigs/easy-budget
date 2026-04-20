import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PERIOD_OPTIONS, type PeriodKey } from "./aggregate";

interface PeriodSelectProps {
  value: PeriodKey;
  onChange: (value: PeriodKey) => void;
}

const PeriodSelect = ({ value, onChange }: PeriodSelectProps) => {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as PeriodKey)}>
      <SelectTrigger className="w-[180px]" aria-label="Period">
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {PERIOD_OPTIONS.map((p) => (
          <SelectItem key={p.key} value={p.key}>
            {p.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default PeriodSelect;
