import { RowSelectionState } from "@tanstack/react-table";
import { endOfMonth, startOfMonth } from "date-fns";
import {
  Download,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import BulkChangeCategoryDialog from "../../components/BulkChangeCategoryDialog";
import BulkChangeGroupDialog from "../../components/BulkChangeGroupDialog";
import { DataTable } from "../../components/DataTable";
import SelectionActionBar from "../../components/SelectionActionBar";
import ExpenseFilters, {
  ExpenseFiltersState,
} from "../../components/ExpenseFilters";
import ExpenseForm, {
  ExpenseFormResult,
} from "../../components/ExpenseForm";
import PromoteRecurringDialog from "../../components/PromoteRecurringDialog";
import Totalizers from "../../components/Totalizers";
import { describePeriod } from "../../lib/describePeriod";
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
import { Skeleton } from "../../components/ui/skeleton";
import { useCategories } from "../../hooks/useCategories";
import { useExpenses } from "../../hooks/useExpenses";
import { useGroups } from "../../hooks/useGroups";
import { addCategory } from "../../services/categories";
import {
  addExpense,
  bulkAddExpenses,
  bulkDeleteExpenses,
  bulkUpdateCategory,
  bulkUpdateGroup,
  deleteExpense,
  updateExpense,
} from "../../services/expenses";
import { addRecurring } from "../../services/recurring";
import type { Expense } from "../../types/expense";
import { downloadExpenseCsv } from "../../features/export/exportCsv";
import ImportDialog from "../../features/import/ImportDialog";
import { buildExpenseColumns } from "./columns";
import { applyExpenseFilters } from "./filters";

interface ExpensesProps {
  uid: string;
}

const Expenses = ({ uid }: ExpensesProps) => {
  const { expenses, loading } = useExpenses(uid);
  const { categories, byId } = useCategories(uid);
  const { groups, byId: groupsById } = useGroups(uid);

  const [filters, setFilters] = useState<ExpenseFiltersState>(() => {
    const now = new Date();
    return {
      search: "",
      categoryIds: [],
      groupIds: [],
      dateRange: { from: startOfMonth(now), to: endOfMonth(now) },
    };
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [deleting, setDeleting] = useState<Expense | null>(null);
  const [promoting, setPromoting] = useState<Expense | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkCategoryOpen, setBulkCategoryOpen] = useState(false);
  const [bulkGroupOpen, setBulkGroupOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const filtered = useMemo(
    () => applyExpenseFilters(expenses, byId, filters),
    [expenses, byId, filters]
  );

  const totals = useMemo(() => {
    const nonRefunded = filtered.filter((e) => !e.refunded);
    const total = nonRefunded.reduce((acc, e) => acc + e.amount, 0);
    const fixed = nonRefunded
      .filter((e) => !!e.recurringId)
      .reduce((acc, e) => acc + e.amount, 0);
    return { total, count: nonRefunded.length, fixed };
  }, [filtered]);

  const selectedIds = useMemo(
    () => Object.keys(rowSelection).filter((k) => rowSelection[k]),
    [rowSelection]
  );

  const columns = useMemo(
    () =>
      buildExpenseColumns({
        uid,
        byId,
        groupsById,
        onEdit: (e) => {
          setEditing(e);
          setFormOpen(true);
        },
        onDelete: (e) => setDeleting(e),
        onPromote: (e) => setPromoting(e),
        includeGroup: groups.length > 0,
        headerFilters: {
          categories,
          groups,
          categoryIds: filters.categoryIds,
          groupIds: filters.groupIds,
          onCategoryIdsChange: (categoryIds) =>
            setFilters((f) => ({ ...f, categoryIds })),
          onGroupIdsChange: (groupIds) =>
            setFilters((f) => ({ ...f, groupIds })),
        },
      }),
    [
      uid,
      byId,
      groupsById,
      categories,
      groups,
      filters.categoryIds,
      filters.groupIds,
    ]
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
        groupId: values.groupId,
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
      groupId: values.groupId,
    });
    toast.success(`Added "${values.name}"`);
  };

  const handleUpdate = async (values: ExpenseFormResult) => {
    if (!editing) return;
    const nextGroupId =
      values.groupId ?? (editing.groupId ? null : undefined);
    await updateExpense(uid, editing.id, {
      name: values.name,
      amount: values.amount,
      date: values.date,
      categoryId: values.categoryId,
      groupId: nextGroupId,
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

  const handlePromoteRecurring = async (values: {
    frequency: "weekly" | "monthly";
    endDate?: string;
  }) => {
    if (!promoting) return;
    const recurringId = await addRecurring(uid, {
      name: promoting.name,
      amount: promoting.amount,
      categoryId: promoting.categoryId,
      frequency: values.frequency,
      startDate: promoting.date,
      endDate: values.endDate,
    });
    await updateExpense(uid, promoting.id, { recurringId });
    toast.success(`"${promoting.name}" is now recurring`);
    setPromoting(null);
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

  const handleBulkChangeGroup = async (groupId: string | null) => {
    await bulkUpdateGroup(uid, selectedIds, groupId);
    toast.success(
      groupId === null
        ? `Cleared group on ${selectedIds.length} expense${selectedIds.length === 1 ? "" : "s"}`
        : `Moved ${selectedIds.length} expense${selectedIds.length === 1 ? "" : "s"} to a new group`
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
    <ExpenseFilters value={filters} onChange={setFilters} />
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
          <Button
            variant="outline"
            onClick={handleExport}
            className="h-9 w-9 p-0 sm:w-auto sm:px-3"
            aria-label="Export CSV"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Export CSV</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => setImportOpen(true)}
            disabled={categories.length === 0}
            className="h-9 w-9 p-0 sm:w-auto sm:px-3"
            aria-label="Import"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Import</span>
          </Button>
          <Button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            disabled={categories.length === 0}
          >
            <Plus className="h-4 w-4" />
            <span className="sm:hidden ml-1">New</span>
            <span className="hidden sm:inline ml-1">New expense</span>
          </Button>
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            {describePeriod(filters.dateRange).label}
          </h2>
          <p className="text-xs text-muted-foreground">
            Reference period for the numbers below
          </p>
        </div>
      </div>

      <Totalizers
        total={totals.total}
        count={totals.count}
        fixed={totals.fixed}
      />

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
        groups={groups}
        allowRecurring={!editing}
        initialValue={
          editing
            ? {
                name: editing.name,
                amount: editing.amount,
                date: editing.date,
                categoryId: editing.categoryId,
                groupId: editing.groupId,
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

      <BulkChangeGroupDialog
        open={bulkGroupOpen}
        count={selectedIds.length}
        groups={groups}
        onOpenChange={setBulkGroupOpen}
        onConfirm={handleBulkChangeGroup}
      />

      <ImportDialog
        open={importOpen}
        categories={categories}
        onOpenChange={setImportOpen}
        onImport={handleImport}
        onCreateCategories={handleCreateCategories}
      />

      <PromoteRecurringDialog
        expense={promoting}
        open={!!promoting}
        onOpenChange={(open) => !open && setPromoting(null)}
        onConfirm={handlePromoteRecurring}
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
        {groups.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setBulkGroupOpen(true)}
            className="rounded-full"
          >
            Change group
          </Button>
        )}
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

export default Expenses;
