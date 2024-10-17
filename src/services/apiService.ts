import { BudgetTableData } from "../interfaces/BudgetTable.interface";

const API_URL = "https://api.sheetbest.com/sheets";
const SHEET_ID = "8d805f34-cbcb-4373-b3b6-d11c05c9a129";

export const getTableData = async (raw = false) => {
  const response = await fetch(`${API_URL}/${SHEET_ID}${raw ? "?_raw=1" : ""}`);
  const data = await response.json();
  return data;
};

export const postTableData = async (data: BudgetTableData) => {
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
  const response = await fetch(`${API_URL}/${SHEET_ID}/id/*${id}*`, {
    method: "DELETE",
  });
  const responseData = await response.json();
  return responseData;
};
