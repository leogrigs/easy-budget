import { Schema } from "firebase/ai";
import { z } from "zod";
import { importedRowSchema } from "../features/import/validators";
import { aiModel } from "./firebase";
import type { Category } from "../types/expense";

export interface ExtractedExpense {
  name: string;
  amount: number;
  date: string;
  category: string;
}

const MAX_BYTES = 20 * 1024 * 1024;

const SUPPORTED_MIME_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/heic",
  "image/heif",
  "text/csv",
  "text/plain",
]);

const EXTENSION_MIME_MAP: Record<string, string> = {
  pdf: "application/pdf",
  csv: "text/csv",
  txt: "text/plain",
  tsv: "text/csv",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  heic: "image/heic",
  heif: "image/heif",
};

const inferMimeType = (file: File): string => {
  if (file.type && SUPPORTED_MIME_TYPES.has(file.type)) return file.type;
  const ext = file.name.toLowerCase().split(".").pop() ?? "";
  return EXTENSION_MIME_MAP[ext] ?? file.type ?? "";
};

const responseSchema = Schema.array({
  items: Schema.object({
    properties: {
      name: Schema.string({
        description: "Descrição curta e legível da despesa (max 120 chars).",
      }),
      amount: Schema.number({
        description: "Valor positivo em reais. Ignorar sinal de débito/crédito.",
      }),
      date: Schema.string({
        description:
          "Data da transação no formato YYYY-MM-DD. Se a fatura tiver apenas mês/ano, usar o dia da transação individual quando disponível.",
      }),
      category: Schema.string({
        description:
          "Nome da categoria que melhor descreve a despesa. Preferir nomes da lista fornecida; criar um nome novo apenas se nenhum encaixar.",
      }),
    },
  }),
});

const extractedSchema = z.array(importedRowSchema);

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Failed to read file"));
        return;
      }
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });

const buildPrompt = (categories: Category[]): string => {
  const list = categories.map((c) => `- ${c.name}`).join("\n");
  return `You are extracting expenses from a card invoice, bank statement, or transaction export.
The file may be a PDF, an image, or a CSV/text file (which might have non-standard columns).

Mandatory rules:
1. Return only expenses (debits). Ignore invoice payments, refunds, credits, prior balance, reversed interest, and total lines.
2. Amount is always positive, in the document's currency (typically Brazilian Reais).
3. Date must be in YYYY-MM-DD format. If the transaction shows only day/month, infer the year from the statement period.
4. Name must be short and readable (up to 120 characters). Strip card numbers, "BR", authorization codes, and redundant installment markers like "1/12" when they clutter the label.
5. Category: pick the closest match from the user's list below. If none fits, suggest a short new name (match the language used in existing categories — Portuguese if the list is in Portuguese, English otherwise).

User's existing categories:
${list || "(none yet — suggest concise new names)"}

Respond with JSON only, matching the agreed schema.`;
};

const trimDate = (value: string): string =>
  value.length >= 10 ? value.slice(0, 10) : value;

export async function extractExpensesFromDocument(
  file: File,
  categories: Category[],
): Promise<ExtractedExpense[]> {
  if (file.size > MAX_BYTES) {
    throw new Error("File too large (20 MB limit).");
  }
  const mimeType = inferMimeType(file);
  if (!SUPPORTED_MIME_TYPES.has(mimeType)) {
    throw new Error(`Unsupported file type: ${mimeType || "unknown"}`);
  }

  const base64 = await fileToBase64(file);

  const result = await aiModel.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          { inlineData: { mimeType, data: base64 } },
          { text: buildPrompt(categories) },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  const text = result.response.text();
  if (!text) {
    throw new Error("Empty response from model.");
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(text);
  } catch {
    throw new Error("Model response is not valid JSON.");
  }

  const validation = extractedSchema.safeParse(parsedJson);
  if (!validation.success) {
    throw new Error("Model response did not match expected format.");
  }

  return validation.data.map((row) => ({
    name: row.name.trim(),
    amount: Math.abs(row.amount),
    date: trimDate(row.date),
    category: row.category.trim(),
  }));
}

export interface ExtractionResult {
  expenses: ExtractedExpense[];
  failures: Array<{ file: string; error: string }>;
}

export async function extractExpensesFromFiles(
  files: File[],
  categories: Category[],
  onProgress?: (done: number, total: number) => void,
): Promise<ExtractionResult> {
  const total = files.length;
  let done = 0;
  const settled = await Promise.all(
    files.map(async (file) => {
      try {
        const expenses = await extractExpensesFromDocument(file, categories);
        return { ok: true as const, file, expenses };
      } catch (err) {
        return {
          ok: false as const,
          file,
          error: err instanceof Error ? err.message : "unknown error",
        };
      } finally {
        done += 1;
        onProgress?.(done, total);
      }
    }),
  );

  const expenses: ExtractedExpense[] = [];
  const failures: ExtractionResult["failures"] = [];
  for (const result of settled) {
    if (result.ok) expenses.push(...result.expenses);
    else failures.push({ file: result.file.name, error: result.error });
  }
  return { expenses, failures };
}
