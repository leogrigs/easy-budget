import React from "react";
import deleteImage from "../../assets/delete.svg";
import editImage from "../../assets/edit.svg";
import { BudgetTableActionEnum } from "../../enums/BudgetTableAction.enum";
import { BudgetTableCategoryEnum } from "../../enums/BudgetTableCategory.enum";
import { BudgetTableHeaderEnum } from "../../enums/BudgetTableHeader.enum";
import {
  BudgetTableData,
  BudgetTableHeader,
} from "../../interfaces/BudgetTable.interface";
import Button from "../Button";
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
          <span className="text-slate-800 dark:text-slate-200 text-sm sm:text-base truncate">
            {row[header.key as keyof BudgetTableData]}
          </span>
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
            <Button
              label=""
              onClick={() => onClick(BudgetTableActionEnum.EDIT, row)}
              icon={<img src={editImage} alt="edit entry" />}
            />

            <Button
              label=""
              onClick={() => onClick(BudgetTableActionEnum.DELETE, row)}
              icon={
                <img
                  src={deleteImage}
                  alt="delete entry"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                />
              }
            />
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
