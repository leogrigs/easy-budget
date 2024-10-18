import { BudgetTableTypeEnum } from "../enums/BudgetTableType.enum";
import { BudgetTableData } from "../interfaces/BudgetTable.interface";

export const BUDGET_TABLE_DATA_MOCK: BudgetTableData[] = [
  {
    id: 1,
    name: "Mercado",
    price: 300,
    date: "01/01/2024",
    category: "food",
    type: BudgetTableTypeEnum.EXPENSE,
    bank: "Nubank",
  },
  {
    id: 2,
    name: "Bar",
    price: 100,
    date: "01/01/2024",
    category: "food",
    type: BudgetTableTypeEnum.EXPENSE,
    bank: "Nubank",
  },
  {
    id: 3,
    name: "Salário",
    price: 3000,
    date: "01/01/2024",
    category: "income",
    type: BudgetTableTypeEnum.EXPENSE,
    bank: "Nubank",
  },
  {
    id: 4,
    name: "Mercado",
    price: 300,
    date: "01/01/2024",
    category: "food",
    type: BudgetTableTypeEnum.EXPENSE,
    bank: "Nubank",
  },
  {
    id: 5,
    name: "Salary",
    price: 3000,
    date: "03/01/2024",
    category: "salary",
    type: BudgetTableTypeEnum.INCOME,
    bank: "Itau",
  },
];
