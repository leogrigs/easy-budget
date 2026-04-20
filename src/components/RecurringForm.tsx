import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Category, RecurringFrequency } from "../types/expense";
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
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const schema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(120),
    amount: z
      .number({ error: "Amount is required" })
      .positive("Amount must be greater than zero"),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional()
      .or(z.literal("")),
    categoryId: z.string().min(1, "Pick a category"),
    frequency: z.enum(["weekly", "monthly"]),
  })
  .superRefine((v, ctx) => {
    if (v.endDate && v.endDate < v.startDate) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date must be after the start date",
      });
    }
  });

export type RecurringFormValues = z.infer<typeof schema>;

interface RecurringFormProps {
  open: boolean;
  title: string;
  submitLabel: string;
  categories: Category[];
  initialValue?: Partial<RecurringFormValues>;
  onSubmit: (values: RecurringFormValues) => Promise<void> | void;
  onOpenChange: (open: boolean) => void;
}

const RecurringForm = ({
  open,
  title,
  submitLabel,
  categories,
  initialValue,
  onSubmit,
  onOpenChange,
}: RecurringFormProps) => {
  const defaults: RecurringFormValues = {
    name: "",
    amount: 0,
    startDate: "",
    endDate: "",
    categoryId: categories[0]?.id ?? "",
    frequency: "monthly",
  };

  const form = useForm<RecurringFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { ...defaults, ...initialValue },
  });

  useEffect(() => {
    if (open) {
      form.reset({ ...defaults, ...initialValue });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialValue, categories]);

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
            Update the schedule or amount. Past generated expenses are not
            changed.
          </DialogDescription>
        </DialogHeader>
        <form id="recurring-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recurring-name">Name</Label>
            <Input id="recurring-name" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recurring-amount">Amount</Label>
              <Input
                id="recurring-amount"
                type="number"
                step="0.01"
                min="0"
                {...form.register("amount", { valueAsNumber: true })}
              />
              {form.formState.errors.amount && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.amount.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select
                value={form.watch("frequency")}
                onValueChange={(v) =>
                  form.setValue("frequency", v as RecurringFrequency, {
                    shouldValidate: true,
                  })
                }
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recurring-start">Start date</Label>
              <DatePicker
                id="recurring-start"
                value={form.watch("startDate")}
                onChange={(iso) =>
                  form.setValue("startDate", iso, { shouldValidate: true })
                }
              />
              {form.formState.errors.startDate && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.startDate.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="recurring-end">End date (optional)</Label>
              <DatePicker
                id="recurring-end"
                value={form.watch("endDate") ?? ""}
                onChange={(iso) =>
                  form.setValue("endDate", iso, { shouldValidate: true })
                }
                placeholder="No end date"
              />
              {form.formState.errors.endDate && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.endDate.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={form.watch("categoryId")}
              onValueChange={(v) =>
                form.setValue("categoryId", v, { shouldValidate: true })
              }
            >
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
            form="recurring-form"
            disabled={form.formState.isSubmitting}
          >
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecurringForm;
