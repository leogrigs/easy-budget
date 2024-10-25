import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import "./App.css";
import BudgetTable from "./components/BudgetTable";
import GoogleSignIn from "./components/GoogleSignIn";
import NewEntryModal from "./components/NewEntryModal";
import Totalizers from "./components/Totalizers";
import { BudgetTableTypeEnum } from "./enums/BudgetTableType.enum";
import { BudgetTableData } from "./interfaces/BudgetTable.interface";
import { BUDGET_TABLE_DATA_MOCK } from "./mocks/mockData";
import { auth } from "./services/firebase";
import { BudgetTableType } from "./types/BudgetTableType.type";

function App() {
  const [tableData, setTableData] = useState(BUDGET_TABLE_DATA_MOCK);
  const [user, setUser] = useState<User | null>(null);

  const reduceTablePriceByType = (type: BudgetTableType) =>
    tableData.reduce((acc, curr) => {
      if (curr.type === type) {
        return acc + curr.price;
      }
      return acc;
    }, 0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
      console.log(currentUser);
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const onNewEntry = async (entry: BudgetTableData) => {
    console.log("Entry: ", entry);
  };

  const handleLoginSuccess = (user: User) => {
    setUser(user);
  };

  const logout = (): void => {
    // auth.signOut();
    setUser(null);
  };

  return (
    <>
      <div className="w-screen h-screen p-4">
        <div className="border">
          <h1>Easy Budget</h1>
          <button onClick={logout}>Logout</button>
        </div>
        {!user ? (
          <div className="my-4">
            <GoogleSignIn onUserLogin={handleLoginSuccess} />
          </div>
        ) : (
          <>
            <div className="flex justify-between my-4">
              <Totalizers
                income={reduceTablePriceByType(BudgetTableTypeEnum.INCOME)}
                expense={reduceTablePriceByType(BudgetTableTypeEnum.EXPENSE)}
              />
              <NewEntryModal onNewEntry={onNewEntry}></NewEntryModal>
            </div>
            <div className="w-1/2 my-4">
              <BudgetTable rows={tableData} itemsPerPage={10}></BudgetTable>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
