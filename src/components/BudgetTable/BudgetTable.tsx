import React, { useState } from "react";
import { BUDGET_TABLE_HEADERS } from "../../consts/headers.options";
import { BudgetTableData } from "../../interfaces/BudgetTable.interface";
import BudgetTableCell from "../BudgetTableCell";
import Input from "../Input";
import NoResults from "../NoResults";
import Paginator from "../Paginator";

type BudgetTableProps = {
  rows: BudgetTableData[];
  itemsPerPage: number;
};

const BudgetTable: React.FC<BudgetTableProps> = ({ rows, itemsPerPage }) => {
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
      <div className="relative my-4">
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
                {paginateTable().map((row, index) => (
                  <tr className="hover:bg-slate-50" key={index}>
                    {headers.map((header) => (
                      <BudgetTableCell
                        onClick={(action: string) =>
                          console.log("action", action)
                        }
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
