import { BudgetTableHeaderEnum } from "../enums/BudgetTableHeader.enum";

export type BudgetTableHeaderType =
  | BudgetTableHeaderEnum.ID
  | BudgetTableHeaderEnum.NAME
  | BudgetTableHeaderEnum.PRICE
  | BudgetTableHeaderEnum.DATE
  | BudgetTableHeaderEnum.CATEGORY
  | BudgetTableHeaderEnum.TYPE;
