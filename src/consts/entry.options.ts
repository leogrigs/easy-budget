import { BudgetTableTypeEnum } from "../enums/BudgetTableType.enum";
import { BudgetTableData } from "../interfaces/BudgetTable.interface";

export const NEW_ENTRY: BudgetTableData = {
  id: 0,
  name: "",
  price: 0,
  date: "",
  category: "",
  type: BudgetTableTypeEnum.INCOME,
};
