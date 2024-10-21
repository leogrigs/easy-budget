type TotalizersProps = {
  income: number;
  expense: number;
};

const Totalizers: React.FC<TotalizersProps> = ({ income, expense }) => {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col">
        <span>Balance</span>
        <span>
          <span>BRL</span> {income - expense}
        </span>
      </div>

      <div className="flex flex-col">
        <span>Income</span>
        <span>
          <span>BRL</span> {income}
        </span>
      </div>

      <div className="flex flex-col">
        <span>Expense</span>
        <span>
          <span>BRL</span> {expense}
        </span>
      </div>
    </div>
  );
};

export default Totalizers;
