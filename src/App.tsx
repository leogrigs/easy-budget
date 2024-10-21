import { useEffect, useRef, useState } from "react";
import "./App.css";
import BudgetTable from "./components/BudgetTable";
import { BUDGET_TABLE_DATA_MOCK } from "./mocks/mockData";
import * as ApiService from "./services/apiService";
import NewEntryModal from "./components/NewEntryModal";
import { BudgetTableData } from "./interfaces/BudgetTable.interface";
import { BudgetTableType } from "./types/BudgetTableType.type";
import Totalizers from "./components/Totalizers";
import { BudgetTableTypeEnum } from "./enums/BudgetTableType.enum";

function App() {
  const [tableData, setTableData] = useState(BUDGET_TABLE_DATA_MOCK);

  const hasSearch = useRef(false);

  const reduceTablePriceByType = (type: BudgetTableType) =>
    tableData.reduce((acc, curr) => {
      if (curr.type === type) {
        return acc + curr.price;
      }
      return acc;
    }, 0);

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
          <Totalizers
            income={reduceTablePriceByType(BudgetTableTypeEnum.INCOME)}
            expense={reduceTablePriceByType(BudgetTableTypeEnum.EXPENSE)}
          />
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