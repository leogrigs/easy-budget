import { Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import CategoryForm, { CategoryFormValues } from "../../components/CategoryForm";
import { CategoryIcon } from "../../components/CategoryIcon";
import DeleteCategoryDialog from "../../components/DeleteCategoryDialog";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { useCategories } from "../../hooks/useCategories";
import { useExpenses } from "../../hooks/useExpenses";
import { contrastingText } from "../../lib/categoryPalette";
import {
  addCategory,
  deleteCategory,
  updateCategory,
} from "../../services/categories";
import { bulkUpdateCategory } from "../../services/expenses";
import type { Category } from "../../types/expense";

interface CategoriesProps {
  uid: string;
}

const Categories = ({ uid }: CategoriesProps) => {
  const { categories, loading } = useCategories(uid);
  const { expenses } = useExpenses(uid);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);

  const expenseCountByCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of expenses) {
      map.set(e.categoryId, (map.get(e.categoryId) ?? 0) + 1);
    }
    return map;
  }, [expenses]);

  const handleCreate = async (values: CategoryFormValues) => {
    await addCategory(uid, { ...values, order: categories.length });
    toast.success(`Created category "${values.name}"`);
  };

  const handleUpdate = async (values: CategoryFormValues) => {
    if (!editing) return;
    await updateCategory(uid, editing.id, values);
    toast.success(`Updated category "${values.name}"`);
  };

  const handleDelete = async ({ reassignToId }: { reassignToId?: string }) => {
    if (!deleting) return;
    if (reassignToId) {
      const ids = expenses
        .filter((e) => e.categoryId === deleting.id)
        .map((e) => e.id);
      await bulkUpdateCategory(uid, ids, reassignToId);
    }
    await deleteCategory(uid, deleting.id);
    toast.success(`Deleted category "${deleting.name}"`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Organize your expenses with categories. Choose a color and icon for
            each one.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          New category
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center space-y-3">
            <p className="text-muted-foreground">No categories yet.</p>
            <Button
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4" /> Create your first category
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category, i) => {
            const count = expenseCountByCategory.get(category.id) ?? 0;
            return (
              <Card
                key={category.id}
                className="transition-all hover:border-primary/40 hover:shadow-sm animate-in fade-in-0 slide-in-from-bottom-2 duration-300 fill-mode-both"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div
                    className="h-12 w-12 shrink-0 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: category.color,
                      color: contrastingText(category.color),
                    }}
                  >
                    <CategoryIcon name={category.icon} className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{category.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {count === 0
                        ? "No expenses"
                        : `${count} expense${count === 1 ? "" : "s"}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditing(category);
                        setFormOpen(true);
                      }}
                      aria-label={`Edit ${category.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setDeleting(category)}
                      aria-label={`Delete ${category.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <CategoryForm
        open={formOpen}
        title={editing ? "Edit category" : "New category"}
        submitLabel={editing ? "Save" : "Create"}
        initialValue={
          editing
            ? {
                name: editing.name,
                color: editing.color,
                icon: editing.icon,
              }
            : undefined
        }
        onOpenChange={setFormOpen}
        onSubmit={editing ? handleUpdate : handleCreate}
      />

      <DeleteCategoryDialog
        open={!!deleting}
        category={deleting}
        otherCategories={categories.filter((c) => c.id !== deleting?.id)}
        expenseCount={
          deleting ? expenseCountByCategory.get(deleting.id) ?? 0 : 0
        }
        onOpenChange={(open) => !open && setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Categories;
