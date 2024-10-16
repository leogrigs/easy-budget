import React from "react";
import { BudgetTableRow } from "./BudgetTable.types";

type BudgetTableProps = {
  rows: BudgetTableRow[];
};

const BudgetTable: React.FC<BudgetTableProps> = ({ rows }) => {
  const headers = Object.keys(rows[0]);

  return (
    <>
      <table className="size-20">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((value, index) => (
                <td key={index}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default BudgetTable;
