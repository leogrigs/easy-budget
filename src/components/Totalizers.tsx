import { Hash, Sigma, Wallet } from "lucide-react";

interface TotalizersProps {
  total: number;
  count: number;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const Totalizers = ({ total, count }: TotalizersProps) => {
  const average = count > 0 ? total / count : 0;

  const cards = [
    { label: "Total spent", value: formatCurrency(total), Icon: Wallet },
    { label: "Entries", value: String(count), Icon: Hash },
    { label: "Avg per entry", value: formatCurrency(average), Icon: Sigma },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
      {cards.map(({ label, value, Icon }, i) => (
        <div
          key={label}
          className="rounded-lg border border-border bg-card text-card-foreground p-5 flex items-start justify-between transition-colors hover:border-primary/30 animate-in fade-in-0 slide-in-from-bottom-2 duration-300 fill-mode-both"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">
              {value}
            </span>
          </div>
          <div className="rounded-md bg-primary/10 text-primary p-2">
            <Icon className="h-4 w-4" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Totalizers;
