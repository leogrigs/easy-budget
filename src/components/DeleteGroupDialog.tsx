import { useEffect, useState } from "react";
import type { Group } from "../types/expense";
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

export type DeleteGroupAction =
  | { action: "unset" }
  | { action: "reassign"; reassignToId: string };

interface DeleteGroupDialogProps {
  open: boolean;
  group: Group | null;
  otherGroups: Group[];
  expenseCount: number;
  onOpenChange: (open: boolean) => void;
  onConfirm: (args: DeleteGroupAction) => Promise<void> | void;
}

const DeleteGroupDialog = ({
  open,
  group,
  otherGroups,
  expenseCount,
  onOpenChange,
  onConfirm,
}: DeleteGroupDialogProps) => {
  const [mode, setMode] = useState<"unset" | "reassign">("unset");
  const [reassignTo, setReassignTo] = useState<string | undefined>(
    otherGroups[0]?.id
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setMode("unset");
      setReassignTo(otherGroups[0]?.id);
    }
  }, [open, otherGroups]);

  const hasExpenses = expenseCount > 0;
  const canConfirm =
    !hasExpenses ||
    mode === "unset" ||
    (mode === "reassign" && !!reassignTo && otherGroups.length > 0);

  const handleConfirm = async () => {
    if (!canConfirm) return;
    setSubmitting(true);
    try {
      if (!hasExpenses || mode === "unset") {
        await onConfirm({ action: "unset" });
      } else {
        await onConfirm({ action: "reassign", reassignToId: reassignTo! });
      }
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete group</DialogTitle>
          <DialogDescription>
            {group ? (
              <>
                Remove <strong>{group.name}</strong>?{" "}
                {hasExpenses
                  ? `${expenseCount} expense${
                      expenseCount === 1 ? "" : "s"
                    } belong to this group. Choose what to do with them.`
                  : "This group is not used by any expense."}
              </>
            ) : null}
          </DialogDescription>
        </DialogHeader>

        {hasExpenses && (
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="delete-group-mode"
                value="unset"
                checked={mode === "unset"}
                onChange={() => setMode("unset")}
                className="mt-1"
              />
              <span className="text-sm">
                <span className="font-medium">Unset group on these expenses</span>
                <span className="block text-muted-foreground">
                  Keep the expenses — they just won’t belong to any group.
                </span>
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="delete-group-mode"
                value="reassign"
                checked={mode === "reassign"}
                onChange={() => setMode("reassign")}
                disabled={otherGroups.length === 0}
                className="mt-1"
              />
              <span className="text-sm flex-1">
                <span className="font-medium">Move them to another group</span>
                {otherGroups.length === 0 ? (
                  <span className="block text-muted-foreground">
                    No other groups exist yet.
                  </span>
                ) : (
                  <span className="block mt-2">
                    <Label htmlFor="reassign-group" className="sr-only">
                      Reassign to
                    </Label>
                    <Select
                      value={reassignTo}
                      onValueChange={setReassignTo}
                      disabled={mode !== "reassign"}
                    >
                      <SelectTrigger id="reassign-group">
                        <SelectValue placeholder="Pick a group" />
                      </SelectTrigger>
                      <SelectContent>
                        {otherGroups.map((g) => (
                          <SelectItem key={g.id} value={g.id}>
                            {g.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </span>
                )}
              </span>
            </label>
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

export default DeleteGroupDialog;
