import { ArrowLeft, Hash, Pencil, Trash2, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { CategoryIcon } from "../../components/CategoryIcon";
import { DataTable } from "../../components/DataTable";
import DeleteGroupDialog, {
  type DeleteGroupAction,
} from "../../components/DeleteGroupDialog";
import ExpenseForm, {
  ExpenseFormResult,
} from "../../components/ExpenseForm";
import GroupForm, {
  type GroupFormValues,
} from "../../components/GroupForm";
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
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import CategoryBreakdownChart from "../../features/insights/CategoryBreakdownChart";
import KpiCard from "../../features/insights/KpiCard";
import { formatBRL } from "../../features/insights/formatBRL";
import { sumByCategory } from "../../features/insights/aggregate";
import { useCategories } from "../../hooks/useCategories";
import { useExpenses } from "../../hooks/useExpenses";
import { useGroups } from "../../hooks/useGroups";
import { contrastingText } from "../../lib/categoryPalette";
import { deleteExpense, updateExpense } from "../../services/expenses";
import { bulkUpdateGroup } from "../../services/expenses";
import { deleteGroup, updateGroup } from "../../services/groups";
import type { Expense } from "../../types/expense";
import { buildExpenseColumns } from "../Expenses/columns";

interface GroupDetailProps {
  uid: string;
}

const GroupDetail = ({ uid }: GroupDetailProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { groups, byId: groupsById, loading: loadingGroups } = useGroups(uid);
  const { categories, byId } = useCategories(uid);
  const { expenses, loading: loadingExpenses } = useExpenses(uid);

  const group = id ? groupsById.get(id) : undefined;

  const groupExpenses = useMemo(
    () => expenses.filter((e) => e.groupId === id),
    [expenses, id]
  );

  const totalSpent = useMemo(
    () =>
      groupExpenses
        .filter((e) => !e.refunded)
        .reduce((acc, e) => acc + e.amount, 0),
    [groupExpenses]
  );

  const byCategory = useMemo(
    () =>
      sumByCategory(
        groupExpenses.filter((e) => !e.refunded),
        categories
      ),
    [groupExpenses, categories]
  );

  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);

  const columns = useMemo(
    () =>
      buildExpenseColumns({
        uid,
        byId,
        onEdit: (e) => setEditingExpense(e),
        onDelete: (e) => setDeletingExpense(e),
        includeSelect: false,
      }),
    [uid, byId]
  );

  const handleEditGroup = async (values: GroupFormValues) => {
    if (!group) return;
    await updateGroup(uid, group.id, values);
    toast.success(`Updated group "${values.name}"`);
  };

  const handleDeleteGroup = async (args: DeleteGroupAction) => {
    if (!group) return;
    const ids = groupExpenses.map((e) => e.id);
    if (ids.length > 0) {
      await bulkUpdateGroup(
        uid,
        ids,
        args.action === "reassign" ? args.reassignToId : null
      );
    }
    await deleteGroup(uid, group.id);
    toast.success(`Deleted group "${group.name}"`);
    setDeleting(false);
    navigate("/groups");
  };

  const handleUpdateExpense = async (values: ExpenseFormResult) => {
    if (!editingExpense) return;
    const nextGroupId =
      values.groupId ?? (editingExpense.groupId ? null : undefined);
    await updateExpense(uid, editingExpense.id, {
      name: values.name,
      amount: values.amount,
      date: values.date,
      categoryId: values.categoryId,
      groupId: nextGroupId,
    });
    toast.success(`Updated "${values.name}"`);
    setEditingExpense(null);
  };

  const handleDeleteExpense = async () => {
    if (!deletingExpense) return;
    await deleteExpense(uid, deletingExpense.id);
    toast.success(`Deleted "${deletingExpense.name}"`);
    setDeletingExpense(null);
  };

  const loading = loadingGroups || loadingExpenses;

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="space-y-4">
        <Button asChild variant="ghost" size="sm">
          <Link to="/groups">
            <ArrowLeft className="h-4 w-4" /> Back to groups
          </Link>
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Group not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <Button asChild variant="ghost" size="icon" aria-label="Back">
            <Link to="/groups">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div
            className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: group.color,
              color: contrastingText(group.color),
            }}
          >
            <CategoryIcon name={group.icon} className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight truncate">
              {group.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              Expenses tagged to this group.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setEditOpen(true)}>
            <Pencil className="h-4 w-4" />
            <span className="ml-2">Edit</span>
          </Button>
          <Button
            variant="ghost"
            onClick={() => setDeleting(true)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
            <span className="ml-2">Delete</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <KpiCard
          label="Total spent"
          value={formatBRL(totalSpent)}
          icon={Wallet}
          index={0}
        />
        <KpiCard
          label="Expenses"
          value={String(groupExpenses.length)}
          icon={Hash}
          index={1}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>By category</CardTitle>
        </CardHeader>
        <CardContent>
          {byCategory.length > 0 ? (
            <CategoryBreakdownChart data={byCategory} />
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No expenses in this group yet.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={groupExpenses}
            emptyMessage="No expenses in this group yet."
            getRowId={(row) => row.id}
          />
        </CardContent>
      </Card>

      <GroupForm
        open={editOpen}
        title="Edit group"
        submitLabel="Save"
        initialValue={{
          name: group.name,
          color: group.color,
          icon: group.icon,
        }}
        onOpenChange={setEditOpen}
        onSubmit={handleEditGroup}
      />

      <DeleteGroupDialog
        open={deleting}
        group={group}
        otherGroups={groups.filter((g) => g.id !== group.id)}
        expenseCount={groupExpenses.length}
        onOpenChange={setDeleting}
        onConfirm={handleDeleteGroup}
      />

      <ExpenseForm
        open={!!editingExpense}
        title="Edit expense"
        submitLabel="Save"
        categories={categories}
        groups={groups}
        allowRecurring={false}
        initialValue={
          editingExpense
            ? {
                name: editingExpense.name,
                amount: editingExpense.amount,
                date: editingExpense.date,
                categoryId: editingExpense.categoryId,
                groupId: editingExpense.groupId,
              }
            : undefined
        }
        onOpenChange={(open) => !open && setEditingExpense(null)}
        onSubmit={handleUpdateExpense}
      />

      <AlertDialog
        open={!!deletingExpense}
        onOpenChange={(open) => !open && setDeletingExpense(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete expense?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove &quot;{deletingExpense?.name}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteExpense}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GroupDetail;
