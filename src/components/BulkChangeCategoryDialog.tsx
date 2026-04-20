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
import type { Category } from "../types/expense";

interface BulkChangeCategoryDialogProps {
  open: boolean;
  count: number;
  categories: Category[];
  onOpenChange: (open: boolean) => void;
  onConfirm: (categoryId: string) => Promise<void> | void;
}

const BulkChangeCategoryDialog = ({
  open,
  count,
  categories,
  onOpenChange,
  onConfirm,
}: BulkChangeCategoryDialogProps) => {
  const [value, setValue] = useState(categories[0]?.id ?? "");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) setValue(categories[0]?.id ?? "");
  }, [open, categories]);

  const handleConfirm = async () => {
    if (!value) return;
    setSubmitting(true);
    try {
      await onConfirm(value);
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Change category</DialogTitle>
          <DialogDescription>
            Move {count} expense{count === 1 ? "" : "s"} into a new category.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label>New category</Label>
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger>
              <SelectValue placeholder="Pick a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
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
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!value || submitting}
          >
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BulkChangeCategoryDialog;
