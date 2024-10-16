import "./App.css";
import BudgetTable from "./components/BudgetTable";
import { BudgetTableRow } from "./components/BudgetTable/BudgetTable.types";
import { BUDGET_TABLE_DATA_MOCK } from "./mocks/mockData";

function App() {
  const rows: BudgetTableRow[] = BUDGET_TABLE_DATA_MOCK;

  return (
    <>
      <div className="w-screen h-screen">
        <div className="border">
          <h1>Easy Budget</h1>
        </div>
        <div>
          <div>Income: 1000</div>
          <div>Expenses: -300</div>
        </div>
        <div>
          <label htmlFor="search">Search</label>
          <input id="search" type="text" />
        </div>
        <div className="border">
          <BudgetTable rows={rows}></BudgetTable>
        </div>
      </div>
    </>
  );
}

export default App;
