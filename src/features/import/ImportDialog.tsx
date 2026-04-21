import { FileSpreadsheet, Loader2, Sparkles, X } from "lucide-react";
import Papa from "papaparse";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  extractExpensesFromFiles,
  type ExtractedExpense,
} from "../../services/ai";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { DEFAULT_AUTO_ICON, pickNextColor } from "../../lib/categoryDefaults";
import { cn } from "../../lib/utils";
import type { Category } from "../../types/expense";
import ReviewTable, {
  type CategoryRef,
  type PendingCategory,
  type ReviewRow,
} from "./ReviewTable";
import { importedRowSchema, parseImportedRow } from "./validators";
import { parseXlsxFile } from "./xlsx";

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
type Mode = "csv" | "ai";

const MAX_AI_FILE_BYTES = 20 * 1024 * 1024;

const validateRow = (r: ReviewRow): string | undefined => {
  const result = importedRowSchema.safeParse({
    name: r.name,
    amount: r.amount,
    date: r.date,
    category: r.suggestedName ?? "placeholder",
  });
  if (result.success) return undefined;
  const firstIssue = result.error.issues.find(
    (i) => i.path[0] !== "category"
  );
  if (!firstIssue) return undefined;
  return `${firstIssue.path.join(".")}: ${firstIssue.message}`;
};

const buildReviewRow = (raw: Record<string, string>, categories: Category[]): ReviewRow => {
  const parsed = parseImportedRow(0, raw);
  if (!parsed.parsed) {
    return {
      name: raw.name ?? raw.Name ?? "",
      amount: Number(raw.amount ?? raw.Amount ?? 0) || 0,
      date: raw.date ?? raw.Date ?? "",
      suggestedName: (raw.category ?? raw.Category ?? "").trim() || undefined,
      category: null,
      error: parsed.error,
    };
  }
  const p = parsed.parsed;
  const match = categories.find(
    (c) => c.name.toLowerCase() === p.category.toLowerCase()
  );
  return {
    name: p.name,
    amount: p.amount,
    date: p.date,
    suggestedName: p.category,
    category: match ? { kind: "existing", id: match.id } : null,
  };
};

