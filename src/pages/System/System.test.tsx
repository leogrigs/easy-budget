import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { User } from "firebase/auth";
import { vi } from "vitest";
import { useLoading } from "../../contexts/LoadingContext";
import { BUDGET_TABLE_DATA_MOCK } from "../../mocks/mockData";
import {
  deleteEntryFromTable,
  fetchUserTable,
  initializeUserDocument,
  updateEntryInTable,
} from "../../services/firestore";
import System from "./System";

vi.mock("@nivo/bar", () => ({
  ResponsiveBar: () => <div data-testid="mock-bar-chart" />,
}));
vi.mock("@nivo/pie", () => ({
  ResponsivePie: () => <div data-testid="mock-pie-chart" />,
}));
vi.mock("@nivo/core", () => ({
  ResponsiveChart: () => <div data-testid="mock-chart" />,
}));

vi.mock("../../services/firestore", () => ({
  initializeUserDocument: vi.fn(),
  fetchUserTable: vi.fn(),
  addEntryToTable: vi.fn(),
  updateEntryInTable: vi.fn(),
  deleteEntryFromTable: vi.fn(),
}));

vi.mock("../../contexts/LoadingContext", () => ({
  useLoading: vi.fn(),
}));

describe("System component", () => {
  const mockUser: User = { uid: "testUser" } as User;
  const mockSetLoading = vi.fn();
  const mockTableData = BUDGET_TABLE_DATA_MOCK;

  beforeEach(() => {
    (useLoading as vi.Mock).mockReturnValue({ setLoading: mockSetLoading });
    (fetchUserTable as vi.Mock).mockResolvedValue(mockTableData);
    (initializeUserDocument as vi.Mock).mockResolvedValue({});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders Totalizers, BudgetTable, and Chart components", async () => {
    render(<System user={mockUser} />);
    await waitFor(() => {
      expect(screen.getByText("Income")).toBeInTheDocument();
      expect(screen.getByText("Expense")).toBeInTheDocument();
    });
    expect(screen.getByPlaceholderText("Search by name")).toBeInTheDocument();
  });

  it("shows new entry modal when 'New Entry' button is clicked", () => {
    render(<System user={mockUser} />);
    const newEntryButton = screen.getByText("New Entry");
    fireEvent.click(newEntryButton);
    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
  });

  it("updates an entry when editing", async () => {
    (updateEntryInTable as vi.Mock).mockResolvedValue(mockTableData);
    render(<System user={mockUser} />);

    await waitFor(() => {
      fireEvent.click(screen.getAllByAltText("edit entry")[0]);
      fireEvent.click(screen.getByText("Confirm"));
      expect(updateEntryInTable).toHaveBeenCalled();
    });
  });

  it("deletes an entry when confirmed in delete modal", async () => {
    (deleteEntryFromTable as vi.Mock).mockResolvedValue(
      mockTableData.filter((entry) => entry.id !== 1)
    );

    render(<System user={mockUser} />);

    await waitFor(() => {
      fireEvent.click(screen.getAllByAltText("delete entry")[0]);
      fireEvent.click(screen.getByText("Confirm"));
      expect(deleteEntryFromTable).toHaveBeenCalled();
    });
  });

  it("sets loading state during async operations", async () => {
    render(<System user={mockUser} />);
    await waitFor(() => {
      expect(mockSetLoading).toHaveBeenCalledWith(true);
      expect(mockSetLoading).toHaveBeenCalledWith(false);
    });
  });
});
