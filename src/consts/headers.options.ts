import { BudgetTableHeaderEnum } from "../enums/BudgetTableHeader.enum";

export const BUDGET_TABLE_HEADERS = [
  {
    key: BudgetTableHeaderEnum.NAME,
    label: "Name",
  },
  {
    key: BudgetTableHeaderEnum.PRICE,
    label: "Price",
    align: "right",
  },
  {
    key: BudgetTableHeaderEnum.CATEGORY,
    label: "Category",
  },
  {
    key: BudgetTableHeaderEnum.DATE,
    label: "Date",
  },
  {
    key: BudgetTableHeaderEnum.ACTIONS,
    label: "Actions",
    align: "right",
  },
];
