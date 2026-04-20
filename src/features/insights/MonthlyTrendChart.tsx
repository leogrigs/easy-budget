import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatBRL, formatBRLCompact, formatMonthLabel } from "./formatBRL";
import type { MonthlyTotal } from "./aggregate";

interface MonthlyTrendChartProps {
  data: MonthlyTotal[];
}

const config: ChartConfig = {
  total: { label: "Total", color: "hsl(var(--primary))" },
};

const MonthlyTrendChart = ({ data }: MonthlyTrendChartProps) => {
  const rows = data.map((d) => ({ ...d, label: formatMonthLabel(d.month) }));
  return (
    <ChartContainer config={config} className="aspect-auto h-[240px] w-full">
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
        <Bar
          dataKey="total"
          fill="var(--color-total)"
          radius={[6, 6, 0, 0]}
          maxBarSize={48}
        />
      </BarChart>
    </ChartContainer>
  );
};

export default MonthlyTrendChart;
