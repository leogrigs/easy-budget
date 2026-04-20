import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CurrencyInput from "./CurrencyInput";
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
import { Switch } from "./ui/switch";
import type { Category, RecurringFrequency } from "../types/expense";

const schema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(120),
    amount: z
      .number({ error: "Amount is required" })
      .positive("Amount must be greater than zero"),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date"),
    categoryId: z.string().min(1, "Pick a category"),
    recurring: z.boolean(),
    frequency: z.enum(["weekly", "monthly"]).optional(),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional()
      .or(z.literal("")),
  })
  .superRefine((v, ctx) => {
    if (v.recurring && !v.frequency) {
      ctx.addIssue({
        code: "custom",
        path: ["frequency"],
        message: "Pick a frequency",
      });
    }
    if (v.recurring && v.endDate && v.endDate < v.date) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date must be after the start date",
      });
    }
  });

export type ExpenseFormValues = z.infer<typeof schema>;

export interface ExpenseFormResult {
  name: string;
  amount: number;
  date: string;
  categoryId: string;
  recurring?: {
    frequency: RecurringFrequency;
    endDate?: string;
  };
}

interface ExpenseFormProps {
  open: boolean;
  title: string;
  submitLabel: string;
  categories: Category[];
  initialValue?: {
    name: string;
    amount: number;
    date: string;
    categoryId: string;
  };
  allowRecurring?: boolean;
  onSubmit: (values: ExpenseFormResult) => Promise<void> | void;
  onOpenChange: (open: boolean) => void;
}

const today = (): string => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const ExpenseForm = ({
  open,
  title,
  submitLabel,
  categories,
  initialValue,
  allowRecurring = true,
  onSubmit,
  onOpenChange,
}: ExpenseFormProps) => {
  const defaults: ExpenseFormValues = {
    name: "",
    amount: 0,
    date: today(),
    categoryId: categories[0]?.id ?? "",
    recurring: false,
    frequency: "monthly",
    endDate: "",
  };

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { ...defaults, ...initialValue },
  });

  useEffect(() => {
    if (open) {
      form.reset({ ...defaults, ...initialValue });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialValue, categories]);

  const categoryId = form.watch("categoryId");
  const recurring = form.watch("recurring");

  const handleSubmit = form.handleSubmit(async (values) => {
    const result: ExpenseFormResult = {
      name: values.name,
      amount: values.amount,
      date: values.date,
      categoryId: values.categoryId,
    };
    if (values.recurring && values.frequency) {
      result.recurring = {
        frequency: values.frequency,
        endDate: values.endDate || undefined,
      };
    }
    await onSubmit(result);
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Enter the details for this expense.
          </DialogDescription>
        </DialogHeader>
        <form id="expense-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="expense-name">Name</Label>
            <Input
              id="expense-name"
              placeholder="e.g. Groceries"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expense-amount">Amount</Label>
              <CurrencyInput
                id="expense-amount"
                {...form.register("amount", { valueAsNumber: true })}
              />
              {form.formState.errors.amount && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.amount.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="expense-date">Date</Label>
              <DatePicker
                id="expense-date"
                value={form.watch("date")}
                onChange={(iso) =>
                  form.setValue("date", iso, { shouldValidate: true })
                }
              />
              {form.formState.errors.date && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.date.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={categoryId}
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
            {form.formState.errors.categoryId && (
              <p className="text-xs text-destructive">
                {form.formState.errors.categoryId.message}
              </p>
            )}
          </div>

          {allowRecurring && (
            <div className="rounded-md border border-border p-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="expense-recurring">Recurring</Label>
                  <p className="text-xs text-muted-foreground">
                    Repeat this expense on a schedule. The first occurrence is
                    created now.
                  </p>
                </div>
                <Switch
                  id="expense-recurring"
                  checked={recurring}
                  onCheckedChange={(v) =>
                    form.setValue("recurring", v, { shouldValidate: true })
                  }
                />
              </div>
              {recurring && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <Select
                      value={form.watch("frequency") ?? "monthly"}
                      onValueChange={(v) =>
                        form.setValue(
                          "frequency",
                          v as RecurringFrequency,
                          { shouldValidate: true }
                        )
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
                  <div className="space-y-2">
                    <Label htmlFor="expense-end">End date (optional)</Label>
                    <DatePicker
                      id="expense-end"
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
              )}
            </div>
          )}
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
            form="expense-form"
            disabled={form.formState.isSubmitting}
          >
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseForm;
