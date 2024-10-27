import React, { useState } from "react";
import { BUDGET_TABLE_HEADERS } from "../../consts/headers.options";
import { BudgetTableActionEnum } from "../../enums/BudgetTableAction.enum";
import { BudgetTableData } from "../../interfaces/BudgetTable.interface";
import BudgetTableCell from "../BudgetTableCell";
import Input from "../Input";
import NoResults from "../NoResults";
import Paginator from "../Paginator";

type BudgetTableProps = {
  rows: BudgetTableData[];
  itemsPerPage: number;
  onAction: (action: BudgetTableActionEnum, data?: BudgetTableData) => void;
};

const BudgetTable: React.FC<BudgetTableProps> = ({
  rows,
  itemsPerPage,
  onAction,
}) => {
  const headers = BUDGET_TABLE_HEADERS;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const filteredTable = (): BudgetTableData[] => {
    return rows.filter((row) =>
      Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(search.toLowerCase())
      )
    );
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
        <div className="relative w-full">
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
        <button
          onClick={() => onAction(BudgetTableActionEnum.CREATE)}
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
                      className="text-start border p-2 bg-slate-100"
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
