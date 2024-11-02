import { ResponsivePie } from "@nivo/pie";
import React from "react";
import { BudgetTableCategoryEnum } from "../../enums/BudgetTableCategory.enum";
import { BudgetTableData } from "../../interfaces/BudgetTable.interface";

interface ChartProps {
  tableData: BudgetTableData[];
}

interface PieData {
  id: string;
  label: string;
  value: number;
  color?: string;
}

const Chart: React.FC<ChartProps> = ({ tableData }) => {
  const getColorByCategory = (category: string) => {
    switch (category) {
      case BudgetTableCategoryEnum.SALARY:
        return "#22c55e";
      case BudgetTableCategoryEnum.FOOD:
        return "#eab308";
      case BudgetTableCategoryEnum.TRANSPORT:
        return "#06b6d4";
      case BudgetTableCategoryEnum.ENTERTAINMENT:
        return "#a855f7";
      case BudgetTableCategoryEnum.MISCELLENEOUS:
        return "#6366f1";
      case BudgetTableCategoryEnum.OTHER:
      default:
        return "#6b7280";
    }
  };

  const data = tableData.reduce((acc, curr) => {
    const index = acc.findIndex((item) => item.id === curr.category);
    if (index === -1) {
      acc.push({
        id: curr.category,
        label: curr.category,
        value: curr.price,
        color: getColorByCategory(curr.category),
      });
    } else {
      acc[index].value = parseFloat((acc[index].value + curr.price).toFixed(2));
    }
    return acc;
  }, [] as PieData[]);

  const renderPie = () => (
    <ResponsivePie
      data={data}
      margin={{ top: 0, right: 40, bottom: 120, left: 24 }}
      innerRadius={0.3}
      activeOuterRadiusOffset={4}
      enableArcLabels={true}
      arcLabelsTextColor={"#fff"}
      enableArcLinkLabels={false}
      colors={{ datum: "data.color" }}
      padAngle={0.5}
      cornerRadius={5}
    />
  );

  return <>{renderPie()}</>;
};

export default Chart;
