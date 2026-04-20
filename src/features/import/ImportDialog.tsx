import { Plus, Undo2 } from "lucide-react";
import Papa from "papaparse";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { DEFAULT_AUTO_ICON, pickNextColor } from "../../lib/categoryDefaults";
import type { Category } from "../../types/expense";
import { ImportedRow, parseImportedRow } from "./validators";

export interface CategorySeed {
  name: string;
  color: string;
  icon: string;
}

interface ImportDialogProps {
  open: boolean;
  categories: Category[];
  onOpenChange: (open: boolean) => void;
  onImport: (
    rows: Array<{
      name: string;
      amount: number;
      date: string;
      categoryId: string;
    }>
  ) => Promise<void> | void;
  onCreateCategories?: (
    seeds: Array<{ csvName: string; seed: CategorySeed }>
  ) => Promise<Record<string, string>>;
}

type Step = "pick" | "review";

interface PendingCreate {
  csvName: string;
  name: string;
  color: string;
  icon: string;
}

const ImportDialog = ({
  open,
  categories,
  onOpenChange,
  onImport,
  onCreateCategories,
}: ImportDialogProps) => {
  const [step, setStep] = useState<Step>("pick");
  const [rows, setRows] = useState<ImportedRow[]>([]);
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
  const [pendingCreates, setPendingCreates] = useState<PendingCreate[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setStep("pick");
    setRows([]);
    setCategoryMap({});
    setPendingCreates([]);
  };

  const handleFile = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const parsed = result.data.map((raw, i) =>
          parseImportedRow(i + 1, raw as Record<string, string>)
        );
        setRows(parsed);

        const initialMap: Record<string, string> = {};
        const names = new Set<string>();
        for (const row of parsed) {
          if (row.parsed) names.add(row.parsed.category);
        }
        for (const name of names) {
          const match = categories.find(
            (c) => c.name.toLowerCase() === name.toLowerCase()
          );
          if (match) initialMap[name] = match.id;
        }
        setCategoryMap(initialMap);
        setPendingCreates([]);
        setStep("review");
      },
      error: (error) => {
        toast.error(`CSV parse failed: ${error.message}`);
      },
    });
  };

  const uniqueCategoryNames = useMemo(() => {
    const names = new Set<string>();
    for (const row of rows) if (row.parsed) names.add(row.parsed.category);
    return Array.from(names);
  }, [rows]);

  const pendingByName = useMemo(
    () => new Map(pendingCreates.map((p) => [p.csvName, p])),
    [pendingCreates]
  );

  const unmappedNames = uniqueCategoryNames.filter(
    (n) => !categoryMap[n] && !pendingByName.has(n)
  );
  const invalidCount = rows.filter((r) => r.error).length;
  const validCount = rows.filter((r) => r.parsed).length;
  const canConfirm =
    validCount > 0 &&
    unmappedNames.length === 0 &&
    !submitting &&
    (pendingCreates.length === 0 || !!onCreateCategories);

  const createPending = (csvName: string) => {
    setPendingCreates((prev) => {
      if (prev.some((p) => p.csvName === csvName)) return prev;
      const used = [
        ...categories.map((c) => c.color),
        ...prev.map((p) => p.color),
      ];
      const color = pickNextColor(used);
      return [
        ...prev,
        { csvName, name: csvName, color, icon: DEFAULT_AUTO_ICON },
      ];
    });
  };

  const createAllPending = () => {
    setPendingCreates((prev) => {
      const existing = new Set(prev.map((p) => p.csvName));
      const used = [
        ...categories.map((c) => c.color),
        ...prev.map((p) => p.color),
      ];
      const additions: PendingCreate[] = [];
      for (const name of unmappedNames) {
        if (existing.has(name)) continue;
        const color = pickNextColor([...used, ...additions.map((a) => a.color)]);
        additions.push({
          csvName: name,
          name,
          color,
          icon: DEFAULT_AUTO_ICON,
        });
      }
      return [...prev, ...additions];
    });
  };

  const undoPending = (csvName: string) => {
    setPendingCreates((prev) => prev.filter((p) => p.csvName !== csvName));
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      let resolvedMap = { ...categoryMap };
      let createdCount = 0;

      if (pendingCreates.length > 0) {
        if (!onCreateCategories) {
          throw new Error("Category creation is not available");
        }
        const nameToId = await onCreateCategories(
          pendingCreates.map((p) => ({
            csvName: p.csvName,
            seed: { name: p.name, color: p.color, icon: p.icon },
          }))
        );
        resolvedMap = { ...resolvedMap, ...nameToId };
        createdCount = pendingCreates.length;
      }

      const payload = rows
        .map((r) => r.parsed)
        .filter((p): p is NonNullable<typeof p> => !!p)
        .map((p) => ({
          name: p.name,
          amount: p.amount,
          date: p.date,
          categoryId: resolvedMap[p.category],
        }));
      await onImport(payload);

      if (createdCount > 0) {
        toast.success(
          `Imported ${payload.length} expense(s), created ${createdCount} categor${createdCount === 1 ? "y" : "ies"}`
        );
      } else {
        toast.success(`Imported ${payload.length} expense(s)`);
      }
      onOpenChange(false);
      reset();
    } catch (err) {
      toast.error(
        `Import failed: ${err instanceof Error ? err.message : "unknown"}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) reset();
      }}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import expenses</DialogTitle>
          <DialogDescription>
            CSV with columns{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              name, amount, date, category
            </code>
            . Dates in{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              YYYY-MM-DD
            </code>
            .
          </DialogDescription>
        </DialogHeader>

        {step === "pick" && (
          <div className="space-y-3">
            <Label htmlFor="import-file">Choose CSV file</Label>
            <Input
              id="import-file"
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </div>
        )}

        {step === "review" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="text-emerald-600">
                {validCount} valid row{validCount === 1 ? "" : "s"}
              </span>
              {invalidCount > 0 && (
                <span className="text-destructive">
                  {invalidCount} invalid row{invalidCount === 1 ? "" : "s"}
                </span>
              )}
              {unmappedNames.length > 0 && (
                <span className="text-amber-600">
                  {unmappedNames.length} unmapped categor
                  {unmappedNames.length === 1 ? "y" : "ies"}
                </span>
              )}
              {pendingCreates.length > 0 && (
                <span className="text-primary">
                  {pendingCreates.length} will be created
                </span>
              )}
            </div>

            {uniqueCategoryNames.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <Label>Category mapping</Label>
                  {unmappedNames.length >= 2 && onCreateCategories && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={createAllPending}
                    >
                      <Plus className="h-3.5 w-3.5" /> Create all (
                      {unmappedNames.length})
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  {uniqueCategoryNames.map((name) => {
                    const pending = pendingByName.get(name);
                    if (pending) {
                      return (
                        <div key={name} className="flex items-center gap-3">
                          <span className="flex-1 text-sm font-medium truncate">
                            {name}
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground">
                            <span
                              className="h-2.5 w-2.5 rounded-[2px] shrink-0"
                              style={{ backgroundColor: pending.color }}
                            />
                            Will create: {pending.name}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => undoPending(name)}
                            aria-label={`Undo create ${name}`}
                          >
                            <Undo2 className="h-3.5 w-3.5" /> Undo
                          </Button>
                        </div>
                      );
                    }
                    return (
                      <div key={name} className="flex items-center gap-3">
                        <span className="flex-1 text-sm font-medium truncate">
                          {name}
                        </span>
                        <Select
                          value={categoryMap[name] ?? ""}
                          onValueChange={(v) =>
                            setCategoryMap((m) => ({ ...m, [name]: v }))
                          }
                        >
                          <SelectTrigger className="w-48">
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
                        {onCreateCategories && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => createPending(name)}
                          >
                            <Plus className="h-3.5 w-3.5" /> Create
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {invalidCount > 0 && (
              <div className="space-y-1 text-xs text-muted-foreground max-h-40 overflow-y-auto rounded-md border border-border p-2">
                {rows
                  .filter((r) => r.error)
                  .slice(0, 50)
                  .map((r) => (
                    <div key={r.index}>
                      <span className="font-mono">Row {r.index}:</span>{" "}
                      <span className="text-destructive">{r.error}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              onOpenChange(false);
              reset();
            }}
          >
            Cancel
          </Button>
          {step === "review" && (
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={!canConfirm}
            >
              Import {validCount} expense{validCount === 1 ? "" : "s"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportDialog;
