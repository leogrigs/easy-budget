import { BudgetTableCategoryEnum } from "../enums/BudgetTableCategory.enum";
import { BudgetTableHeaderType } from "../types/BudgetTableHeader.type";

export interface BudgetTableData {
  id: number;
  name: string;
  price: number;
  date: string;
  category: BudgetTableCategoryEnum;
}

export interface BudgetTableHeader {
  key: BudgetTableHeaderType;
  label: string;
  align?: string | "start" | "end" | "center";
}