const buildReviewRowFromAi = (
  e: ExtractedExpense,
  categories: Category[]
): ReviewRow => {
  const match = categories.find(
    (c) => c.name.toLowerCase() === e.category.toLowerCase()
  );
  const row: ReviewRow = {
    name: e.name,
    amount: e.amount,
    date: e.date,
    suggestedName: e.category,
    category: match ? { kind: "existing", id: match.id } : null,
  };
  row.error = validateRow(row);
  return row;
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const ImportDialog = ({
  open,
  categories,
  onOpenChange,
  onImport,
  onCreateCategories,
}: ImportDialogProps) => {
  const [step, setStep] = useState<Step>("pick");
  const [mode, setMode] = useState<Mode>("csv");
  const [rows, setRows] = useState<ReviewRow[]>([]);
  const [pending, setPending] = useState<PendingCategory[]>([]);
  const [aiFiles, setAiFiles] = useState<File[]>([]);
  const [aiProgress, setAiProgress] = useState<{
    done: number;
    total: number;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setStep("pick");
    setMode("csv");
    setRows([]);
    setPending([]);
    setAiFiles([]);
    setAiProgress(null);
    setSubmitting(false);
  };

  const seedReview = (next: ReviewRow[]) => {
    setRows(next);
    setPending([]);
    setStep("review");
  };

  const handleManualFile = async (file: File) => {
    const ext = file.name.toLowerCase().split(".").pop();
    try {
      let raw: Record<string, string>[];
      if (ext === "xlsx" || ext === "xls") {
        raw = await parseXlsxFile(file);
      } else {
        raw = await new Promise<Record<string, string>[]>((resolve, reject) => {
          Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => resolve(result.data as Record<string, string>[]),
            error: reject,
          });
        });
      }
      const reviewRows = raw.map((r) => buildReviewRow(r, categories));
      reviewRows.forEach((r) => {
        r.error = validateRow(r);
      });
      seedReview(reviewRows);
    } catch (err) {
      toast.error(
        `Failed to read file: ${err instanceof Error ? err.message : "unknown error"}`
      );
    }
  };

  const handleAiFilesPicked = (files: FileList) => {
    const incoming = Array.from(files);
    const oversized = incoming.filter((f) => f.size > MAX_AI_FILE_BYTES);
    if (oversized.length > 0) {
      toast.error(
        `File too large (20 MB limit): ${oversized.map((f) => f.name).join(", ")}`
      );
    }
    const accepted = incoming.filter((f) => f.size <= MAX_AI_FILE_BYTES);
    setAiFiles((prev) => {
      const seen = new Set(prev.map((f) => f.name + f.size));
      const deduped = accepted.filter((f) => !seen.has(f.name + f.size));
      return [...prev, ...deduped];
    });
  };

  const removeAiFile = (index: number) => {
    setAiFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const processAiFiles = async () => {
    if (aiFiles.length === 0) return;
    setAiProgress({ done: 0, total: aiFiles.length });
    try {
      const { expenses, failures } = await extractExpensesFromFiles(
        aiFiles,
        categories,
        (done, total) => setAiProgress({ done, total })
      );
      if (expenses.length === 0) {
        toast.error(
          failures.length > 0
            ? `All files failed: ${failures.map((f) => f.file).join(", ")}`
            : "No expenses found."
        );
        return;
      }
      const reviewRows = expenses.map((e) => buildReviewRowFromAi(e, categories));
      seedReview(reviewRows);
      if (failures.length > 0) {
        toast.warning(
          `AI extracted ${expenses.length} expense(s). ${failures.length} file(s) failed: ${failures.map((f) => f.file).join(", ")}`
        );
      } else {
        toast.success(`AI found ${expenses.length} expense(s)`);
      }
    } catch (err) {
      toast.error(
        `Extraction failed: ${err instanceof Error ? err.message : "unknown error"}`
      );
    } finally {
      setAiProgress(null);
    }
  };

  const handleRowChange = (index: number, patch: Partial<ReviewRow>) => {
    setRows((prev) =>
      prev.map((r, i) => {
        if (i !== index) return r;
        const next: ReviewRow = { ...r, ...patch };
        next.error = validateRow(next);
        return next;
      })
    );
  };

  const handleRowDelete = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreatePending = (suggestedName: string) => {
    const key = suggestedName.trim();
    if (!key) return;

    setPending((prev) => {
      const lower = key.toLowerCase();
      if (prev.some((p) => p.key.toLowerCase() === lower)) return prev;
      const used = [
        ...categories.map((c) => c.color),
        ...prev.map((p) => p.color),
      ];
      return [
        ...prev,
        {
          key,
          name: key,
          color: pickNextColor(used),
          icon: DEFAULT_AUTO_ICON,
        },
      ];
    });

    setRows((prev) =>
      prev.map((r) => {
        if (
          r.suggestedName &&
          r.suggestedName.toLowerCase() === key.toLowerCase() &&
          (!r.category || r.category.kind !== "existing")
        ) {
          const ref: CategoryRef = { kind: "pending", key };
          return { ...r, category: ref };
        }
        return r;
      })
    );
  };

  const validCount = rows.filter((r) => !r.error && r.category).length;
  const invalidCount = rows.filter((r) => r.error).length;
  const unresolvedCount = rows.filter((r) => !r.error && !r.category).length;

  const canConfirm = useMemo(
    () =>
      rows.length > 0 &&
      invalidCount === 0 &&
      unresolvedCount === 0 &&
      !submitting &&
      (pending.length === 0 || !!onCreateCategories),
    [rows.length, invalidCount, unresolvedCount, submitting, pending.length, onCreateCategories]
  );

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      let pendingNameToId: Record<string, string> = {};
      if (pending.length > 0) {
        if (!onCreateCategories) {
          throw new Error("Category creation unavailable");
        }
        pendingNameToId = await onCreateCategories(
          pending.map((p) => ({
            csvName: p.key,
            seed: { name: p.name, color: p.color, icon: p.icon },
          }))
        );
      }

      const payload = rows.flatMap((r) => {
        if (r.error || !r.category) return [];
        const categoryId =
          r.category.kind === "existing"
            ? r.category.id
            : pendingNameToId[r.category.key];
        if (!categoryId) return [];
        return [
          { name: r.name.trim(), amount: r.amount, date: r.date, categoryId },
        ];
      });

      await onImport(payload);

      if (pending.length > 0) {
        toast.success(
          `Imported ${payload.length} expense(s), created ${pending.length} categor${pending.length === 1 ? "y" : "ies"}`
        );
      } else {
        toast.success(`Imported ${payload.length} expense(s)`);
      }
      onOpenChange(false);
      reset();
    } catch (err) {
      toast.error(
        `Import failed: ${err instanceof Error ? err.message : "unknown error"}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const aiProcessing = aiProgress !== null;

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) reset();
      }}
    >
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {step === "review" ? "Review expenses" : "Import expenses"}
          </DialogTitle>
          <DialogDescription>
            {step === "review"
              ? "Review and edit rows before saving. You can change categories, adjust values, or remove rows."
              : mode === "csv"
                ? "CSV or Excel with name, amount, date, category columns."
                : "Powered by AI — PDF, image, CSV, or a photo of your invoice."}
          </DialogDescription>
        </DialogHeader>

        {step === "pick" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode("csv")}
                className={cn(
                  "flex items-start gap-3 rounded-md border p-3 text-left transition",
                  mode === "csv"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/50"
                )}
              >
                <FileSpreadsheet className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <div className="text-sm font-medium">CSV or Excel</div>
                  <div className="text-xs text-muted-foreground">
                    Structured columns
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setMode("ai")}
                className={cn(
                  "relative flex items-start gap-3 rounded-md border p-3 text-left transition",
                  mode === "ai"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/50"
                )}
              >
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-violet-500" />
                <div className="min-w-0">
                  <div className="text-sm font-medium">Smart import</div>
                  <div className="text-xs text-muted-foreground">
                    Powered by AI — PDF, image, or CSV
                  </div>
                </div>
              </button>
            </div>

            {mode === "csv" && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="import-file">Choose file</Label>
                  <Input
                    id="import-file"
                    type="file"
                    accept=".csv,.xlsx,.xls,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    className="cursor-pointer file:cursor-pointer hover:bg-muted/50 file:hover:bg-muted/80"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleManualFile(f);
                    }}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="text-xs font-medium text-muted-foreground">
                    Sample format
                  </div>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="h-9">name</TableHead>
                          <TableHead className="h-9">amount</TableHead>
                          <TableHead className="h-9">date</TableHead>
                          <TableHead className="h-9">category</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="py-1.5 text-xs">Coffee</TableCell>
                          <TableCell className="py-1.5 text-xs tabular-nums">
                            4.50
                          </TableCell>
                          <TableCell className="py-1.5 text-xs tabular-nums">
                            2026-04-19
                          </TableCell>
                          <TableCell className="py-1.5 text-xs">Food</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="py-1.5 text-xs">Uber</TableCell>
                          <TableCell className="py-1.5 text-xs tabular-nums">
                            18.00
                          </TableCell>
                          <TableCell className="py-1.5 text-xs tabular-nums">
                            2026-04-18
                          </TableCell>
                          <TableCell className="py-1.5 text-xs">
                            Transport
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Dates in <code className="rounded bg-muted px-1">YYYY-MM-DD</code>
                    , amounts with decimal point. New categories can be created
                    during review.
                  </p>
                </div>
              </div>
            )}

            {mode === "ai" && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="import-ai-file">
                    Invoices (PDF, image, or CSV)
                  </Label>
                  <Input
                    id="import-ai-file"
                    type="file"
                    multiple
                    accept=".pdf,.csv,.txt,application/pdf,text/csv,text/plain,image/*"
                    disabled={aiProcessing}
                    className="cursor-pointer file:cursor-pointer hover:bg-muted/50 file:hover:bg-muted/80 disabled:cursor-not-allowed"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleAiFilesPicked(e.target.files);
                      }
                      e.target.value = "";
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Up to 20 MB per file. Attach multiple invoices and AI
                    aggregates everything into one review list.
                  </p>
                </div>

                {aiFiles.length > 0 && (
                  <div className="space-y-1.5 rounded-md border p-2">
                    {aiFiles.map((f, i) => (
                      <div
                        key={`${f.name}-${i}`}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className="flex-1 truncate">{f.name}</span>
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {formatFileSize(f.size)}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => removeAiFile(i)}
                          disabled={aiProcessing}
                          aria-label={`Remove ${f.name}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {aiProgress && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Reading files… {aiProgress.done}/{aiProgress.total}
                  </div>
                )}

                <Button
                  type="button"
                  onClick={processAiFiles}
                  disabled={aiFiles.length === 0 || aiProcessing}
                >
                  {aiProcessing
                    ? "Processing…"
                    : `Process ${aiFiles.length || ""} file${aiFiles.length === 1 ? "" : "s"}`.trim()}
                </Button>
              </div>
            )}
          </div>
        )}

        {step === "review" && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="text-emerald-600">
                {validCount} ready
              </span>
              {invalidCount > 0 && (
                <span className="text-destructive">
                  {invalidCount} invalid
                </span>
              )}
              {unresolvedCount > 0 && (
                <span className="text-amber-600">
                  {unresolvedCount} missing category
                </span>
              )}
              {pending.length > 0 && (
                <span className="text-primary">
                  {pending.length} new categor{pending.length === 1 ? "y" : "ies"}
                </span>
              )}
            </div>

            <div className="max-h-[60vh] overflow-auto">
              <ReviewTable
                rows={rows}
                categories={categories}
                pending={pending}
                onChange={handleRowChange}
                onDelete={handleRowDelete}
                onCreatePending={handleCreatePending}
              />
            </div>
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
