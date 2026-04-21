import readXlsxFile from "read-excel-file/browser";

type Cell = string | number | boolean | Date | null;

const toCell = (value: Cell): string => {
  if (value == null) return "";
  if (value instanceof Date) {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, "0");
    const d = String(value.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return String(value);
};

export async function parseXlsxFile(
  file: File
): Promise<Record<string, string>[]> {
  const rows = (await readXlsxFile(file)) as unknown as Cell[][];
  if (rows.length === 0) return [];
  const [headerRow, ...dataRows] = rows;
  const headers = headerRow.map((h) => toCell(h).trim());
  return dataRows
    .map((row) => {
      const record: Record<string, string> = {};
      headers.forEach((key, i) => {
        if (!key) return;
        record[key] = toCell(row[i] ?? null);
      });
      return record;
    })
    .filter((r) => Object.values(r).some((v) => v.trim() !== ""));
}
