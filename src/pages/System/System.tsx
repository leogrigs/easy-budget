import { User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import BudgetTable from "../../components/BudgetTable";
import Button from "../../components/Button";
import Chart from "../../components/Chart";
import EntryModal from "../../components/EntryModal";
import Input from "../../components/Input";
import Modal from "../../components/Modal";
import Select from "../../components/Select";
import Totalizers from "../../components/Totalizers";
import { NEW_ENTRY } from "../../consts/entry.options";
import { MONTH_OPTIONS } from "../../consts/month.options";
import { useLoading } from "../../contexts/LoadingContext";
import { BudgetTableActionEnum } from "../../enums/BudgetTableAction.enum";
import { BudgetTableTypeEnum } from "../../enums/BudgetTableType.enum";
import { BudgetTableData } from "../../interfaces/BudgetTable.interface";
import { InputOptions } from "../../interfaces/InputOptions.interface";
import {
  addEntryToTable,
  deleteEntryFromTable,
  fetchUserTable,
  initializeUserDocument,
  updateEntryInTable,
} from "../../services/firestore";
import { BudgetTableType } from "../../types/BudgetTableType.type";

interface SystemProps {
  user: User | null;
}

const System: React.FC<SystemProps> = ({ user }) => {
  const [tableData, setTableData] = useState<BudgetTableData[]>([]);
  const [currentEntry, setCurrentEntry] = useState(NEW_ENTRY);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState("");
  const { setLoading } = useLoading();
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const years = tableData.reduce(
    (acc, row) => {
      const year = new Date(row.date).getFullYear();
      if (!acc.some((item) => item.value === year))
        acc.push({
          id: year.toString(),
          value: year,
          label: year.toString(),
        });
      return acc;
    },
    [{ id: "all_years", value: "", label: "All years" }] as InputOptions[]
  );

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

  const filteredTable = (): BudgetTableData[] => {
    return tableData.filter((row) => {
      const rowDate = new Date(row.date);
      const rowMonth = rowDate.getMonth() + 1;
      const rowYear = rowDate.getFullYear();

      const matchesSearch = Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(search.toLowerCase())
      );

      const matchesMonth = month === "" || rowMonth === +month;
      const matchesYear = year === "" || rowYear === +year;

      return matchesSearch && matchesMonth && matchesYear;
    });
  };

  const reduceTablePriceByType = (type: BudgetTableType) =>
    filteredTable().reduce((acc, curr) => {
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
    <main className="w-full flex-grow">
      <div className="flex flex-col sm:flex-row sm:justify-between mt-8 mb-12 md:my-2">
        <Totalizers
          income={reduceTablePriceByType(BudgetTableTypeEnum.INCOME)}
          expense={reduceTablePriceByType(BudgetTableTypeEnum.EXPENSE)}
        />
      </div>

      <div className="flex flex-col-reverse xl:flex-row gap-8">
        <div className="w-full xl:w-2/3 my-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-1/2 lg:w-3/5">
              <Input
                name="search"
                placeholder="Search by name"
                value={search}
                type="text"
                onChange={(_, value) => setSearch(value as string)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="absolute w-6 h-6 top-2 right-2 text-slate-400 dark:text-slate-500"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <div className="w-full sm:w-32 lg:w-48">
              <Select
                options={MONTH_OPTIONS}
                name="month_filter"
                value={month}
                onChange={(_, value) => setMonth(value)}
              />
            </div>

            <div className="w-full sm:w-28 lg:w-36">
              <Select
                options={years}
                name="year_filter"
                value={year}
                onChange={(_, value) => setYear(value)}
              />
            </div>

            <div>
              <Button
                label="New Entry"
                onClick={() =>
                  handleTableAction(BudgetTableActionEnum.CREATE, NEW_ENTRY)
                }
              />
            </div>
          </div>
          <BudgetTable
            rows={filteredTable()}
            itemsPerPage={10}
            onAction={handleTableAction}
          />
        </div>
        <div className="w-full xl:w-1/3 h-72 xl:h-[624px]">
          <Chart tableData={filteredTable()} />
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
          undone.
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
    </main>
  );
};

export default System;
