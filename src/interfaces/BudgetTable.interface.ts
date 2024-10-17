export interface BudgetTableData {
  id: number;
  name: string;
  price: number;
  date: string;
  category: string; // TODO: transform into a type or enum
  type: string; // TODO: transform into a type or enum
  method: string; // TODO: transform into a type or enum
  bank: string; // TODO: transform into a type or enum
}
