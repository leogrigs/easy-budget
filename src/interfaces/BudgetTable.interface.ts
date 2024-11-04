import { BudgetTableCategoryEnum } from "../enums/BudgetTableCategory.enum";
import { BudgetTableHeaderType } from "../types/BudgetTableHeader.type";
import { BudgetTableType } from "../types/BudgetTableType.type";

export interface BudgetTableData {
  id: number;
  name: string;
  price: number;
  date: string;
  category: BudgetTableCategoryEnum;
  type: BudgetTableType;
}

export interface BudgetTableHeader {
  key: BudgetTableHeaderType;
  label: string;
  align?: string | "start" | "end" | "center";
}
