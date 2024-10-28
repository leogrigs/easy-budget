import { BudgetTableCategoryEnum } from "../enums/BudgetTableCategory.enum";
import { InputOptions } from "../interfaces/InputOptions.interface";

export const CATEGORY_OPTIONS: InputOptions[] = [
  {
    id: "category-1",
    label: "Salary",
    value: BudgetTableCategoryEnum.SALARY,
  },
  {
    id: "category-2",
    label: "Food",
    value: BudgetTableCategoryEnum.FOOD,
  },
  {
    id: "category-3",
    label: "Transport",
    value: BudgetTableCategoryEnum.TRANSPORT,
  },
  {
    id: "category-4",
    label: "Miscellaneous",
    value: BudgetTableCategoryEnum.MISCELLENEOUS,
  },
  {
    id: "category-5",
    label: "Entertainment",
    value: BudgetTableCategoryEnum.ENTERTAINMENT,
  },
  {
    id: "category-6",
    label: "Other",
    value: BudgetTableCategoryEnum.OTHER,
  },
];
