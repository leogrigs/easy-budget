import { z } from "zod";

const rawSchema = z.object({
  name: z.string().trim().min(1).max(120),
  amount: z.coerce.number().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  category: z.string().trim().min(1),
});

export type ImportedRaw = z.infer<typeof rawSchema>;

export interface ImportedRow {
  index: number;
  raw: Record<string, string>;
  parsed?: ImportedRaw;
  error?: string;
}

export const parseImportedRow = (
  index: number,
  raw: Record<string, string>
): ImportedRow => {
  const normalized = {
    name: raw.name ?? raw.Name ?? raw.description ?? "",
    amount: raw.amount ?? raw.Amount ?? raw.price ?? raw.Price ?? "",
    date: raw.date ?? raw.Date ?? "",
    category: raw.category ?? raw.Category ?? "",
  };
  const result = rawSchema.safeParse(normalized);
  if (!result.success) {
    return {
      index,
      raw,
      error: result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; "),
    };
  }
  return { index, raw, parsed: result.data };
};
