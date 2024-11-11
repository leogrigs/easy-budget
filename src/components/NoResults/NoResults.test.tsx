import { render, screen } from "@testing-library/react";
import NoResults from "./NoResults";

describe("NoResults Component", () => {
  it("renders without crashing", () => {
    render(<NoResults />);
  });

  it("displays the correct image with alt text", () => {
    render(<NoResults />);
    const image = screen.getByAltText("no results");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      "src",
      "https://cdn-icons-png.flaticon.com/512/7409/7409366.png"
    );
  });

  it("displays the main title", () => {
    render(<NoResults />);
    const title = screen.getByText("No Records Found!");
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass(
      "text-center text-slate-800 dark:text-slate-200 text-xl lg:text-3xl font-semibold leading-snug"
    );
  });

  it("displays the message prompting the user to adjust search criteria", () => {
    render(<NoResults />);
    const message = screen.getByText(
      "Please adjust your search criteria or add a new record to get started."
    );
    expect(message).toBeInTheDocument();
    expect(message).toHaveClass(
      "text-center text-slate-600 dark:text-slate-400 text-base lg:text-lg max-w-3xl"
    );
  });
});
