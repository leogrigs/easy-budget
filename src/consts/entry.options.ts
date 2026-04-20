import { BudgetTableCategoryEnum } from "../enums/BudgetTableCategory.enum";
import { BudgetTableData } from "../interfaces/BudgetTable.interface";

export const NEW_ENTRY: BudgetTableData = {
  id: -1,
  name: "",
  price: 0,
  date: "",
  category: BudgetTableCategoryEnum.FOOD,
};
