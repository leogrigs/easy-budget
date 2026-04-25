import { ColumnDef, SortingFn } from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  Pencil,
  Repeat,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import CategoryBadge from "../../components/CategoryBadge";
import ColumnFilterDropdown from "../../components/ColumnFilterDropdown";
import { NO_GROUP_FILTER } from "../../components/ExpenseFilters";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { updateExpense } from "../../services/expenses";
import type { Category, Expense, Group } from "../../types/expense";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const compareByCategoryName =
  (byId: Map<string, { name: string }>): SortingFn<Expense> =>
  (a, b) => {
    const an = byId.get(a.original.categoryId)?.name ?? "";
    const bn = byId.get(b.original.categoryId)?.name ?? "";
    return an.localeCompare(bn);
  };

export interface ColumnHeaderFilters {
  categories: Category[];
  groups: Group[];
  categoryIds: string[];
  groupIds: string[];
  onCategoryIdsChange: (ids: string[]) => void;
  onGroupIdsChange: (ids: string[]) => void;
}

export interface ExpenseTableMeta {
  headerFilters?: ColumnHeaderFilters;
}

export interface BuildExpenseColumnsOptions {
  uid: string;
  byId: Map<string, Category>;
  groupsById?: Map<string, Group>;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
  onDeletePurchase?: (expense: Expense) => void;
  onPromote?: (expense: Expense) => void;
  includeSelect?: boolean;
  includeGroup?: boolean;
}

export const buildExpenseColumns = ({
  uid,
  byId,
  groupsById,
  onEdit,
  onDelete,
  onDeletePurchase,
  onPromote,
  includeSelect = true,
  includeGroup = false,
}: BuildExpenseColumnsOptions): ColumnDef<Expense>[] => {
  const columns: ColumnDef<Expense>[] = [];

  if (includeSelect) {
    columns.push({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
    });
  }

  columns.push({
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="inline-flex items-center gap-2">
        <span
          className={
            row.original.refunded
              ? "font-medium line-through text-muted-foreground"
              : "font-medium"
          }
        >
          {row.original.name}
        </span>
        {row.original.recurringId && (
          <span
            className="inline-flex items-center text-muted-foreground"
            title="Recurring"
            aria-label="Recurring"
          >
            <Repeat className="h-3.5 w-3.5" />
          </span>
        )}
        {row.original.installmentTotal && (
          <span
            className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground tabular-nums"
            title="Installment"
            aria-label={`Installment ${row.original.installmentNumber} of ${row.original.installmentTotal}`}
          >
            {row.original.installmentNumber}/{row.original.installmentTotal}
          </span>
        )}
        {row.original.refunded && (
          <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            Refunded
          </span>
        )}
      </span>
    ),
  });

  columns.push({
    accessorKey: "amount",
    header: ({ column }) => (
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="-mr-3"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <div
        className={
          row.original.refunded
            ? "text-right font-medium tabular-nums line-through text-muted-foreground"
            : "text-right font-medium tabular-nums"
        }
      >
        {currency.format(row.original.amount)}
      </div>
    ),
  });

  columns.push({
    id: "category",
    header: ({ table }) => {
      const meta = table.options.meta as ExpenseTableMeta | undefined;
      const f = meta?.headerFilters;
      if (!f) return <span>Category</span>;
      return (
        <ColumnFilterDropdown
          label="Category"
          options={f.categories.map((c) => ({
            value: c.id,
            label: c.name,
          }))}
          values={f.categoryIds}
          onChange={f.onCategoryIdsChange}
          emptyMessage="No categories yet"
        />
      );
    },
    cell: ({ row }) => (
      <CategoryBadge category={byId.get(row.original.categoryId)} />
    ),
    sortingFn: compareByCategoryName(byId),
    enableSorting: true,
  });

  if (includeGroup && groupsById) {
    columns.push({
      id: "group",
      header: ({ table }) => {
        const meta = table.options.meta as ExpenseTableMeta | undefined;
        const f = meta?.headerFilters;
        if (!f) return <span>Group</span>;
        return (
          <ColumnFilterDropdown
            label="Group"
            options={[
              {
                value: NO_GROUP_FILTER,
                label: "No group",
                italic: true,
              },
              ...f.groups.map((g) => ({
                value: g.id,
                label: g.name,
              })),
            ]}
            values={f.groupIds}
            onChange={f.onGroupIdsChange}
            emptyMessage="No groups yet"
          />
        );
      },
      cell: ({ row }) => {
        const g = row.original.groupId
          ? groupsById.get(row.original.groupId)
          : undefined;
        return g ? (
          <span className="truncate text-sm">{g.name}</span>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        );
      },
    });
  }

  columns.push({
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {new Date(row.original.date).toLocaleDateString()}
      </span>
    ),
  });

  columns.push({
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Row actions">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => onEdit(row.original)}>
              <Pencil className="h-4 w-4" /> Edit
            </DropdownMenuItem>
            {onPromote && !row.original.recurringId && (
              <DropdownMenuItem onSelect={() => onPromote(row.original)}>
                <Repeat className="h-4 w-4" /> Make recurring
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onSelect={async () => {
                const next = !row.original.refunded;
                try {
                  await updateExpense(uid, row.original.id, {
                    refunded: next,
                  });
                  toast.success(
                    next
                      ? `Marked "${row.original.name}" as refunded`
                      : `Unmarked "${row.original.name}"`
                  );
                } catch (error) {
                  console.error("[expenses] toggle refunded failed", error);
                  toast.error(
                    `Failed to update "${row.original.name}"`
                  );
                }
              }}
            >
              <RotateCcw className="h-4 w-4" />{" "}
              {row.original.refunded
                ? "Unmark refunded"
                : "Mark as refunded"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onSelect={() => onDelete(row.original)}
            >
              <Trash2 className="h-4 w-4" />{" "}
              {row.original.installmentGroupId
                ? "Delete this installment"
                : "Delete"}
            </DropdownMenuItem>
            {onDeletePurchase && row.original.installmentGroupId && (
              <DropdownMenuItem
                className="text-destructive"
                onSelect={() => onDeletePurchase(row.original)}
              >
                <Trash2 className="h-4 w-4" /> Delete entire purchase
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  });

  return columns;
};
