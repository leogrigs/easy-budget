import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  delta?: number | null;
  deltaHint?: string;
  accent?: { color: string; name: string };
  index?: number;
}

const formatDelta = (pct: number): string => {
  const abs = Math.abs(pct) * 100;
  return `${abs >= 100 ? abs.toFixed(0) : abs.toFixed(1)}%`;
};

const KpiCard = ({
  label,
  value,
  icon: Icon,
  delta,
  deltaHint,
  accent,
  index = 0,
}: KpiCardProps) => {
  const showDelta = delta !== undefined && delta !== null;
  const up = showDelta && (delta as number) > 0;
  const down = showDelta && (delta as number) < 0;

  return (
    <div
      className="rounded-lg border border-border bg-card text-card-foreground p-5 flex items-start justify-between transition-colors hover:border-primary/30 animate-in fade-in-0 slide-in-from-bottom-2 duration-300 fill-mode-both"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex flex-col min-w-0">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="mt-1 text-2xl font-semibold tracking-tight tabular-nums truncate">
          {value}
        </span>
        {accent ? (
          <span className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground truncate">
            <span
              className="h-2 w-2 rounded-[2px] shrink-0"
              style={{ backgroundColor: accent.color }}
            />
            {accent.name}
          </span>
        ) : showDelta ? (
          <span
            className={cn(
              "mt-1 inline-flex items-center gap-1 text-xs font-medium",
              up && "text-emerald-600 dark:text-emerald-400",
              down && "text-destructive",
              !up && !down && "text-muted-foreground"
            )}
          >
            {up && <ArrowUpRight className="h-3 w-3" />}
            {down && <ArrowDownRight className="h-3 w-3" />}
            {formatDelta(delta as number)}
            {deltaHint && (
              <span className="text-muted-foreground font-normal">
                {" "}
                {deltaHint}
              </span>
            )}
          </span>
        ) : deltaHint ? (
          <span className="mt-1 text-xs text-muted-foreground">
            {deltaHint}
          </span>
        ) : null}
      </div>
      <div className="rounded-md bg-primary/10 text-primary p-2 shrink-0 ml-3">
        <Icon className="h-4 w-4" />
      </div>
    </div>
  );
};

export default KpiCard;
