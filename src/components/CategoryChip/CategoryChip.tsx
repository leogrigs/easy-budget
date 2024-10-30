// react-ts component template
import React from "react";
import { BudgetTableCategoryEnum } from "../../enums/BudgetTableCategory.enum";

interface CategoryChipProps {
  category: BudgetTableCategoryEnum;
  label: string;
}

const CategoryChip: React.FC<CategoryChipProps> = ({ category, label }) => {
  const getColorClasses = () => {
    switch (category) {
      case BudgetTableCategoryEnum.SALARY:
        return "bg-green-100 text-green-800";
      case BudgetTableCategoryEnum.FOOD:
        return "bg-yellow-100 text-yellow-800";
      case BudgetTableCategoryEnum.TRANSPORT:
        return "bg-cyan-100 text-cyan-800";
      case BudgetTableCategoryEnum.ENTERTAINMENT:
        return "bg-purple-100 text-purple-800";
      case BudgetTableCategoryEnum.MISCELLENEOUS:
        return "bg-indigo-100 text-indigo-800";
      case BudgetTableCategoryEnum.OTHER:
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="flex justify-start items-center space-x-3">
      <span
        className={`py-1 px-2.5 border-none rounded-full font-medium ${getColorClasses()}`}
      >
        {label}
      </span>
    </div>
  );
};

export default CategoryChip;
