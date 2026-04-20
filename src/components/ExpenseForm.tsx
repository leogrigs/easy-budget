import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import type { Category } from "../types/expense";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  amount: z
    .number({ error: "Amount is required" })
    .positive("Amount must be greater than zero"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date"),
  categoryId: z.string().min(1, "Pick a category"),
});

export type ExpenseFormValues = z.infer<typeof schema>;

interface ExpenseFormProps {
  open: boolean;
  title: string;
  submitLabel: string;
  categories: Category[];
  initialValue?: Partial<ExpenseFormValues>;
  onSubmit: (values: ExpenseFormValues) => Promise<void> | void;
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
  onSubmit,
  onOpenChange,
}: ExpenseFormProps) => {
  const defaults: ExpenseFormValues = {
    name: "",
    amount: 0,
    date: today(),
    categoryId: categories[0]?.id ?? "",
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
              <Input
                id="expense-amount"
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
              <Label htmlFor="expense-date">Date</Label>
              <Input
                id="expense-date"
                type="date"
                {...form.register("date")}
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
