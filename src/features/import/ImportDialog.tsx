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
import type { Category } from "../../types/expense";
import { ImportedRow, parseImportedRow } from "./validators";

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
}

type Step = "pick" | "review";

const ImportDialog = ({
  open,
  categories,
  onOpenChange,
  onImport,
}: ImportDialogProps) => {
  const [step, setStep] = useState<Step>("pick");
  const [rows, setRows] = useState<ImportedRow[]>([]);
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setStep("pick");
    setRows([]);
    setCategoryMap({});
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

  const unmappedNames = uniqueCategoryNames.filter((n) => !categoryMap[n]);
  const invalidCount = rows.filter((r) => r.error).length;
  const validCount = rows.filter((r) => r.parsed).length;
  const canConfirm =
    validCount > 0 && unmappedNames.length === 0 && !submitting;

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const payload = rows
        .map((r) => r.parsed)
        .filter((p): p is NonNullable<typeof p> => !!p)
        .map((p) => ({
          name: p.name,
          amount: p.amount,
          date: p.date,
          categoryId: categoryMap[p.category],
        }));
      await onImport(payload);
      toast.success(`Imported ${payload.length} expense(s)`);
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
            CSV with columns <code>name, amount, date, category</code>. Dates in
            <code>YYYY-MM-DD</code>.
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
            </div>

            {uniqueCategoryNames.length > 0 && (
              <div className="space-y-2">
                <Label>Category mapping</Label>
                <div className="space-y-2">
                  {uniqueCategoryNames.map((name) => (
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
                    </div>
                  ))}
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
