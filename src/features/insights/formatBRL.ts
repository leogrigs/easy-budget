const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export const formatBRL = (value: number): string => BRL.format(value);

const COMPACT_BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  notation: "compact",
  maximumFractionDigits: 1,
});

export const formatBRLCompact = (value: number): string =>
  COMPACT_BRL.format(value);

export const formatMonthLabel = (ym: string): string => {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(y, m - 1, 1);
  const label = d.toLocaleString("en-US", { month: "short" });
  const shortYear = String(y).slice(2);
  return `${label} ${shortYear}`;
};
