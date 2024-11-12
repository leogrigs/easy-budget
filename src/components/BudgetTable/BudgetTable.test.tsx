import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
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
    render(<BudgetTable rows={[]} itemsPerPage={2} onAction={mockOnAction} />);

    expect(screen.getByText("No Records Found!")).toBeInTheDocument();
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
});
