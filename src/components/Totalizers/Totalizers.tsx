type TotalizersProps = {
  income: number;
  expense: number;
};

const Totalizers: React.FC<TotalizersProps> = ({ income, expense }) => {
  return (
    <div>
      <div>Balance: {income - expense}</div>
      <div>Income: {income}</div>
      <div>Expenses: {expense}</div>
    </div>
  );
};

export default Totalizers;
