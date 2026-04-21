import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Category } from "@/types/expense";
import ImportDialog from "./ImportDialog";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

vi.mock("papaparse", () => ({
  default: {
    parse: (
      _file: File,
      opts: { complete: (r: { data: unknown[] }) => void }
    ) => {
      opts.complete({
        data: [
          { name: "Coffee", amount: "4.5", date: "2026-04-19", category: "Food" },
          { name: "Gas", amount: "80", date: "2026-04-18", category: "Fuel" },
        ],
      });
    },
  },
}));

const ts = { seconds: 0, nanoseconds: 0 } as unknown as Category["createdAt"];
const cat = (id: string, name: string, color: string): Category => ({
  id,
  name,
  color,
  icon: "Package",
  order: 0,
  createdAt: ts,
});

const triggerParse = async () => {
  const file = new File(["x"], "test.csv", { type: "text/csv" });
  const input = document.getElementById("import-file") as HTMLInputElement;
  Object.defineProperty(input, "files", { value: [file] });
  fireEvent.change(input);
  await waitFor(() =>
    expect(screen.getByLabelText(/Expense 1 name/i)).toBeInTheDocument()
  );
};

describe("ImportDialog — review table", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders editable rows after parsing a CSV", async () => {
    render(
      <ImportDialog
        open
        categories={[cat("a", "Food", "#eab308")]}
        onOpenChange={() => {}}
        onImport={vi.fn()}
        onCreateCategories={vi.fn()}
      />
    );
    await triggerParse();

    const nameInput1 = screen.getByLabelText(/Expense 1 name/i) as HTMLInputElement;
    const nameInput2 = screen.getByLabelText(/Expense 2 name/i) as HTMLInputElement;
    expect(nameInput1.value).toBe("Coffee");
    expect(nameInput2.value).toBe("Gas");
  });

  it("disables import while any row is missing a category", async () => {
    render(
      <ImportDialog
        open
        categories={[cat("a", "Food", "#eab308")]}
        onOpenChange={() => {}}
        onImport={vi.fn()}
        onCreateCategories={vi.fn()}
      />
    );
    await triggerParse();

    expect(screen.getByText(/1 missing category/i)).toBeInTheDocument();
    const importBtn = screen.getByRole("button", { name: /Import \d+ expense/i });
    expect(importBtn).toBeDisabled();
  });

  it("deleting a row removes it from the table", async () => {
    render(
      <ImportDialog
        open
        categories={[cat("a", "Food", "#eab308")]}
        onOpenChange={() => {}}
        onImport={vi.fn()}
        onCreateCategories={vi.fn()}
      />
    );
    await triggerParse();

    fireEvent.click(screen.getByRole("button", { name: /Remove expense 2/i }));
    expect(screen.queryByLabelText(/Expense 2 name/i)).not.toBeInTheDocument();
  });

  it("imports with resolved ids when every row matches an existing category", async () => {
    const onImport = vi.fn().mockResolvedValue(undefined);
    render(
      <ImportDialog
        open
        categories={[
          cat("food-id", "Food", "#eab308"),
          cat("fuel-id", "Fuel", "#22c55e"),
        ]}
        onOpenChange={() => {}}
        onImport={onImport}
        onCreateCategories={vi.fn()}
      />
    );
    await triggerParse();

    expect(screen.getByText(/2 ready/i)).toBeInTheDocument();
    const importBtn = screen.getByRole("button", {
      name: /Import 2 expenses/i,
    });
    expect(importBtn).not.toBeDisabled();
    fireEvent.click(importBtn);

    await waitFor(() => expect(onImport).toHaveBeenCalledTimes(1));
    const payload = onImport.mock.calls[0][0];
    expect(payload).toHaveLength(2);
    expect(payload[0]).toMatchObject({
      name: "Coffee",
      amount: 4.5,
      date: "2026-04-19",
      categoryId: "food-id",
    });
    expect(payload[1]).toMatchObject({
      name: "Gas",
      amount: 80,
      date: "2026-04-18",
      categoryId: "fuel-id",
    });
  });

  it("editing a row updates the imported payload", async () => {
    const onImport = vi.fn().mockResolvedValue(undefined);
    render(
      <ImportDialog
        open
        categories={[
          cat("food-id", "Food", "#eab308"),
          cat("fuel-id", "Fuel", "#22c55e"),
        ]}
        onOpenChange={() => {}}
        onImport={onImport}
        onCreateCategories={vi.fn()}
      />
    );
    await triggerParse();

    const nameInput1 = screen.getByLabelText(/Expense 1 name/i) as HTMLInputElement;
    fireEvent.change(nameInput1, { target: { value: "Breakfast coffee" } });

    fireEvent.click(
      screen.getByRole("button", { name: /Import 2 expenses/i })
    );

    await waitFor(() => expect(onImport).toHaveBeenCalledTimes(1));
    const payload = onImport.mock.calls[0][0];
    expect(payload[0].name).toBe("Breakfast coffee");
  });
});
