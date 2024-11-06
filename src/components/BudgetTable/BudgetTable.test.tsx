import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { BudgetTableActionEnum } from "../../enums/BudgetTableAction.enum";
import { BudgetTableData } from "../../interfaces/BudgetTable.interface";
import { BUDGET_TABLE_DATA_MOCK } from "../../mocks/mockData";
import BudgetTable from "./BudgetTable";

const mockRows: BudgetTableData[] = BUDGET_TABLE_DATA_MOCK;

const mockOnAction = vi.fn();

describe("BudgetTable Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders the BudgetTable component with initial data", () => {
    render(
      <BudgetTable rows={mockRows} itemsPerPage={2} onAction={mockOnAction} />
    );

    const headers = screen.getAllByRole("columnheader");
    expect(headers.length).toBeGreaterThan(0);

    const rows = screen.getAllByRole("row");
    expect(rows.length).toBe(3);
  });

  test("displays NoResults component when no data matches filters", () => {
    render(
      <BudgetTable rows={mockRows} itemsPerPage={2} onAction={mockOnAction} />
    );

    const searchInput = screen.getByPlaceholderText("Search by name");
    fireEvent.change(searchInput, { target: { value: "NonExisting" } });

    expect(screen.getByText("No Records Found!")).toBeInTheDocument();
  });

  test("filters data by month and year", () => {
    render(
      <BudgetTable rows={mockRows} itemsPerPage={2} onAction={mockOnAction} />
    );

    const monthSelect = screen.getAllByRole("combobox")[0];
    fireEvent.change(monthSelect, { target: { value: "1" } });

    const yearSelect = screen.getAllByRole("combobox")[1];
    fireEvent.change(yearSelect, { target: { value: "2024" } });

    const rows = screen.getAllByRole("row");
    expect(rows.length).toBe(3);
    expect(screen.getAllByText("food")[0]).toBeInTheDocument();
  });

  test("handles pagination correctly", () => {
    render(
      <BudgetTable rows={mockRows} itemsPerPage={2} onAction={mockOnAction} />
    );

    const rowsPage1 = screen.getAllByRole("row");
    expect(rowsPage1.length).toBe(3);

    const nextPageButton = screen.getAllByRole("button").at(-1)!;
    fireEvent.click(nextPageButton);
    fireEvent.click(nextPageButton);

    const rowsPage2 = screen.getAllByRole("row");
    expect(rowsPage2.length).toBe(2);
  });

  test("triggers onAction callback when New Entry button is clicked", () => {
    render(
      <BudgetTable rows={mockRows} itemsPerPage={2} onAction={mockOnAction} />
    );

    const newEntryButton = screen.getByText("New Entry");
    fireEvent.click(newEntryButton);

    expect(mockOnAction).toHaveBeenCalledWith(
      BudgetTableActionEnum.CREATE,
      expect.any(Object)
    );
  });
});
