import React, { useState } from "react";
import { NEW_ENTRY } from "../../consts/entry.options";
import { BUDGET_TABLE_HEADERS } from "../../consts/headers.options";
import { MONTH_OPTIONS } from "../../consts/month.options";
import { BudgetTableActionEnum } from "../../enums/BudgetTableAction.enum";
import { BudgetTableData } from "../../interfaces/BudgetTable.interface";
import { InputOptions } from "../../interfaces/InputOptions.interface";
import BudgetTableCell from "../BudgetTableCell";
import Input from "../Input";
import NoResults from "../NoResults";
import Paginator from "../Paginator";
import Select from "../Select";

type BudgetTableProps = {
  rows: BudgetTableData[];
  itemsPerPage: number;
  onAction: (action: BudgetTableActionEnum, data: BudgetTableData) => void;
};

const BudgetTable: React.FC<BudgetTableProps> = ({
  rows,
  itemsPerPage,
  onAction,
}) => {
  const headers = BUDGET_TABLE_HEADERS;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const years = rows.reduce(
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
    [{ id: "all_years", value: "", label: "All" }] as InputOptions[]
  );

  const filteredTable = (): BudgetTableData[] => {
    return rows.filter((row) => {
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

  const paginateTable = (): BudgetTableData[] => {
    return filteredTable().slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );
  };

  const totalPages = Math.ceil(filteredTable().length / itemsPerPage);

  return (
    <>
      <div className="my-4 flex items-center gap-4">
        <div className="relative w-3/5">
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
            className="absolute w-8 h-8 top-2 right-0 text-slate-400"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="w-48">
          <Select
            options={MONTH_OPTIONS}
            name="month_filter"
            value={month}
            onChange={(_, value) => setMonth(value)}
          />
        </div>
        <div className="w-36">
          <Select
            options={years}
            name="year_filter"
            value={year}
            onChange={(_, value) => setYear(value)}
          />
        </div>
        <button
          onClick={() => onAction(BudgetTableActionEnum.CREATE, NEW_ENTRY)}
          className="whitespace-nowrap rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
        >
          New Entry
        </button>
      </div>
      {/* Handle empty state */}
      {paginateTable().length == 0 ? (
        <div className="min-h-[452px] flex items-center">
          <NoResults />
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="min-h-[452px]">
            <table className="size-full border-collapse">
              <thead>
                <tr>
                  {headers.map((header) => (
                    <th
                      className="border-b p-4"
                      // @ts-expect-error I don't have access to TextAlign interface
                      style={{ textAlign: header.align ?? "start" }}
                      key={header.key}
                    >
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginateTable().map((row) => (
                  <tr className="hover:bg-slate-50" key={row.id}>
                    {headers.map((header) => (
                      <BudgetTableCell
                        key={`${row.id}-${header.key}`}
                        onClick={onAction}
                        header={header}
                        row={row}
                      />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center my-4">
            <Paginator
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </>
  );
};

export default BudgetTable;
