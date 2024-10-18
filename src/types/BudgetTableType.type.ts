import { BudgetTableTypeEnum } from "../enums/BudgetTableType.enum";

export type BudgetTableType =
  | BudgetTableTypeEnum.INCOME
  | BudgetTableTypeEnum.EXPENSE;
