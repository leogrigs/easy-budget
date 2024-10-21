import { BudgetTableTypeEnum } from "../enums/BudgetTableType.enum";
import { InputOptions } from "../interfaces/InputOptions.interface";

export const TYPE_OPTIONS: InputOptions[] = [
  {
    id: "type-1",
    value: BudgetTableTypeEnum.INCOME,
    label: "Income",
  },
  {
    id: "type-2",
    value: BudgetTableTypeEnum.EXPENSE,
    label: "Expense",
  },
];
