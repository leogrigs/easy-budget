import * as React from "react";
import { Legend, ResponsiveContainer, Tooltip } from "recharts";

import { cn } from "@/lib/utils";

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    color?: string;
  }
>;

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig;
    children: React.ReactElement;
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <ResponsiveContainer>{children}</ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = "Chart";

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(([, cfg]) => cfg.color);
  if (!colorConfig.length) return null;

  const body = colorConfig
    .map(([key, cfg]) => `  --color-${key}: ${cfg.color};`)
    .join("\n");

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `[data-chart=${id}] {\n${body}\n}`,
      }}
    />
  );
};

interface TooltipPayloadItem {
  name?: string | number;
  value?: number | string;
  dataKey?: string | number;
  color?: string;
  payload?: Record<string, unknown>;
}

interface ChartTooltipContentProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  className?: string;
  valueFormatter?: (value: number) => string;
  labelFormatter?: (value: string | number) => React.ReactNode;
}

const ChartTooltipContent = ({
  active,
  payload,
  label,
  hideLabel = false,
  hideIndicator = false,
  className,
  valueFormatter,
  labelFormatter,
}: ChartTooltipContentProps) => {
  const { config } = useChart();
  if (!active || !payload || payload.length === 0) return null;

  const renderedLabel =
    hideLabel || label === undefined
      ? null
      : labelFormatter
      ? labelFormatter(label)
      : label;

  return (
    <div
      className={cn(
        "grid min-w-[9rem] items-start gap-1.5 rounded-lg border border-border/50 bg-popover px-2.5 py-1.5 text-xs shadow-md",
        className
      )}
    >
      {renderedLabel !== null && (
        <div className="font-medium text-foreground">{renderedLabel}</div>
      )}
      <div className="grid gap-1.5">
        {payload.map((item, i) => {
          const key = String(item.dataKey ?? item.name ?? i);
          const itemConfig = config[key];
          const color = item.color ?? itemConfig?.color;
          const label = itemConfig?.label ?? item.name ?? key;
          const value =
            typeof item.value === "number"
              ? valueFormatter
                ? valueFormatter(item.value)
                : item.value.toLocaleString()
              : item.value;

          return (
            <div
              key={`${key}-${i}`}
              className="flex w-full items-center gap-2"
            >
              {!hideIndicator && (
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                  style={{ backgroundColor: color }}
                />
              )}
              <span className="flex-1 text-muted-foreground">{label}</span>
              {value !== undefined && value !== null && (
                <span className="font-mono font-medium tabular-nums text-foreground">
                  {value}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface LegendPayloadItem {
  value?: string | number;
  color?: string;
  dataKey?: string | number;
}

interface ChartLegendContentProps {
  payload?: LegendPayloadItem[];
  className?: string;
  hideIcon?: boolean;
}

const ChartLegendContent = ({
  payload,
  className,
  hideIcon = false,
}: ChartLegendContentProps) => {
  const { config } = useChart();
  if (!payload || payload.length === 0) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4 pt-3 flex-wrap text-xs",
        className
      )}
    >
      {payload.map((item, i) => {
        const key = String(item.dataKey ?? item.value ?? i);
        const itemConfig = config[key];
        const label = itemConfig?.label ?? item.value ?? key;
        return (
          <div
            key={`${key}-${i}`}
            className="flex items-center gap-1.5 text-muted-foreground"
          >
            {!hideIcon && (
              <span
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={{ backgroundColor: item.color }}
              />
            )}
            {label}
          </div>
        );
      })}
    </div>
  );
};

const ChartTooltip = Tooltip;
const ChartLegend = Legend;

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
};
