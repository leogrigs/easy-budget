import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import "./App.css";
import BudgetTable from "./components/BudgetTable";
import GoogleSignIn from "./components/GoogleSignIn";
import NewEntryModal from "./components/NewEntryModal";
import Totalizers from "./components/Totalizers";
import { BudgetTableTypeEnum } from "./enums/BudgetTableType.enum";
import { BudgetTableData } from "./interfaces/BudgetTable.interface";
import { auth } from "./services/firebase";
import {
  addEntryToTable,
  fetchUserTable,
  initializeUserDocument,
} from "./services/firestore";
import { BudgetTableType } from "./types/BudgetTableType.type";

function App() {
  const [tableData, setTableData] = useState<BudgetTableData[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const reduceTablePriceByType = (type: BudgetTableType) =>
    tableData.reduce((acc, curr) => {
      if (curr.type === type) {
        return acc + curr.price;
      }
      return acc;
    }, 0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await initializeUserDocument(currentUser.uid);
        updateTable(currentUser.uid);
      } else {
        setTableData([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const updateTable = async (uid: string): Promise<void> => {
    const table = await fetchUserTable(uid);
    setTableData(table);
  };

  const onNewEntry = async (entry: BudgetTableData) => {
    if (user) {
      const _newEntry = {
        ...entry,
        id: tableData.length + 1,
      };

      await addEntryToTable(user.uid, _newEntry);
      await updateTable(user.uid);
    }
  };

  const logout = async () => {
    await auth.signOut();
    setUser(null);
    setTableData([]);
  };

  return (
    <div className="w-screen h-screen p-4">
      <div className="border">
        <h1>Easy Budget</h1>
        <button onClick={logout}>Logout</button>
      </div>
      {!user ? (
        <div className="my-4">
          <GoogleSignIn onUserLogin={(user) => setUser(user)} />
        </div>
      ) : (
        <>
          <div className="flex justify-between my-12">
            <Totalizers
              income={reduceTablePriceByType(BudgetTableTypeEnum.INCOME)}
              expense={reduceTablePriceByType(BudgetTableTypeEnum.EXPENSE)}
            />
            <NewEntryModal onNewEntry={onNewEntry} />
          </div>
          <div className="w-2/3 my-4">
            <BudgetTable rows={tableData} itemsPerPage={10} />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
