import { ResponsivePie } from "@nivo/pie";
import React from "react";
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
  const data = tableData.reduce((acc, curr) => {
    const index = acc.findIndex((item) => item.id === curr.category);
    if (index === -1) {
      acc.push({
        id: curr.category,
        label: curr.category,
        value: curr.price,
      });
    } else {
      acc[index].value = parseFloat((acc[index].value + curr.price).toFixed(2));
    }
    return acc;
  }, [] as PieData[]);

  const renderPie = () => (
    <ResponsivePie
      data={data}
      margin={{ top: 0, right: 12, bottom: 300, left: 12 }}
      innerRadius={0.5}
      cornerRadius={4}
      activeOuterRadiusOffset={4}
      colors={{ scheme: "set1" }}
      enableArcLinkLabels={false}
      enableArcLabels={false}
      legends={[
        {
          anchor: "bottom-left",
          direction: "column",
          translateX: 0,
          translateY: 132,
          itemsSpacing: 8,
          itemWidth: 50,
          itemHeight: 18,
          itemTextColor: "#999",
          itemDirection: "left-to-right",
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: "circle",
          effects: [
            {
              on: "hover",
              style: {
                itemTextColor: "#000",
              },
            },
          ],
        },
      ]}
    />
  );

  return <>{renderPie()}</>;
};

export default Chart;
