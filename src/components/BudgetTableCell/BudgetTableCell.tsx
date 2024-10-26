import React from "react";
import { BudgetTableHeaderEnum } from "../../enums/BudgetTableHeader.enum";
import { BudgetTableTypeEnum } from "../../enums/BudgetTableType.enum";
import {
  BudgetTableData,
  BudgetTableHeader,
} from "../../interfaces/BudgetTable.interface";

interface BudgetTableCellProps {
  header: BudgetTableHeader;
  row: BudgetTableData;
  onClick: (action: "edit" | "delete") => void;
}

const BudgetTableCell: React.FC<BudgetTableCellProps> = ({
  header,
  row,
  onClick,
}) => {
  const renderCell = () => {
    switch (header.key) {
      case BudgetTableHeaderEnum.NAME:
        return (
          <div className="flex gap-4 items-center">
            <div
              style={{
                backgroundColor:
                  row.type === BudgetTableTypeEnum.INCOME
                    ? "#ef4444"
                    : "#22c55e",
                border: `3px solid ${
                  row.type === BudgetTableTypeEnum.INCOME
                    ? "#f87171"
                    : "#4ade80"
                }`,
              }}
              className="block size-3 rounded-full"
            ></div>
            <span>{row[header.key as keyof BudgetTableData]}</span>
          </div>
        );

      case BudgetTableHeaderEnum.PRICE:
        return (
          <div className="text-right">
            <span>
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(row.price)}
            </span>
          </div>
        );

      case BudgetTableHeaderEnum.ACTIONS:
        return (
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => onClick("edit")}
              className="rounded-full  group transition-all duration-500  flex item-center"
            >
              <img src="src/assets/edit.svg" alt="edit entry" />
            </button>
            <button
              onClick={() => onClick("delete")}
              className="rounded-full  group transition-all duration-500  flex item-center"
            >
              <img src="src/assets/delete.svg" alt="delete entry" />
            </button>
          </div>
        );

      case BudgetTableHeaderEnum.CATEGORY:
      case BudgetTableHeaderEnum.DATE:
      default:
        return <span>{row[header.key as keyof BudgetTableData]}</span>;
    }
  };

  return (
    <td className="border p-2" key={header.key}>
      {renderCell()}
    </td>
  );
};

export default BudgetTableCell;
