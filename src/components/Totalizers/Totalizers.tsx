type TotalizersProps = {
  income: number;
  expense: number;
};

const Totalizers: React.FC<TotalizersProps> = ({ income, expense }) => {
  const data = [
    {
      label: "Balance",
      value: income - expense,
      color: "#475569",
    },
    {
      label: "Income",
      value: income,
      color: "#166534",
    },
    {
      label: "Expense",
      value: expense,
      color: "#991b1b",
    },
  ];

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="flex gap-8">
      {data.map((item) => (
        <div className="flex flex-col" key={item.label}>
          <span className="text-base text-slate-800">{item.label}</span>
          <span className="text-2xl font-light" style={{ color: item.color }}>
            {formatNumber(item.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Totalizers;
