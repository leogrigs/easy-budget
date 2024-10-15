import React, { useState } from "react";
import { BudgetTableRow } from "./BudgetTable.types";

const BudgetTable: React.FC = () => {
  const [rows, setRows] = useState([
    { quantity: 0, category: "none" },
  ] as BudgetTableRow[]);

  const addRow = (row: BudgetTableRow) => {
    setRows([...rows, row]);
  };

  return (
    <>
      <button onClick={() => addRow({ category: "test", quantity: 30 })}>
        Add row
      </button>

      <table className="size-20">
        <thead>
          <tr>
            <th className="border">Quantity</th>
            <th className="border">Category</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr>
              <td className="border">{row.quantity}</td>
              <td className="border">{row.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default BudgetTable;
