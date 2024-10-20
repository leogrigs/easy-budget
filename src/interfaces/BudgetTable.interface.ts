import { BudgetTableType } from "../types/BudgetTableType.type";

export interface BudgetTableData {
  id: number;
  name: string;
  price: number;
  date: string;
  category: string; // TODO: transform into a type or enum
  type: BudgetTableType;
}
