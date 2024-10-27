import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import "./App.css";
import BudgetTable from "./components/BudgetTable";
import EntryModal from "./components/EntryModal";
import GoogleSignIn from "./components/GoogleSignIn";
import Totalizers from "./components/Totalizers";
import { BudgetTableActionEnum } from "./enums/BudgetTableAction.enum";
import { BudgetTableTypeEnum } from "./enums/BudgetTableType.enum";
import { BudgetTableData } from "./interfaces/BudgetTable.interface";
import { auth } from "./services/firebase";
import {
  addEntryToTable,
  fetchUserTable,
  initializeUserDocument,
  updateEntryInTable,
} from "./services/firestore";
import { BudgetTableType } from "./types/BudgetTableType.type";

function App() {
  const [tableData, setTableData] = useState<BudgetTableData[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isNewEntryModalOpen, setIsNewEntryModalOpen] = useState(false);
  const [isEditEntryModalOpen, setIsEditEntryModalOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState({
    id: 0,
    name: "",
    price: 0,
    date: "",
    category: "food",
    type: BudgetTableTypeEnum.EXPENSE,
  });

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

  const onEditEntry = async (entry: BudgetTableData) => {
    if (user) {
      await updateEntryInTable(user.uid, entry, tableData);
      await updateTable(user.uid);
    }
  };

  const logout = async () => {
    await auth.signOut();
    setUser(null);
    setTableData([]);
  };

  const handleTableAction = (
    action: BudgetTableActionEnum,
    entry?: BudgetTableData
  ) => {
    switch (action) {
      case BudgetTableActionEnum.EDIT:
        setCurrentEntry(entry!);
        setIsEditEntryModalOpen(true);
        break;
      case BudgetTableActionEnum.DELETE:
        console.log("Delete", entry);
        break;
      case BudgetTableActionEnum.CREATE:
        setIsNewEntryModalOpen(true);

        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="p-4">
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
              <button onClick={() => setIsNewEntryModalOpen(true)}>
                New Entry
              </button>
            </div>
            <div className="w-2/3 my-4">
              <BudgetTable
                rows={tableData}
                itemsPerPage={10}
                onAction={handleTableAction}
              />
            </div>
          </>
        )}
      </div>

      <EntryModal
        isOpen={isNewEntryModalOpen}
        title="New Entry"
        onConfirm={onNewEntry}
        entry={currentEntry}
        closeModal={() => setIsNewEntryModalOpen(false)}
      />

      <EntryModal
        isOpen={isEditEntryModalOpen}
        title="Edit Entry"
        entry={currentEntry}
        onConfirm={onEditEntry}
        closeModal={() => setIsEditEntryModalOpen(false)}
      />
    </>
  );
}

export default App;
