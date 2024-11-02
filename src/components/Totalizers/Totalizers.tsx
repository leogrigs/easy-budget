import React from "react";

type TotalizersProps = {
  income: number;
  expense: number;
};

const Totalizers: React.FC<TotalizersProps> = ({ income, expense }) => {
  const data = [
    {
      label: "Balance",
      value: income - expense,
      colorClass: "text-slate-800 dark:text-slate-400",
    },
    {
      label: "Income",
      value: income,
      colorClass: "text-green-800 dark:text-green-400",
    },
    {
      label: "Expense",
      value: expense,
      colorClass: "text-red-800 dark:text-red-400",
    },
  ];

  const formatNumber = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  return (
    <div className="flex gap-8 justify-around py-4">
      {data.map((item) => (
        <div className="flex flex-col" key={item.label}>
          <span className="text-base font-light text-slate-600 dark:text-slate-300">
            {item.label}
          </span>
          <span className={`text-2xl ${item.colorClass}`}>
            {formatNumber(item.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Totalizers;
