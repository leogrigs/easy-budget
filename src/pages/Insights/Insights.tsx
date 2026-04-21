import { endOfMonth, startOfMonth } from "date-fns";
import {
  BarChart3,
  CalendarDays,
  CalendarIcon,
  Crown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import MonthSwitcher from "@/components/MonthSwitcher";
import { useCategories } from "@/hooks/useCategories";
import { useExpenses } from "@/hooks/useExpenses";
import { describePeriod } from "@/lib/describePeriod";
import {
  computeKpis,
  filterByPeriod,
  periodFromDateRange,
  sumByCategory,
  sumByMonth,
  sumByMonthAndCategory,
  topExpenses,
} from "@/features/insights/aggregate";
import CategoryBreakdownChart from "@/features/insights/CategoryBreakdownChart";
import CategoryTrendChart from "@/features/insights/CategoryTrendChart";
import KpiCard from "@/features/insights/KpiCard";
import MonthlyTrendChart from "@/features/insights/MonthlyTrendChart";
import TopExpensesList from "@/features/insights/TopExpensesList";
import { formatBRL } from "@/features/insights/formatBRL";

interface InsightsProps {
  uid: string;
}

const Insights = ({ uid }: InsightsProps) => {
  const { expenses: rawExpenses, loading: loadingExpenses } = useExpenses(uid);
  const { categories, byId, loading: loadingCategories } = useCategories(uid);
  const loading = loadingExpenses || loadingCategories;

  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const now = new Date();
    return { from: startOfMonth(now), to: endOfMonth(now) };
  });

  const expenses = useMemo(
    () => rawExpenses.filter((e) => !e.refunded),
    [rawExpenses]
  );

  const period = useMemo(
    () => periodFromDateRange(dateRange, new Date()),
    [dateRange]
  );
  const periodExpenses = useMemo(
    () => filterByPeriod(expenses, period),
    [expenses, period]
  );

  const kpis = useMemo(
    () => computeKpis(expenses, categories, period),
    [expenses, categories, period]
  );
  const monthly = useMemo(
    () => sumByMonth(periodExpenses, period),
    [periodExpenses, period]
  );
  const byCategory = useMemo(
    () => sumByCategory(periodExpenses, categories),
    [periodExpenses, categories]
  );
  const byMonthCategory = useMemo(
    () => sumByMonthAndCategory(periodExpenses, categories, period),
    [periodExpenses, categories, period]
  );
  const top = useMemo(() => topExpenses(periodExpenses, 5), [periodExpenses]);

  const header = (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Insights</h2>
        <p className="text-sm text-muted-foreground">
          See how your spending moves over time and across categories.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <MonthSwitcher value={dateRange} onChange={setDateRange} />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Custom date range"
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );

  const periodBanner = (
    <div>
      <h3 className="text-xl font-semibold tracking-tight">
        {describePeriod(dateRange).label}
      </h3>
      <p className="text-xs text-muted-foreground">
        Reference period for the charts below
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        {header}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[108px] rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-[280px] rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-[280px] rounded-lg" />
          <Skeleton className="h-[280px] rounded-lg" />
        </div>
      </div>
    );
  }

  if (rawExpenses.length === 0) {
    return (
      <div className="space-y-6">
        {header}
        <Card className="py-16">
          <CardContent className="flex flex-col items-center text-center gap-3">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <BarChart3 className="h-6 w-6" />
            </div>
            <p className="text-lg font-medium">Nothing to chart yet</p>
            <p className="text-sm text-muted-foreground max-w-sm">
              Add an expense to start seeing trends, categories, and your top
              spends.
            </p>
            <Button asChild>
              <Link to="/expenses">Go to Expenses</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {header}
      {periodBanner}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total"
          value={formatBRL(kpis.total)}
          icon={Wallet}
          delta={kpis.deltaPct}
          deltaHint="vs previous"
          index={0}
        />
        <KpiCard
          label="Previous period"
          value={formatBRL(kpis.previousTotal)}
          icon={CalendarDays}
          index={1}
        />
        <KpiCard
          label="Avg per day"
          value={formatBRL(kpis.avgPerDay)}
          icon={TrendingUp}
          index={2}
        />
        <KpiCard
          label="Top category"
          value={kpis.topCategory ? formatBRL(kpis.topCategory.total) : "—"}
          icon={Crown}
          accent={
            kpis.topCategory
              ? { color: kpis.topCategory.color, name: kpis.topCategory.name }
              : undefined
          }
          index={3}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly trend</CardTitle>
        </CardHeader>
        <CardContent>
          {monthly.length > 0 ? (
            <MonthlyTrendChart data={monthly} />
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No data for this period.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>By category</CardTitle>
          </CardHeader>
          <CardContent>
            {byCategory.length > 0 ? (
              <CategoryBreakdownChart data={byCategory} />
            ) : (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No data for this period.
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top 5 expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <TopExpensesList expenses={top} categoriesById={byId} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category trend</CardTitle>
        </CardHeader>
        <CardContent>
          {byMonthCategory.length > 0 && byCategory.length > 0 ? (
            <CategoryTrendChart
              data={byMonthCategory}
              categories={categories}
            />
          ) : (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No data for this period.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Insights;
