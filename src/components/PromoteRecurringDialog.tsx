import { useEffect, useState } from "react";
import DatePicker from "./DatePicker";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import type { Expense, RecurringFrequency } from "../types/expense";

interface PromoteRecurringDialogProps {
  expense: Expense | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (values: {
    frequency: RecurringFrequency;
    endDate?: string;
  }) => Promise<void> | void;
}

const PromoteRecurringDialog = ({
  expense,
  open,
  onOpenChange,
  onConfirm,
}: PromoteRecurringDialogProps) => {
  const [frequency, setFrequency] = useState<RecurringFrequency>("monthly");
  const [endDate, setEndDate] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setFrequency("monthly");
      setEndDate("");
    }
  }, [open]);

  const handleConfirm = async () => {
    if (!expense) return;
    setSubmitting(true);
    try {
      await onConfirm({ frequency, endDate: endDate || undefined });
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Make &quot;{expense?.name}&quot; recurring
          </DialogTitle>
          <DialogDescription>
            The existing expense on {expense?.date} becomes the first
            occurrence. Future occurrences are generated on login.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Frequency</Label>
            <Select
              value={frequency}
              onValueChange={(v) => setFrequency(v as RecurringFrequency)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="promote-end">End date (optional)</Label>
            <DatePicker
              id="promote-end"
              value={endDate}
              onChange={setEndDate}
              placeholder="No end date"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={submitting || !expense}
          >
            Make recurring
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PromoteRecurringDialog;
