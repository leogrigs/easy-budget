import {
  ColumnDef,
  RowSelectionState,
  SortingFn,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  Download,
  MoreHorizontal,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import BulkChangeCategoryDialog from "../../components/BulkChangeCategoryDialog";
import CategoryBadge from "../../components/CategoryBadge";
import { DataTable } from "../../components/DataTable";
import SelectionActionBar from "../../components/SelectionActionBar";
import ExpenseFilters, {
  ExpenseFiltersState,
} from "../../components/ExpenseFilters";
import ExpenseForm, {
  ExpenseFormResult,
} from "../../components/ExpenseForm";
import Totalizers from "../../components/Totalizers";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Skeleton } from "../../components/ui/skeleton";
import { useCategories } from "../../hooks/useCategories";
import { useExpenses } from "../../hooks/useExpenses";
import { addCategory } from "../../services/categories";
import {
  addExpense,
  bulkAddExpenses,
  bulkDeleteExpenses,
  bulkUpdateCategory,
  deleteExpense,
  updateExpense,
} from "../../services/expenses";
import { addRecurring } from "../../services/recurring";
import type { Expense } from "../../types/expense";
import { downloadExpenseCsv } from "../../features/export/exportCsv";
import ImportDialog from "../../features/import/ImportDialog";

interface ExpensesProps {
  uid: string;
}

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

