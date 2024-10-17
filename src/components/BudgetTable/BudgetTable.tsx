import React from "react";

type BudgetTableProps = {
  rows: Array<object>;
};

const BudgetTable: React.FC<BudgetTableProps> = ({ rows }) => {
  const headers = Object.keys(rows[0]);

  return (
    <>
      <table className="size-full">
        <thead>
          <tr>
            {headers.map((header) => (
              <th className="text-start" key={header}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((value, index) => (
                <td className="text-start" key={index}>
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
