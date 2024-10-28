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
          <div className="flex gap-4 items-center">
            <div
              className={`block size-3 border-2 rounded-full ${
                row.type === BudgetTableTypeEnum.EXPENSE
                  ? "bg-red-500 border-red-100"
                  : "bg-green-500 border-green-100"
              }`}
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
          <div className="flex justify-end items-center gap-2">
            <button
              onClick={() => onClick(BudgetTableActionEnum.EDIT, row)}
              className="rounded-full  group transition-all duration-500  flex item-center"
            >
              <img src={editImage} alt="edit entry" />
            </button>
            <button
              onClick={() => onClick(BudgetTableActionEnum.DELETE, row)}
              className="rounded-full  group transition-all duration-500  flex item-center"
            >
              <img src={deleteImage} alt="delete entry" />
            </button>
          </div>
        );

      case BudgetTableHeaderEnum.DATE:
        return <span>{new Date(row.date).toLocaleDateString()}</span>;

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

  return <td className="border-b p-4">{renderCell()}</td>;
};

export default BudgetTableCell;
