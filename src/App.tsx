import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import "./App.css";
import BudgetTable from "./components/BudgetTable";
import Chart from "./components/Chart";
import EntryModal from "./components/EntryModal";
import GoogleSignIn from "./components/GoogleSignIn";
import Loader from "./components/Loader";
import Modal from "./components/Modal";
import Totalizers from "./components/Totalizers";
import { NEW_ENTRY } from "./consts/entry.options";
import { BudgetTableActionEnum } from "./enums/BudgetTableAction.enum";
import { BudgetTableTypeEnum } from "./enums/BudgetTableType.enum";
import { BudgetTableData } from "./interfaces/BudgetTable.interface";
import { auth } from "./services/firebase";
import {
  addEntryToTable,
  deleteEntryFromTable,
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
  const [isDeleteEntryModalOpen, setIsDeleteEntryModalOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(NEW_ENTRY);
  const [isLoading, setIsLoading] = useState(false);

  const reduceTablePriceByType = (type: BudgetTableType) =>
    tableData.reduce((acc, curr) => {
      if (curr.type === type) {
        return acc + curr.price;
      }
      return acc;
    }, 0);

  useEffect(() => {
    asyncFunctionWrapper(async () => {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
          await initializeUserDocument(currentUser.uid);
          const table = await fetchUserTable(currentUser.uid);
          setTableData(table);
        } else {
          setTableData([]);
        }
      });
      return () => unsubscribe();
    });
  }, []);

  const onNewEntry = async (entry: BudgetTableData) => {
    asyncFunctionWrapper(async () => {
      if (user) {
        const _newEntry = {
          ...entry,
          id: tableData.length + 1,
        };
        const table = await addEntryToTable(user.uid, _newEntry);
        setTableData(table);
      }
    });
  };

  const onEditEntry = async (entry: BudgetTableData) => {
    asyncFunctionWrapper(async () => {
      if (user) {
        const table = await updateEntryInTable(user.uid, entry, tableData);
        setTableData(table);
      }
    });
  };

  const onDeleteEntry = async () => {
    asyncFunctionWrapper(async () => {
      if (user) {
        const table = await deleteEntryFromTable(
          user.uid,
          currentEntry.id,
          tableData
        );
        setTableData(table);
      }
    });
  };

  const logout = async () => {
    asyncFunctionWrapper(async () => {
      await auth.signOut();
      setUser(null);
      setTableData([]);
    });
  };

  const handleTableAction = (
    action: BudgetTableActionEnum,
    entry: BudgetTableData
  ) => {
    setCurrentEntry(entry);
    switch (action) {
      case BudgetTableActionEnum.EDIT:
        setIsEditEntryModalOpen(true);
        break;
      case BudgetTableActionEnum.DELETE:
        setIsDeleteEntryModalOpen(true);
        break;
      case BudgetTableActionEnum.CREATE:
        setIsNewEntryModalOpen(true);
        break;
      default:
        break;
    }
  };

  const asyncFunctionWrapper = async (func: () => Promise<unknown>) => {
    setIsLoading(true);
    await func();
    setTimeout(() => {
      setIsLoading(false);
    }, 200);
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
            <div className="flex justify-between mt-8">
              <Totalizers
                income={reduceTablePriceByType(BudgetTableTypeEnum.INCOME)}
                expense={reduceTablePriceByType(BudgetTableTypeEnum.EXPENSE)}
              />
            </div>
            <div className="flex gap-8 h-auto">
              <div className="w-2/3 my-4">
                <BudgetTable
                  rows={tableData}
                  itemsPerPage={10}
                  onAction={handleTableAction}
                />
              </div>
              <div className="w-1/3 h-[624px]">
                <Chart tableData={tableData} />
              </div>
            </div>
          </>
        )}
      </div>

      <Modal
        isOpen={isDeleteEntryModalOpen}
        title="Delete Entry"
        onConfirm={() => {
          setIsDeleteEntryModalOpen(false);
          onDeleteEntry();
        }}
        onCancel={() => setIsDeleteEntryModalOpen(false)}
      >
        <p>
          Are you sure you want to delete this entry? This action cannot be
          undone
        </p>
      </Modal>

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

      {isLoading && <Loader />}
    </>
  );
}

export default App;
