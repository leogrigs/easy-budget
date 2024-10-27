import { BudgetTableTypeEnum } from "../enums/BudgetTableType.enum";
import { BudgetTableData } from "../interfaces/BudgetTable.interface";

export const NEW_ENTRY: BudgetTableData = {
  id: -1,
  name: "",
  price: 0,
  date: "",
  category: "salary",
  type: BudgetTableTypeEnum.INCOME,
};
