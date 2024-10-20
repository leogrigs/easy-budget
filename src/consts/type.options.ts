import { BudgetTableTypeEnum } from "../enums/BudgetTableType.enum";
import { InputOptions } from "../interfaces/InputOptions.interface";

export const TYPE_OPTIONS: InputOptions[] = [
  {
    id: "type-1",
    value: "income",
    label: BudgetTableTypeEnum.INCOME,
  },
  {
    id: "type-2",
    value: "expense",
    label: BudgetTableTypeEnum.EXPENSE,
  },
];