const Expenses = ({ uid }: ExpensesProps) => {
  const { expenses, loading } = useExpenses(uid);
  const { categories, byId } = useCategories(uid);

  const [filters, setFilters] = useState<ExpenseFiltersState>({
    search: "",
    categoryIds: [],
    dateRange: undefined,
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [deleting, setDeleting] = useState<Expense | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkCategoryOpen, setBulkCategoryOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const filtered = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    const fromIso = filters.dateRange?.from
      ? toIsoDate(filters.dateRange.from)
      : undefined;
    const toIso = filters.dateRange?.to
      ? toIsoDate(filters.dateRange.to)
      : filters.dateRange?.from
        ? toIsoDate(filters.dateRange.from)
        : undefined;

    return expenses.filter((e) => {
      if (search) {
        const category = byId.get(e.categoryId)?.name?.toLowerCase() ?? "";
        if (
          !e.name.toLowerCase().includes(search) &&
          !category.includes(search)
        ) {
          return false;
        }
      }
      if (filters.categoryIds.length > 0) {
        if (!filters.categoryIds.includes(e.categoryId)) return false;
      }
      if (fromIso && e.date < fromIso) return false;
      if (toIso && e.date > toIso) return false;
      return true;
    });
  }, [expenses, byId, filters]);

  const totals = useMemo(() => {
    const nonRefunded = filtered.filter((e) => !e.refunded);
    const total = nonRefunded.reduce((acc, e) => acc + e.amount, 0);
    return { total, count: nonRefunded.length };
  }, [filtered]);

  const selectedIds = useMemo(
    () => Object.keys(rowSelection).filter((k) => rowSelection[k]),
    [rowSelection]
  );

  const columns = useMemo<ColumnDef<Expense>[]>(
    () => [
      {
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
      },
      {
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
            {row.original.refunded && (
              <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                Refunded
              </span>
            )}
          </span>
        ),
      },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="-mr-3"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
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
      },
      {
        id: "category",
        header: "Category",
        cell: ({ row }) => (
          <CategoryBadge category={byId.get(row.original.categoryId)} />
        ),
        sortingFn: compareByCategoryName(byId),
        enableSorting: true,
      },
      {
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
      },
      {
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
                <DropdownMenuItem
                  onSelect={() => {
                    setEditing(row.original);
                    setFormOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => handleToggleRefunded(row.original)}
                >
                  <RotateCcw className="h-4 w-4" />{" "}
                  {row.original.refunded
                    ? "Unmark refunded"
                    : "Mark as refunded"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onSelect={() => setDeleting(row.original)}
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    [byId]
  );

  const handleCreate = async (values: ExpenseFormResult) => {
    if (values.recurring) {
      const recurringId = await addRecurring(uid, {
        name: values.name,
        amount: values.amount,
        categoryId: values.categoryId,
        frequency: values.recurring.frequency,
        startDate: values.date,
        endDate: values.recurring.endDate,
      });
      await addExpense(uid, {
        name: values.name,
        amount: values.amount,
        date: values.date,
        categoryId: values.categoryId,
        recurringId,
      });
      toast.success(`Added recurring "${values.name}"`);
      return;
    }
    await addExpense(uid, {
      name: values.name,
      amount: values.amount,
      date: values.date,
      categoryId: values.categoryId,
    });
    toast.success(`Added "${values.name}"`);
  };

  const handleUpdate = async (values: ExpenseFormResult) => {
    if (!editing) return;
    await updateExpense(uid, editing.id, {
      name: values.name,
      amount: values.amount,
      date: values.date,
      categoryId: values.categoryId,
    });
    toast.success(`Updated "${values.name}"`);
    setEditing(null);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    await deleteExpense(uid, deleting.id);
    toast.success(`Deleted "${deleting.name}"`);
    setDeleting(null);
  };

  const handleToggleRefunded = async (expense: Expense) => {
    const next = !expense.refunded;
    await updateExpense(uid, expense.id, { refunded: next });
    toast.success(
      next ? `Marked "${expense.name}" as refunded` : `Unmarked "${expense.name}"`
    );
  };

  const handleBulkDelete = async () => {
    await bulkDeleteExpenses(uid, selectedIds);
    toast.success(
      `Deleted ${selectedIds.length} expense${selectedIds.length === 1 ? "" : "s"}`
    );
    setRowSelection({});
  };

  const handleBulkChangeCategory = async (categoryId: string) => {
    await bulkUpdateCategory(uid, selectedIds, categoryId);
    toast.success(
      `Moved ${selectedIds.length} expense${selectedIds.length === 1 ? "" : "s"} to a new category`
    );
    setRowSelection({});
  };

  const handleExport = () => {
    const source =
      selectedIds.length > 0
        ? filtered.filter((e) => selectedIds.includes(e.id))
        : filtered;
    if (source.length === 0) {
      toast.info("No expenses to export");
      return;
    }
    downloadExpenseCsv(source, byId);
  };

  const handleImport = async (
    imports: Array<{
      name: string;
      amount: number;
      date: string;
      categoryId: string;
    }>
  ) => {
    if (imports.length === 0) return;
    await bulkAddExpenses(uid, imports);
  };

  const handleCreateCategories = async (
    seeds: Array<{ csvName: string; seed: { name: string; color: string; icon: string } }>
  ): Promise<Record<string, string>> => {
    const baseOrder = categories.length;
    const results = await Promise.all(
      seeds.map(async ({ csvName, seed }, i) => {
        const id = await addCategory(uid, { ...seed, order: baseOrder + i });
        return [csvName, id] as const;
      })
    );
    return Object.fromEntries(results);
  };

  const renderToolbar = () => (
    <ExpenseFilters
      categories={categories}
      value={filters}
      onChange={setFilters}
    />
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Expenses</h1>
          <p className="text-sm text-muted-foreground">
            Track, filter, and manage your expenses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => setImportOpen(true)}
            disabled={categories.length === 0}
          >
            <Upload className="h-4 w-4" /> Import
          </Button>
          <Button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            disabled={categories.length === 0}
          >
            <Plus className="h-4 w-4" /> New expense
          </Button>
        </div>
      </div>

      <Totalizers total={totals.total} count={totals.count} />

      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-10" />
          <Skeleton className="h-48" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage={
            expenses.length === 0
              ? "No expenses yet — add your first one."
              : "No expenses match the current filters."
          }
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          getRowId={(row) => row.id}
          renderToolbar={renderToolbar}
        />
      )}

      <ExpenseForm
        open={formOpen}
        title={editing ? "Edit expense" : "New expense"}
        submitLabel={editing ? "Save" : "Add"}
        categories={categories}
        allowRecurring={!editing}
        initialValue={
          editing
            ? {
                name: editing.name,
                amount: editing.amount,
                date: editing.date,
                categoryId: editing.categoryId,
              }
            : undefined
        }
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        onSubmit={editing ? handleUpdate : handleCreate}
      />

      <AlertDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete expense?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove &quot;{deleting?.name}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {selectedIds.length} expense
              {selectedIds.length === 1 ? "" : "s"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleBulkDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BulkChangeCategoryDialog
        open={bulkCategoryOpen}
        count={selectedIds.length}
        categories={categories}
        onOpenChange={setBulkCategoryOpen}
        onConfirm={handleBulkChangeCategory}
      />

      <ImportDialog
        open={importOpen}
        categories={categories}
        onOpenChange={setImportOpen}
        onImport={handleImport}
        onCreateCategories={handleCreateCategories}
      />

      <SelectionActionBar visible={selectedIds.length > 0}>
        <span className="px-3 text-sm font-medium">
          {selectedIds.length} selected
        </span>
        <span className="h-6 w-px bg-border" aria-hidden />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setBulkCategoryOpen(true)}
          className="rounded-full"
        >
          Change category
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setBulkDeleteOpen(true)}
          className="rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" /> Delete
        </Button>
        <span className="h-6 w-px bg-border" aria-hidden />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setRowSelection({})}
          className="rounded-full text-muted-foreground"
          aria-label="Clear selection"
        >
          <X className="h-4 w-4" />
        </Button>
      </SelectionActionBar>
    </div>
  );
};

const toIsoDate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export default Expenses;
