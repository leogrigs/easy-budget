import { BudgetTableData } from "../interfaces/BudgetTable.interface";
import { BUDGET_TABLE_DATA_MOCK } from "../mocks/mockData";

const API_URL = "https://api.sheetbest.com/sheets";
const SHEET_ID = "8d805f34-cbcb-4373-b3b6-d11c05c9a129";
const USE_MOCK = false;

export const getTableData = async (raw = false) => {
  if (USE_MOCK) {
    return BUDGET_TABLE_DATA_MOCK;
  }
  const response = await fetch(`${API_URL}/${SHEET_ID}${raw ? "?_raw=1" : ""}`);
  const data = await response.json();
  return formatData(data);
};

const formatData = (data: BudgetTableData[]) => {
  return data.map((item) => ({
    ...item,
    price: Number(item.price),
    id: Number(item.id),
  }));
};

export const postTableData = async (data: BudgetTableData) => {
  if (USE_MOCK) return;
  const response = await fetch(`${API_URL}/${SHEET_ID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const responseData = await response.json();
  return responseData;
};

export const deleteTableDataById = async (id: number) => {
  if (USE_MOCK) return;
  const response = await fetch(`${API_URL}/${SHEET_ID}/id/*${id}*`, {
    method: "DELETE",
  });
  const responseData = await response.json();
  return responseData;
};
