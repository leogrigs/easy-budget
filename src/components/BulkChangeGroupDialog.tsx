import { useEffect, useState } from "react";
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
import type { Group } from "../types/expense";

const NONE = "__none__";

interface BulkChangeGroupDialogProps {
  open: boolean;
  count: number;
  groups: Group[];
  onOpenChange: (open: boolean) => void;
  onConfirm: (groupId: string | null) => Promise<void> | void;
}

const BulkChangeGroupDialog = ({
  open,
  count,
  groups,
  onOpenChange,
  onConfirm,
}: BulkChangeGroupDialogProps) => {
  const [value, setValue] = useState<string>(NONE);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) setValue(NONE);
  }, [open]);

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm(value === NONE ? null : value);
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Change group</DialogTitle>
          <DialogDescription>
            Move {count} expense{count === 1 ? "" : "s"} into a group, or clear
            the group assignment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label>Group</Label>
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NONE}>No group</SelectItem>
              {groups.map((g) => (
                <SelectItem key={g.id} value={g.id}>
                  {g.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={submitting}>
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkChangeGroupDialog;
