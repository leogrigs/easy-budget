import { BudgetTableCategoryEnum } from "../enums/BudgetTableCategory.enum";
import { BudgetTableTypeEnum } from "../enums/BudgetTableType.enum";
import { BudgetTableData } from "../interfaces/BudgetTable.interface";

export const BUDGET_TABLE_DATA_MOCK: BudgetTableData[] = [
  {
    id: 1,
    name: "Mercado",
    price: 300,
    date: "01/01/2024",
    category: BudgetTableCategoryEnum.FOOD,
    type: BudgetTableTypeEnum.EXPENSE,
  },
  {
    id: 2,
    name: "Bar",
    price: 100,
    date: "01/01/2024",
    category: BudgetTableCategoryEnum.FOOD,
    type: BudgetTableTypeEnum.EXPENSE,
  },
  {
    id: 3,
    name: "Salário",
    price: 3000,
    date: "01/01/2024",
    category: BudgetTableCategoryEnum.SALARY,
    type: BudgetTableTypeEnum.EXPENSE,
  },
  {
    id: 4,
    name: "Mercado",
    price: 300,
    date: "01/01/2024",
    category: BudgetTableCategoryEnum.FOOD,
    type: BudgetTableTypeEnum.EXPENSE,
  },
  {
    id: 5,
    name: "Salary",
    price: 3000,
    date: "03/01/2024",
    category: BudgetTableCategoryEnum.SALARY,
    type: BudgetTableTypeEnum.INCOME,
  },
];
