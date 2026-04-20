import { Cell, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatBRL } from "./formatBRL";
import type { CategoryTotal } from "./aggregate";

interface CategoryBreakdownChartProps {
  data: CategoryTotal[];
}

const CategoryBreakdownChart = ({ data }: CategoryBreakdownChartProps) => {
  const config: ChartConfig = Object.fromEntries(
    data.map((d) => [d.categoryId, { label: d.name, color: d.color }])
  );
  const grand = data.reduce((s, d) => s + d.total, 0);

  return (
    <div className="flex flex-col lg:flex-row items-center gap-4">
      <ChartContainer
        config={config}
        className="aspect-square h-[240px] w-[240px] shrink-0"
      >
        <PieChart>
          <ChartTooltip
            content={
              <ChartTooltipContent
                hideLabel
                valueFormatter={(v) => formatBRL(v)}
              />
            }
          />
          <Pie
            data={data}
            dataKey="total"
            nameKey="name"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            strokeWidth={2}
          >
            {data.map((d) => (
              <Cell key={d.categoryId} fill={d.color} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
      <ul className="flex-1 space-y-2 w-full">
        {data.map((d) => (
          <li
            key={d.categoryId}
            className="flex items-center gap-3 text-sm"
          >
            <span
              className="h-2.5 w-2.5 rounded-[3px] shrink-0"
              style={{ backgroundColor: d.color }}
            />
            <span className="flex-1 truncate">{d.name}</span>
            <span className="font-mono font-medium tabular-nums">
              {formatBRL(d.total)}
            </span>
            <span className="w-12 text-right text-muted-foreground tabular-nums">
              {grand > 0 ? `${Math.round(d.pct * 100)}%` : "—"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryBreakdownChart;
