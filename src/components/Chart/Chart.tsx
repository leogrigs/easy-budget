import { ResponsivePie } from "@nivo/pie";
import React from "react";
import { BudgetTableCategoryEnum } from "../../enums/BudgetTableCategory.enum";
import { BudgetTableTypeEnum } from "../../enums/BudgetTableType.enum";
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
      margin={{ top: 0, right: 12, bottom: 120, left: 24 }}
      innerRadius={0.6}
      activeOuterRadiusOffset={4}
      enableArcLinkLabels={false}
      enableArcLabels={false}
      colors={{ datum: "data.color" }}
      layers={[
        "arcs",
        "legends",
        ({ centerX, centerY }) => (
          <text
            x={centerX}
            y={centerY}
            textAnchor="middle"
            dominantBaseline="central"
            style={{
              fontSize: "24px",
              fontWeight: "regular",
              fill: "#1e293b",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <tspan x={centerX} dy="-1rem">
              Expenses
            </tspan>
            <tspan x={centerX} dy="1.5em" style={{ fill: "#991b1b" }}>
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
                maximumFractionDigits: 2,
              }).format(
                tableData.reduce(
                  (acc, curr) =>
                    acc + curr.type !== BudgetTableTypeEnum.INCOME
                      ? curr.price
                      : 0,
                  0
                )
              )}
            </tspan>
          </text>
        ),
      ]}
    />
  );

  return <>{renderPie()}</>;
};

export default Chart;
