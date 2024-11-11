import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Totalizers from "./Totalizers";

describe("Totalizers Component", () => {
  const mockIncome = 5000;
  const mockExpense = 1500;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  it("displays the correct balance value", () => {
    render(<Totalizers income={mockIncome} expense={mockExpense} />);
    const balance = formatCurrency(mockIncome - mockExpense);

    expect(
      screen.getByText((content) => {
        const normalizedText = content.replace(/\s/g, "");
        return normalizedText === balance.replace(/\s/g, "");
      })
    ).toBeInTheDocument();
  });

  it("displays the correct income value", () => {
    render(<Totalizers income={mockIncome} expense={mockExpense} />);
    const income = formatCurrency(mockIncome);

    expect(
      screen.getByText((content) => {
        const normalizedText = content.replace(/\s/g, "");
        return normalizedText === income.replace(/\s/g, "");
      })
    ).toBeInTheDocument();
  });

  it("displays the correct expense value", () => {
    render(<Totalizers income={mockIncome} expense={mockExpense} />);
    const expense = formatCurrency(mockExpense);

    expect(
      screen.getByText((content) => {
        const normalizedText = content.replace(/\s/g, "");
        return normalizedText === expense.replace(/\s/g, "");
      })
    ).toBeInTheDocument();
  });
});
