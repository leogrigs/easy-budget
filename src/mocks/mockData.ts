import { BudgetTableCategoryEnum } from "../enums/BudgetTableCategory.enum";
import { BudgetTableData } from "../interfaces/BudgetTable.interface";

export const BUDGET_TABLE_DATA_MOCK: BudgetTableData[] = [
  {
    id: 1,
    name: "Mercado",
    price: 300,
    date: "2024-01-01",
    category: BudgetTableCategoryEnum.FOOD,
  },
  {
    id: 2,
    name: "Bar",
    price: 100,
    date: "2024-01-01",
    category: BudgetTableCategoryEnum.FOOD,
  },
  {
    id: 3,
    name: "Uber",
    price: 45,
    date: "2024-01-02",
    category: BudgetTableCategoryEnum.TRANSPORT,
  },
  {
    id: 4,
    name: "Mercado",
    price: 280,
    date: "2024-01-08",
    category: BudgetTableCategoryEnum.FOOD,
  },
];
