import { Pencil, Repeat, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import CategoryBadge from "../../components/CategoryBadge";
import RecurringForm, {
  RecurringFormValues,
} from "../../components/RecurringForm";
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
import { useCategories } from "../../hooks/useCategories";
import { useRecurring } from "../../hooks/useRecurring";
import {
  deleteRecurring,
  updateRecurring,
} from "../../services/recurring";
import type { Recurring } from "../../types/expense";

interface SettingsProps {
  uid: string;
}

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const Settings = ({ uid }: SettingsProps) => {
  const { categories, byId } = useCategories(uid);
  const { recurring, loading } = useRecurring(uid);

  const [editing, setEditing] = useState<Recurring | null>(null);
  const [deleting, setDeleting] = useState<Recurring | null>(null);

  const handleUpdate = async (values: RecurringFormValues) => {
    if (!editing) return;
    await updateRecurring(uid, editing.id, {
      name: values.name,
      amount: values.amount,
      categoryId: values.categoryId,
      frequency: values.frequency,
      startDate: values.startDate,
      endDate: values.endDate || undefined,
    });
    toast.success(`Updated "${values.name}"`);
    setEditing(null);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    await deleteRecurring(uid, deleting.id);
    toast.success(`Deleted recurring "${deleting.name}"`);
    setDeleting(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage recurring expenses and other account settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Repeat className="h-4 w-4" /> Recurring expenses
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <Skeleton className="h-24" />
          ) : recurring.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No recurring expenses yet. Toggle &quot;Recurring&quot; when adding
              an expense and it will show up here.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {recurring.map((r) => (
                <li
                  key={r.id}
                  className="py-3 flex items-center gap-3 flex-wrap"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{r.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                      <span>{currency.format(r.amount)}</span>
                      <span>·</span>
                      <span className="capitalize">{r.frequency}</span>
                      <span>·</span>
                      <span>
                        since {new Date(r.startDate).toLocaleDateString()}
                      </span>
                      {r.endDate && (
                        <>
                          <span>·</span>
                          <span>
                            until {new Date(r.endDate).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <CategoryBadge category={byId.get(r.categoryId)} />
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Edit ${r.name}`}
                      onClick={() => setEditing(r)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Delete ${r.name}`}
                      onClick={() => setDeleting(r)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <RecurringForm
        open={!!editing}
        title="Edit recurring expense"
        submitLabel="Save"
        categories={categories}
        initialValue={
          editing
            ? {
                name: editing.name,
                amount: editing.amount,
                categoryId: editing.categoryId,
                frequency: editing.frequency,
                startDate: editing.startDate,
                endDate: editing.endDate ?? "",
              }
            : undefined
        }
        onOpenChange={(open) => !open && setEditing(null)}
        onSubmit={handleUpdate}
      />

      <AlertDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete recurring expense?</AlertDialogTitle>
            <AlertDialogDescription>
              This stops future occurrences. Past generated expenses are kept.
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
    </div>
  );
};

export default Settings;
