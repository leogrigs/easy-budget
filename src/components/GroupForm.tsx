import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
});

export type GroupFormValues = z.infer<typeof schema>;

interface GroupFormProps {
  open: boolean;
  initialValue?: Partial<GroupFormValues>;
  title: string;
  submitLabel: string;
  onSubmit: (values: GroupFormValues) => Promise<void> | void;
  onOpenChange: (open: boolean) => void;
}

const DEFAULTS: GroupFormValues = {
  name: "",
};

const GroupForm = ({
  open,
  initialValue,
  title,
  submitLabel,
  onSubmit,
  onOpenChange,
}: GroupFormProps) => {
  const form = useForm<GroupFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { ...DEFAULTS, ...initialValue },
  });

  // Callers pass `initialValue` as an inline object literal, so depending on
  // it would re-fire this effect on every render. Snapshot via ref and reset
  // only when the dialog transitions open.
  const initialValueRef = useRef(initialValue);
  initialValueRef.current = initialValue;

  useEffect(() => {
    if (open) {
      form.reset({ ...DEFAULTS, ...initialValueRef.current });
    }
  }, [open, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Group expenses by occasion — a trip, an event, a project.
          </DialogDescription>
        </DialogHeader>
        <form id="group-form" onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="group-name">Name</Label>
            <Input
              id="group-name"
              placeholder="e.g. Japan Trip"
              autoFocus
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
        </form>
        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="group-form"
            disabled={form.formState.isSubmitting}
          >
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GroupForm;
