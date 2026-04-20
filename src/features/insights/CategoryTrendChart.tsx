import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { Category } from "@/types/expense";
import type { MonthlyCategoryRow } from "./aggregate";
import { formatBRL, formatBRLCompact, formatMonthLabel } from "./formatBRL";

interface CategoryTrendChartProps {
  data: MonthlyCategoryRow[];
  categories: Category[];
}

const CategoryTrendChart = ({ data, categories }: CategoryTrendChartProps) => {
  const active = categories.filter((c) =>
    data.some((row) => (row[c.id] as number) > 0)
  );

  const config: ChartConfig = Object.fromEntries(
    active.map((c) => [c.id, { label: c.name, color: c.color }])
  );

  const rows = data.map((r) => ({
    ...r,
    label: formatMonthLabel(r.month as string),
  }));

  return (
    <ChartContainer config={config} className="aspect-auto h-[280px] w-full">
      <BarChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatBRLCompact(Number(v))}
          width={56}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent valueFormatter={(v) => formatBRL(v)} />
          }
        />
        {active.map((c, i) => (
          <Bar
            key={c.id}
            dataKey={c.id}
            stackId="total"
            fill={`var(--color-${c.id})`}
            radius={
              i === active.length - 1 ? [6, 6, 0, 0] : [0, 0, 0, 0]
            }
            maxBarSize={48}
          />
        ))}
        <ChartLegend content={<ChartLegendContent />} />
      </BarChart>
    </ChartContainer>
  );
};

export default CategoryTrendChart;
