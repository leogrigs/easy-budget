import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Totalizers from "./Totalizers";

describe("Totalizers Component", () => {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const normalized = (text: string) => text.replace(/\s/g, "");

  const matchText = (value: string) => (content: string) =>
    normalized(content) === normalized(value);

  it("renders the three KPI labels", () => {
    render(<Totalizers total={0} count={0} />);
    expect(screen.getByText("Total spent")).toBeInTheDocument();
    expect(screen.getByText("Entries")).toBeInTheDocument();
    expect(screen.getByText("Avg per entry")).toBeInTheDocument();
  });

  it("displays the total spent as currency", () => {
    render(<Totalizers total={1500} count={3} />);
    expect(
      screen.getByText(matchText(formatCurrency(1500)))
    ).toBeInTheDocument();
  });

  it("displays the entry count", () => {
    render(<Totalizers total={1500} count={3} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("displays the average per entry", () => {
    render(<Totalizers total={1500} count={3} />);
    expect(
      screen.getByText(matchText(formatCurrency(500)))
    ).toBeInTheDocument();
  });

  it("renders average as zero when there are no entries", () => {
    render(<Totalizers total={0} count={0} />);
    expect(screen.getAllByText(matchText(formatCurrency(0))).length).toBe(2);
  });
});
