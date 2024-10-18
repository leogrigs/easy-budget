import { useEffect, useRef, useState } from "react";
import "./App.css";
import BudgetTable from "./components/BudgetTable";
import { BUDGET_TABLE_DATA_MOCK } from "./mocks/mockData";
import * as ApiService from "./services/apiService";
import { BudgetTableTypeEnum } from "./enums/BudgetTableType.enum";

function App() {
  const [tableData, setTableData] = useState(BUDGET_TABLE_DATA_MOCK);

  const hasSearch = useRef(false);

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const reduceTablePriceByType = (type: string) =>
    tableData.reduce((acc, curr) => {
      if (curr.type === type) {
        return acc + curr.price;
      }
      return acc;
    }, 0);

  const income = reduceTablePriceByType("Income");
  const expense = reduceTablePriceByType("Expense");

  const fetchData = async () => {
    const data = await ApiService.getTableData(true);
    console.log("Dados buscados: ", data);
    setTableData(data);
  };

  useEffect(() => {
    if (!hasSearch.current) {
      fetchData().catch((error) =>
        console.error("Erro ao buscar dados: ", error)
      );
      hasSearch.current = true;
    }
  }, []);

  const postData = async () => {
    await ApiService.postTableData({
      id: tableData.length + 1,
      name: "Teste",
      price: 0,
      date: "01/01/2001",
      category: "teste",
      type: BudgetTableTypeEnum.INCOME,
      bank: "bank",
    });
    await delay(1000);
    await fetchData();
  };

  const deleteData = async () => {
    if (tableData.length > 0) {
      const lastId = tableData[tableData.length - 1].id;
      await ApiService.deleteTableDataById(lastId);
      await delay(5000);
      await fetchData();
    }
  };

  return (
    <>
      <div className="w-screen h-screen">
        <div className="border">
          <h1>Easy Budget</h1>
        </div>
        <div>
          <div>Balance: {income - expense}</div>
          <div>Income: {income}</div>
          <div>Expenses: {expense}</div>
        </div>
        <div>
          <label htmlFor="search">Search</label>
          <input id="search" type="text" />
          <button onClick={postData}>Add row</button>
          <button onClick={deleteData}>Delete last row</button>
        </div>
        <div className="border">
          <BudgetTable rows={tableData}></BudgetTable>
        </div>
      </div>
    </>
  );
}

export default App;
