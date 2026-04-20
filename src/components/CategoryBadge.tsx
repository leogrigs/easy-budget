import { CategoryIcon } from "./CategoryIcon";
import { contrastingText } from "../lib/categoryPalette";
import type { Category } from "../types/expense";

interface CategoryBadgeProps {
  category: Category | undefined;
  className?: string;
}

const CategoryBadge = ({ category, className }: CategoryBadgeProps) => {
  if (!category) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
        Uncategorized
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${className ?? ""}`}
      style={{
        backgroundColor: category.color,
        color: contrastingText(category.color),
      }}
    >
      <CategoryIcon name={category.icon} className="h-3 w-3" />
      {category.name}
    </span>
  );
};

export default CategoryBadge;
