import { Plus, Trash2 } from "lucide-react";
import CurrencyInput from "../../components/CurrencyInput";
import DatePicker from "../../components/DatePicker";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { cn } from "../../lib/utils";
import type { Category } from "../../types/expense";

export type CategoryRef =
  | { kind: "existing"; id: string }
  | { kind: "pending"; key: string }
  | null;

export interface ReviewRow {
  name: string;
  amount: number;
  date: string;
  suggestedName?: string;
  category: CategoryRef;
  error?: string;
}

export interface PendingCategory {
  key: string;
  name: string;
  color: string;
  icon: string;
}

const EXISTING_PREFIX = "id:";
const PENDING_PREFIX = "new:";
const CREATE_PREFIX = "create:";

const refToValue = (ref: CategoryRef): string => {
  if (!ref) return "";
  if (ref.kind === "existing") return `${EXISTING_PREFIX}${ref.id}`;
  return `${PENDING_PREFIX}${ref.key}`;
};

interface ReviewTableProps {
  rows: ReviewRow[];
  categories: Category[];
  pending: PendingCategory[];
  onChange: (index: number, patch: Partial<ReviewRow>) => void;
  onDelete: (index: number) => void;
  onCreatePending: (suggestedName: string) => void;
}

const ReviewTable = ({
  rows,
  categories,
  pending,
  onChange,
  onDelete,
  onCreatePending,
}: ReviewTableProps) => {
  if (rows.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
        No expenses to import. Choose another file.
      </div>
    );
  }

  const existingByLower = new Map(
    categories.map((c) => [c.name.toLowerCase(), c])
  );
  const pendingByLower = new Map(pending.map((p) => [p.key.toLowerCase(), p]));

  const handleCategoryChange = (index: number, value: string) => {
    if (value.startsWith(EXISTING_PREFIX)) {
      onChange(index, {
        category: { kind: "existing", id: value.slice(EXISTING_PREFIX.length) },
      });
      return;
    }
    if (value.startsWith(PENDING_PREFIX)) {
      onChange(index, {
        category: { kind: "pending", key: value.slice(PENDING_PREFIX.length) },
      });
      return;
    }
    if (value.startsWith(CREATE_PREFIX)) {
      onCreatePending(value.slice(CREATE_PREFIX.length));
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30%]">Name</TableHead>
            <TableHead className="w-[15%]">Amount</TableHead>
            <TableHead className="w-[20%]">Date</TableHead>
            <TableHead className="w-[30%]">Category</TableHead>
            <TableHead className="w-[5%]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => {
            const value = refToValue(row.category);
            const suggestion = row.suggestedName?.trim();
            const canOfferCreate =
              !!suggestion &&
              !existingByLower.has(suggestion.toLowerCase()) &&
              !pendingByLower.has(suggestion.toLowerCase());
            const unresolved = !row.category;

            return (
              <TableRow
                key={i}
                className={cn(unresolved && "bg-amber-50/40 dark:bg-amber-950/20")}
              >
                <TableCell className="align-top">
                  <Input
                    value={row.name}
                    onChange={(e) => onChange(i, { name: e.target.value })}
                    aria-label={`Expense ${i + 1} name`}
                  />
                  {row.error && (
                    <p className="mt-1 text-xs text-destructive">{row.error}</p>
                  )}
                </TableCell>
                <TableCell className="align-top">
                  <CurrencyInput
                    value={Number.isFinite(row.amount) ? row.amount : 0}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      onChange(i, { amount: Number.isFinite(n) ? n : 0 });
                    }}
                    aria-label={`Expense ${i + 1} amount`}
                  />
                </TableCell>
                <TableCell className="align-top">
                  <DatePicker
                    value={row.date}
                    onChange={(iso) => onChange(i, { date: iso })}
                  />
                </TableCell>
                <TableCell className="align-top">
                  <Select
                    value={value}
                    onValueChange={(v) => handleCategoryChange(i, v)}
                  >
                    <SelectTrigger
                      className={cn(unresolved && "border-amber-400")}
                      aria-label={`Expense ${i + 1} category`}
                    >
                      <SelectValue placeholder="Pick a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem
                          key={c.id}
                          value={`${EXISTING_PREFIX}${c.id}`}
                        >
                          <span className="inline-flex items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 rounded-sm"
                              style={{ backgroundColor: c.color }}
                            />
                            {c.name}
                          </span>
                        </SelectItem>
                      ))}
                      {pending.length > 0 && <SelectSeparator />}
                      {pending.map((p) => (
                        <SelectItem
                          key={p.key}
                          value={`${PENDING_PREFIX}${p.key}`}
                        >
                          <span className="inline-flex items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 rounded-sm"
                              style={{ backgroundColor: p.color }}
                            />
                            {p.name}
                            <span className="text-xs text-muted-foreground">
                              (new)
                            </span>
                          </span>
                        </SelectItem>
                      ))}
                      {canOfferCreate && (
                        <>
                          <SelectSeparator />
                          <SelectItem value={`${CREATE_PREFIX}${suggestion}`}>
                            <span className="inline-flex items-center gap-2 text-primary">
                              <Plus className="h-3.5 w-3.5" />
                              Create: {suggestion}
                            </span>
                          </SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="align-top">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(i)}
                    aria-label={`Remove expense ${i + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReviewTable;
