import { fireEvent, render, screen } from "@testing-library/react";
import Input from "./Input";

describe("Input Component", () => {
  const mockOnChange = vi.fn();

  it("renders correctly with default props", () => {
    render(<Input name="test" value="" onChange={mockOnChange} />);

    const inputElement = screen.getByRole("textbox");
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute("name", "test");
    expect(inputElement).toHaveAttribute("type", "text");
    expect(inputElement).toHaveValue("");
  });

  it("renders with a placeholder", () => {
    render(
      <Input
        name="test"
        value=""
        onChange={mockOnChange}
        placeholder="Enter text"
      />
    );

    const inputElement = screen.getByPlaceholderText("Enter text");
    expect(inputElement).toBeInTheDocument();
  });

  it("calls onChange with the correct parameters on input change", () => {
    render(<Input name="test" value="" onChange={mockOnChange} />);

    const inputElement = screen.getByRole("textbox");
    fireEvent.change(inputElement, { target: { value: "123" } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith("test", "123");
  });

  it("handles number type correctly", () => {
    render(
      <Input
        name="numberInput"
        value={0}
        onChange={mockOnChange}
        type="number"
      />
    );

    const inputElement = screen.getByRole("spinbutton");
    fireEvent.change(inputElement, { target: { value: "42" } });

    expect(mockOnChange).toHaveBeenCalledTimes(2);
    expect(mockOnChange).toHaveBeenCalledWith("numberInput", 42);
  });

  it("changes style based on value", () => {
    const { rerender } = render(
      <Input name="test" value="" onChange={mockOnChange} />
    );
    const inputElement = screen.getByRole("textbox");

    expect(inputElement).toHaveClass("text-slate-400");

    rerender(<Input name="test" value="Some text" onChange={mockOnChange} />);
    expect(inputElement).toHaveClass("text-slate-700");
  });
});
