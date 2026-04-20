import { useState } from "react";
import type { Category } from "../types/expense";
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

interface DeleteCategoryDialogProps {
  open: boolean;
  category: Category | null;
  otherCategories: Category[];
  expenseCount: number;
  onOpenChange: (open: boolean) => void;
  onConfirm: (args: { reassignToId?: string }) => Promise<void> | void;
}

const DeleteCategoryDialog = ({
  open,
  category,
  otherCategories,
  expenseCount,
  onOpenChange,
  onConfirm,
}: DeleteCategoryDialogProps) => {
  const [reassignTo, setReassignTo] = useState<string | undefined>(
    otherCategories[0]?.id
  );
  const [submitting, setSubmitting] = useState(false);

  const hasExpenses = expenseCount > 0;
  const canConfirm =
    !hasExpenses || (!!reassignTo && otherCategories.length > 0);

  const handleConfirm = async () => {
    if (!canConfirm) return;
    setSubmitting(true);
    try {
      await onConfirm({ reassignToId: hasExpenses ? reassignTo : undefined });
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete category</DialogTitle>
          <DialogDescription>
            {category ? (
              <>
                Remove <strong>{category.name}</strong>?{" "}
                {hasExpenses
                  ? `${expenseCount} expense${
                      expenseCount === 1 ? "" : "s"
                    } use this category. Pick a replacement.`
                  : "This category is not used by any expense."}
              </>
            ) : null}
          </DialogDescription>
        </DialogHeader>

        {hasExpenses && (
          <div className="space-y-2">
            <Label>Reassign expenses to</Label>
            {otherCategories.length === 0 ? (
              <p className="text-sm text-destructive">
                Create another category first — there is nowhere to move these
                expenses.
              </p>
            ) : (
              <Select value={reassignTo} onValueChange={setReassignTo}>
                <SelectTrigger>
                  <SelectValue placeholder="Pick a category" />
                </SelectTrigger>
                <SelectContent>
                  {otherCategories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}

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
            variant="destructive"
            onClick={handleConfirm}
            disabled={!canConfirm || submitting}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCategoryDialog;
