import React, { useState } from "react";
import { BUDGET_TABLE_HEADERS } from "../../consts/headers.options";
import { BudgetTableActionEnum } from "../../enums/BudgetTableAction.enum";
import { BudgetTableData } from "../../interfaces/BudgetTable.interface";
import BudgetTableCell from "../BudgetTableCell";
import NoResults from "../NoResults";
import Paginator from "../Paginator";

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

  const paginateTable = (): BudgetTableData[] => {
    return rows.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  };

  const totalPages = Math.ceil(rows.length / itemsPerPage);

  return (
    <>
      {paginateTable().length === 0 ? (
        <div className="min-h-[452px] flex items-center justify-center mt-12">
          <NoResults />
        </div>
      ) : (
        <>
          <div className="min-h-[452px] overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {headers.map((header) => (
                    <th
                      className="border-b p-4 dark:border-slate-700 dark:text-slate-300 text-left"
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
                  <tr
                    className="hover:bg-slate-50 dark:hover:bg-slate-800"
                    key={row.id}
                  >
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
