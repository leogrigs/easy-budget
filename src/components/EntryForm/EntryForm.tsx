import { CATEGORY_OPTIONS } from "../../consts/category.options";
import { TYPE_OPTIONS } from "../../consts/type.options";
import { BudgetTableData } from "../../interfaces/BudgetTable.interface";
import Input from "../Input";
import Select from "../Select";

type EntryFormProps = {
  entry: BudgetTableData;
  handleChanges: (name: string, value: string | number) => void;
};

const EntryForm: React.FC<EntryFormProps> = ({ entry, handleChanges }) => {
  return (
    <form className="flex flex-col gap-4">
      <div className="w-full max-w-sm min-w-[200px]">
        <label className="block mb-2 text-sm text-slate-600">Name</label>
        <Input
          value={entry.name}
          placeholder="Entry name"
          onChange={handleChanges}
          name="name"
        />
      </div>

      <div className="w-full max-w-sm min-w-[200px]">
        <label className="block mb-2 text-sm text-slate-600">Price</label>
        <Input
          value={entry.price}
          type="number"
          placeholder="Entry price"
          onChange={handleChanges}
          name="price"
        />
      </div>

      <div className="w-full max-w-sm min-w-[200px]">
        <label className="block mb-2 text-sm text-slate-600">Date</label>
        <Input
          value={entry.date}
          type="date"
          placeholder="dd/mm/yyyy"
          onChange={handleChanges}
          name="date"
        />
      </div>

      <div className="w-full max-w-sm min-w-[200px]">
        <label className="block mb-2 text-sm text-slate-600">Category</label>
        <Select
          options={CATEGORY_OPTIONS}
          value={entry.category}
          onChange={handleChanges}
          name="category"
        />
      </div>

      <div className="w-full max-w-sm min-w-[200px]">
        <label className="block mb-2 text-sm text-slate-600">Type</label>
        <Select
          options={TYPE_OPTIONS}
          value={entry.type}
          onChange={handleChanges}
          name="type"
        />
      </div>
    </form>
  );
};

export default EntryForm;
