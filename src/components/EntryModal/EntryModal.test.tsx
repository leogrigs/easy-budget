import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BudgetTableData } from "../../interfaces/BudgetTable.interface";
import { BUDGET_TABLE_DATA_MOCK } from "../../mocks/mockData";
import EntryModal from "./EntryModal";

const mockEntry: BudgetTableData = BUDGET_TABLE_DATA_MOCK[0];

describe("EntryModal Component", () => {
  const mockOnConfirm = vi.fn();
  const mockCloseModal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly when open", () => {
    render(
      <EntryModal
        isOpen={true}
        title="Edit Entry"
        entry={mockEntry}
        onConfirm={mockOnConfirm}
        closeModal={mockCloseModal}
      />
    );

    expect(screen.getByText("Edit Entry")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("disables confirm button if form is invalid", () => {
    render(
      <EntryModal
        isOpen={true}
        title="Edit Entry"
        entry={{ ...mockEntry, name: "", date: "" }}
        onConfirm={mockOnConfirm}
        closeModal={mockCloseModal}
      />
    );

    const confirmButton = screen.getByText("Confirm");
    waitFor(() => {
      expect(confirmButton).toBeDisabled();
    });
  });

  it("enables confirm button when form is valid", () => {
    render(
      <EntryModal
        isOpen={true}
        title="Edit Entry"
        entry={mockEntry}
        onConfirm={mockOnConfirm}
        closeModal={mockCloseModal}
      />
    );

    const confirmButton = screen.getByText("Confirm");
    expect(confirmButton).not.toBeDisabled();
  });

  it("updates form data on input change", () => {
    render(
      <EntryModal
        isOpen={true}
        title="Edit Entry"
        entry={mockEntry}
        onConfirm={mockOnConfirm}
        closeModal={mockCloseModal}
      />
    );

    const nameInput = screen.getByRole("textbox") as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "Updated Entry" } });

    expect(nameInput.value).toBe("Updated Entry");
  });

  it("calls onConfirm with updated data and closes modal on confirm", () => {
    render(
      <EntryModal
        isOpen={true}
        title="Edit Entry"
        entry={mockEntry}
        onConfirm={mockOnConfirm}
        closeModal={mockCloseModal}
      />
    );

    const confirmButton = screen.getByText("Confirm");
    fireEvent.click(confirmButton);

    expect(mockOnConfirm).toHaveBeenCalledWith(mockEntry);
    expect(mockCloseModal).toHaveBeenCalled();
  });

  it("calls closeModal on cancel", () => {
    render(
      <EntryModal
        isOpen={true}
        title="Edit Entry"
        entry={mockEntry}
        onConfirm={mockOnConfirm}
        closeModal={mockCloseModal}
      />
    );

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(mockCloseModal).toHaveBeenCalled();
  });
});
