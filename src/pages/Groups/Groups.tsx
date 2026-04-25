import { Pencil, Plus, Trash2, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import DeleteGroupDialog, {
  type DeleteGroupAction,
} from "../../components/DeleteGroupDialog";
import GroupForm, {
  type GroupFormValues,
} from "../../components/GroupForm";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { useExpenses } from "../../hooks/useExpenses";
import { useGroups } from "../../hooks/useGroups";
import {
  addGroup,
  deleteGroupWithExpenses,
  updateGroup,
} from "../../services/groups";
import type { Group } from "../../types/expense";

interface GroupsProps {
  uid: string;
}

const Groups = ({ uid }: GroupsProps) => {
  const { groups, loading } = useGroups(uid);
  const { expenses } = useExpenses(uid);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Group | null>(null);
  const [deleting, setDeleting] = useState<Group | null>(null);

  const expenseCountByGroup = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of expenses) {
      if (!e.groupId) continue;
      map.set(e.groupId, (map.get(e.groupId) ?? 0) + 1);
    }
    return map;
  }, [expenses]);

  const nextOrder = useMemo(
    () =>
      groups.reduce((max, g) => (g.order > max ? g.order : max), -1) + 1,
    [groups]
  );

  const handleCreate = async (values: GroupFormValues) => {
    await addGroup(uid, { ...values, order: nextOrder });
    toast.success(`Created group "${values.name}"`);
  };

  const handleUpdate = async (values: GroupFormValues) => {
    if (!editing) return;
    await updateGroup(uid, editing.id, values);
    toast.success(`Updated group "${values.name}"`);
  };

  const handleDelete = async (args: DeleteGroupAction) => {
    if (!deleting) return;
    const target = deleting;
    const ids = expenses
      .filter((e) => e.groupId === target.id)
      .map((e) => e.id);
    try {
      await deleteGroupWithExpenses(
        uid,
        target.id,
        ids,
        args.action === "reassign" ? args.reassignToId : null
      );
      toast.success(`Deleted group "${target.name}"`);
      setDeleting(null);
    } catch (error) {
      console.error("[groups] delete failed", error);
      toast.error(`Failed to delete group "${target.name}"`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Groups</h1>
          <p className="text-sm text-muted-foreground">
            Bundle expenses by occasion — a trip, an event, or any shared
            purpose.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          New group
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center space-y-3">
            <p className="text-muted-foreground">No groups yet.</p>
            <Button
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4" /> Create your first group
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group, i) => {
            const count = expenseCountByGroup.get(group.id) ?? 0;
            return (
              <Card
                key={group.id}
                className="transition-all hover:border-primary/40 hover:shadow-sm animate-in fade-in-0 slide-in-from-bottom-2 duration-300 fill-mode-both"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 p-4">
                    <Link
                      to={`/groups/${group.id}`}
                      className="flex flex-1 items-center gap-4 min-w-0"
                      aria-label={`Open ${group.name}`}
                    >
                      <div className="h-12 w-12 shrink-0 rounded-lg bg-muted text-muted-foreground flex items-center justify-center">
                        <Users className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {group.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {count === 0
                            ? "No expenses"
                            : `${count} expense${count === 1 ? "" : "s"}`}
                        </div>
                      </div>
                    </Link>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setEditing(group);
                          setFormOpen(true);
                        }}
                        aria-label={`Edit ${group.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDeleting(group);
                        }}
                        aria-label={`Delete ${group.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <GroupForm
        open={formOpen}
        title={editing ? "Edit group" : "New group"}
        submitLabel={editing ? "Save" : "Create"}
        initialValue={editing ? { name: editing.name } : undefined}
        onOpenChange={setFormOpen}
        onSubmit={editing ? handleUpdate : handleCreate}
      />

      <DeleteGroupDialog
        open={!!deleting}
        group={deleting}
        otherGroups={groups.filter((g) => g.id !== deleting?.id)}
        expenseCount={
          deleting ? expenseCountByGroup.get(deleting.id) ?? 0 : 0
        }
        onOpenChange={(open) => !open && setDeleting(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Groups;
