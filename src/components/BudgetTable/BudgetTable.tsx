import React from "react";

type BudgetTableProps = {
  rows: Array<object>;
};

const BudgetTable: React.FC<BudgetTableProps> = ({ rows }) => {
  const headers = Object.keys(rows[0]);

  return (
    <>
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
          {rows.map((row, index) => (
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
    </>
  );
};

export default BudgetTable;
