import { render, screen } from "@testing-library/react";
import { BudgetTableCategoryEnum } from "../../enums/BudgetTableCategory.enum";
import CategoryChip from "./CategoryChip";

describe("CategoryChip Component", () => {
  it("renders with the correct label and color for each category", () => {
    const categories = [
      { category: BudgetTableCategoryEnum.SALARY, label: "Salary" },
      { category: BudgetTableCategoryEnum.FOOD, label: "Food" },
      { category: BudgetTableCategoryEnum.TRANSPORT, label: "Transport" },
      {
        category: BudgetTableCategoryEnum.ENTERTAINMENT,
        label: "Entertainment",
      },
      {
        category: BudgetTableCategoryEnum.MISCELLENEOUS,
        label: "Miscellaneous",
      },
      { category: BudgetTableCategoryEnum.OTHER, label: "Other" },
    ];

    categories.forEach(({ category, label }) => {
      render(<CategoryChip category={category} label={label} />);

      const chip = screen.getByText(label);
      expect(chip).toBeInTheDocument();
      expect(chip).toHaveClass("py-1 px-2.5 rounded-full font-medium");

      switch (category) {
        case BudgetTableCategoryEnum.SALARY:
          expect(chip).toHaveClass(
            "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200"
          );
          break;
        case BudgetTableCategoryEnum.FOOD:
          expect(chip).toHaveClass(
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200"
          );
          break;
        case BudgetTableCategoryEnum.TRANSPORT:
          expect(chip).toHaveClass(
            "bg-cyan-100 text-cyan-800 dark:bg-cyan-800 dark:text-cyan-200"
          );
          break;
        case BudgetTableCategoryEnum.ENTERTAINMENT:
          expect(chip).toHaveClass(
            "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200"
          );
          break;
        case BudgetTableCategoryEnum.MISCELLENEOUS:
          expect(chip).toHaveClass(
            "bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-200"
          );
          break;
        case BudgetTableCategoryEnum.OTHER:
          expect(chip).toHaveClass(
            "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
          );
          break;
      }
    });
  });
});
