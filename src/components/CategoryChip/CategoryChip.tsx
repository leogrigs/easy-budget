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
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200";
      case BudgetTableCategoryEnum.FOOD:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200";
      case BudgetTableCategoryEnum.TRANSPORT:
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-800 dark:text-cyan-200";
      case BudgetTableCategoryEnum.ENTERTAINMENT:
        return "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200";
      case BudgetTableCategoryEnum.MISCELLENEOUS:
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-200";
      case BudgetTableCategoryEnum.OTHER:
      default:
        return "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="flex justify-start items-center space-x-3">
      <span
        className={`py-1 px-2.5 rounded-full font-medium ${getColorClasses()} transition-colors`}
      >
        {label}
      </span>
    </div>
  );
};

export default CategoryChip;
