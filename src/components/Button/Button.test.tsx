import { fireEvent, render, screen } from "@testing-library/react";
import Button from "./Button";

describe("Button Component", () => {
  it("renders with a label", () => {
    render(<Button label="Click Me" onClick={() => {}} />);
    const buttonElement = screen.getByText("Click Me");
    expect(buttonElement).toBeInTheDocument();
  });

  it("renders without a label (icon only)", () => {
    const { container } = render(
      <Button onClick={() => {}} icon={<span data-testid="icon">🌟</span>} />
    );
    const iconElement = screen.getByTestId("icon");
    expect(iconElement).toBeInTheDocument();
    expect(container.querySelector("span.text-sm")).not.toBeInTheDocument();
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = vi.fn();
    render(<Button label="Click Me" onClick={handleClick} />);
    const buttonElement = screen.getByText("Click Me");
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", () => {
    const handleClick = vi.fn();
    render(<Button label="Can't Click" onClick={handleClick} disabled />);
    const buttonElement = screen.getByText("Can't Click");
    fireEvent.click(buttonElement);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("applies the correct styles when disabled", () => {
    render(<Button label="Disabled" onClick={() => {}} disabled={true} />);
    const buttonElement = screen.getByRole("button");
    expect(buttonElement).toHaveClass(
      "cursor-not-allowed text-slate-500 dark:text-slate-400"
    );
  });
});
