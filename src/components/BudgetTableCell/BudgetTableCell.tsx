import React from "react";
import deleteImage from "../../assets/delete.svg";
import editImage from "../../assets/edit.svg";
import { BudgetTableActionEnum } from "../../enums/BudgetTableAction.enum";
import { BudgetTableCategoryEnum } from "../../enums/BudgetTableCategory.enum";
import { BudgetTableHeaderEnum } from "../../enums/BudgetTableHeader.enum";
import { BudgetTableTypeEnum } from "../../enums/BudgetTableType.enum";
import {
  BudgetTableData,
  BudgetTableHeader,
} from "../../interfaces/BudgetTable.interface";
import CategoryChip from "../CategoryChip";

interface BudgetTableCellProps {
  header: BudgetTableHeader;
  row: BudgetTableData;
  onClick: (action: BudgetTableActionEnum, entry: BudgetTableData) => void;
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
          <div className="flex items-center gap-2 sm:gap-4">
            <div
              className={`w-3 h-3 border-2 rounded-full ${
                row.type === BudgetTableTypeEnum.EXPENSE
                  ? "bg-red-500 border-red-300 dark:border-red-700"
                  : "bg-green-500 border-green-300 dark:border-green-700"
              }`}
            ></div>
            <span className="text-slate-800 dark:text-slate-200 text-sm sm:text-base truncate">
              {row[header.key as keyof BudgetTableData]}
            </span>
          </div>
        );

      case BudgetTableHeaderEnum.PRICE:
        return (
          <div className="text-right">
            <span className="text-slate-800 dark:text-slate-200 font-medium text-sm sm:text-base">
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(row.price)}
            </span>
          </div>
        );

      case BudgetTableHeaderEnum.ACTIONS:
        return (
          <div className="flex justify-end items-center gap-1 sm:gap-2">
            {/* Edit Button */}
            <button
              onClick={() => onClick(BudgetTableActionEnum.EDIT, row)}
              className="p-2 rounded-full group duration-300 flex items-center bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
            >
              <img
                src={editImage}
                alt="edit entry"
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
            </button>

            {/* Delete Button */}
            <button
              onClick={() => onClick(BudgetTableActionEnum.DELETE, row)}
              className="p-2 rounded-full group duration-300 flex items-center bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
            >
              <img
                src={deleteImage}
                alt="delete entry"
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
            </button>
          </div>
        );

      case BudgetTableHeaderEnum.DATE:
        return (
          <span className="text-slate-700 dark:text-slate-300 text-sm sm:text-base">
            {new Date(row.date).toLocaleDateString()}
          </span>
        );

      case BudgetTableHeaderEnum.CATEGORY:
      default:
        return (
          <CategoryChip
            label={row[header.key as keyof BudgetTableData] as string}
            category={row.category as BudgetTableCategoryEnum}
          />
        );
    }
  };

  return (
    <td className="p-2 sm:p-4 text-xs sm:text-sm md:text-base">
      {renderCell()}
    </td>
  );
};

export default BudgetTableCell;
