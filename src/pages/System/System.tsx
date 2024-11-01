// react-ts component template
import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import BudgetTable from "../../components/BudgetTable";
import Chart from "../../components/Chart";
import EntryModal from "../../components/EntryModal";
import Modal from "../../components/Modal";
import Totalizers from "../../components/Totalizers";
import { NEW_ENTRY } from "../../consts/entry.options";
import { useLoading } from "../../contexts/LoadingContext";
import { BudgetTableActionEnum } from "../../enums/BudgetTableAction.enum";
import { BudgetTableTypeEnum } from "../../enums/BudgetTableType.enum";
import { BudgetTableData } from "../../interfaces/BudgetTable.interface";
import {
  addEntryToTable,
  deleteEntryFromTable,
  fetchUserTable,
  initializeUserDocument,
  updateEntryInTable,
} from "../../services/firestore";
import { BudgetTableType } from "../../types/BudgetTableType.type";

interface SsytemProps {
  user: User | null;
}

const System: React.FC<SsytemProps> = ({ user }) => {
  const [tableData, setTableData] = useState<BudgetTableData[]>([]);
  const [currentEntry, setCurrentEntry] = useState(NEW_ENTRY);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState("");
  const { setLoading } = useLoading();

  useEffect(() => {
    asyncFunctionWrapper(async () => {
      if (user) {
        await initializeUserDocument(user.uid);
        const table = await fetchUserTable(user.uid);
        setTableData(table);
      } else {
        setTableData([]);
      }
    });
  }, [user]);

  const reduceTablePriceByType = (type: BudgetTableType) =>
    tableData.reduce((acc, curr) => {
      if (curr.type === type) {
        return acc + curr.price;
      }
      return acc;
    }, 0);

  const handleTableAction = (
    action: BudgetTableActionEnum,
    entry: BudgetTableData
  ) => {
    setCurrentEntry(entry);
    setIsEntryModalOpen(action);
  };

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

  const asyncFunctionWrapper = async (func: () => Promise<unknown>) => {
    setLoading(true);
    await func();
    setTimeout(() => {
      setLoading(false);
    }, 200);
  };

  return (
    <>
      <div className="flex-grow">
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

        <Modal
          isOpen={isEntryModalOpen === BudgetTableActionEnum.DELETE}
          title="Delete Entry"
          onConfirm={() => {
            setIsEntryModalOpen(BudgetTableActionEnum.NONE);
            onDeleteEntry();
          }}
          onCancel={() => setIsEntryModalOpen(BudgetTableActionEnum.NONE)}
        >
          <p>
            Are you sure you want to delete this entry? This action cannot be
            undone
          </p>
        </Modal>

        <EntryModal
          isOpen={isEntryModalOpen === BudgetTableActionEnum.CREATE}
          title="New Entry"
          onConfirm={onNewEntry}
          entry={currentEntry}
          closeModal={() => setIsEntryModalOpen(BudgetTableActionEnum.NONE)}
        />

        <EntryModal
          isOpen={isEntryModalOpen === BudgetTableActionEnum.EDIT}
          title="Edit Entry"
          entry={currentEntry}
          onConfirm={onEditEntry}
          closeModal={() => setIsEntryModalOpen(BudgetTableActionEnum.NONE)}
        />
      </div>
    </>
  );
};

export default System;
