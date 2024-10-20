import { useEffect, useRef, useState } from "react";
import "./App.css";
import BudgetTable from "./components/BudgetTable";
import { BUDGET_TABLE_DATA_MOCK } from "./mocks/mockData";
import * as ApiService from "./services/apiService";
import NewEntryModal from "./components/NewEntryModal";
import { BudgetTableData } from "./interfaces/BudgetTable.interface";

function App() {
  const [tableData, setTableData] = useState(BUDGET_TABLE_DATA_MOCK);

  const hasSearch = useRef(false);

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
    const data = await ApiService.getTableData(false);
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

  const onNewEntry = async (entry: BudgetTableData) => {
    const postData = await ApiService.postTableData({
      ...entry,
      id: tableData.length + 1,
    });
    console.log("Dados enviados: ", postData);
    setTimeout(() => {
      fetchData();
    }, 2000);
  };

  return (
    <>
      <div className="w-screen h-screen p-4">
        <div className="border">
          <h1>Easy Budget</h1>
        </div>
        <div className="mb-4">
          <div>Balance: {income - expense}</div>
          <div>Income: {income}</div>
          <div>Expenses: {expense}</div>
        </div>
        <div>
          <label htmlFor="search">Search</label>
          <input id="search" type="text" />
          <NewEntryModal onNewEntry={onNewEntry}></NewEntryModal>
        </div>
        <div className="my-4">
          <BudgetTable rows={tableData}></BudgetTable>
        </div>
      </div>
    </>
  );
}

export default App;
