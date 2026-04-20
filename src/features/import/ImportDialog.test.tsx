import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Category } from "@/types/expense";
import ImportDialog from "./ImportDialog";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock("papaparse", () => ({
  default: {
    parse: (_file: File, opts: { complete: (r: { data: unknown[] }) => void }) => {
      opts.complete({
        data: [
          { name: "Coffee", amount: "4.5", date: "2026-04-19", category: "Snacks" },
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
    expect(screen.getByText(/Category mapping/i)).toBeInTheDocument()
  );
};

describe("ImportDialog — auto-create categories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("disables import when categories are unmapped", async () => {
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

    expect(screen.getByText(/2 unmapped categories/i)).toBeInTheDocument();
    const importBtn = screen.getByRole("button", { name: /Import 2 expenses/i });
    expect(importBtn).toBeDisabled();
  });

  it("clicking Create makes a row resolvable", async () => {
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

    const createButtons = screen.getAllByRole("button", { name: /^Create$/i });
    fireEvent.click(createButtons[0]);

    expect(screen.getByText(/Will create: Snacks/i)).toBeInTheDocument();
    expect(screen.getByText(/1 unmapped categor/i)).toBeInTheDocument();
  });

  it("Create all generates pending creates for every unmapped row", async () => {
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

    fireEvent.click(screen.getByRole("button", { name: /Create all \(2\)/i }));

    expect(screen.getByText(/Will create: Snacks/i)).toBeInTheDocument();
    expect(screen.getByText(/Will create: Fuel/i)).toBeInTheDocument();
    expect(screen.getByText(/2 will be created/i)).toBeInTheDocument();
  });

  it("Undo reverts a pending create", async () => {
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

    fireEvent.click(screen.getAllByRole("button", { name: /^Create$/i })[0]);
    expect(screen.getByText(/Will create: Snacks/i)).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: /Undo create Snacks/i })
    );
    expect(screen.queryByText(/Will create: Snacks/i)).not.toBeInTheDocument();
  });

  it("confirm calls onCreateCategories and then onImport with resolved ids", async () => {
    const onImport = vi.fn().mockResolvedValue(undefined);
    const onCreateCategories = vi.fn().mockResolvedValue({
      Snacks: "new-snacks-id",
      Fuel: "new-fuel-id",
    });

    render(
      <ImportDialog
        open
        categories={[cat("a", "Food", "#eab308")]}
        onOpenChange={() => {}}
        onImport={onImport}
        onCreateCategories={onCreateCategories}
      />
    );
    await triggerParse();

    fireEvent.click(screen.getByRole("button", { name: /Create all \(2\)/i }));
    fireEvent.click(
      screen.getByRole("button", { name: /Import 2 expenses/i })
    );

    await waitFor(() =>
      expect(onCreateCategories).toHaveBeenCalledWith([
        expect.objectContaining({
          csvName: "Snacks",
          seed: expect.objectContaining({ name: "Snacks", icon: "Package" }),
        }),
        expect.objectContaining({
          csvName: "Fuel",
          seed: expect.objectContaining({ name: "Fuel", icon: "Package" }),
        }),
      ])
    );
    await waitFor(() => expect(onImport).toHaveBeenCalledTimes(1));
    const payload = onImport.mock.calls[0][0];
    expect(payload).toHaveLength(2);
    expect(payload[0].categoryId).toBe("new-snacks-id");
    expect(payload[1].categoryId).toBe("new-fuel-id");
  });
});
