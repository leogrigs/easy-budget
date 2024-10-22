import React, { useState } from "react";
import Paginator from "../Paginator";

type BudgetTableProps = {
  rows: Array<object>;
  itemsPerPage: number;
};

const BudgetTable: React.FC<BudgetTableProps> = ({ rows, itemsPerPage }) => {
  const headers = Object.keys(rows[0]);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(rows.length / itemsPerPage);

  const paginateTable = () => {
    return rows.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  };

  return (
    <>
      <div className="min-h-[452px]">
        <table className="size-full border-collapse">
          <thead>
            <tr>
              {headers.map((header) => (
                <th className="text-start border p-2 bg-slate-100" key={header}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginateTable().map((row, index) => (
              <tr className="hover:bg-slate-50" key={index}>
                {Object.values(row).map((value, index) => (
                  <td className="text-start border p-2" key={index}>
                    {value}
                  </td>
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
  );
};

export default BudgetTable;
