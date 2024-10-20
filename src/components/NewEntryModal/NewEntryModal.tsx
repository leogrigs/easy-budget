import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import React, { useState } from "react";
import Input from "../Input";
import Select from "../Select";
import { CATEGORY_OPTIONS } from "../../consts/category.options";
import { TYPE_OPTIONS } from "../../consts/type.options";

type NewEntryModalProps = {
  onNewEntry: (data: any) => void;
};

const NewEntryModal: React.FC<NewEntryModalProps> = ({ onNewEntry }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    date: "",
    category: "food",
    type: "expense",
    bank: "itau",
  });

  const handleFormChanges = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <>
      <button onClick={open}>New entry</button>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/30" />

        <div className="fixed inset-0 flex w-screen items-center justify-center rad p-4">
          <DialogPanel className="w-1/2 max-w-lg space-y-4 border rounded bg-white p-4">
            <DialogTitle>New entry</DialogTitle>

            {/* Form */}
            <form className="flex flex-col gap-4">
              <div className="w-full max-w-sm min-w-[200px]">
                <label className="block mb-2 text-sm text-slate-600">
                  Name
                </label>
                <Input
                  value={formData.name}
                  placeholder="Entry name"
                  onChange={handleFormChanges}
                  name="name"
                />
              </div>

              <div className="w-full max-w-sm min-w-[200px]">
                <label className="block mb-2 text-sm text-slate-600">
                  Price
                </label>
                <Input
                  value={formData.price}
                  type="number"
                  placeholder="Entry price"
                  onChange={handleFormChanges}
                  name="price"
                />
              </div>

              <div className="w-full max-w-sm min-w-[200px]">
                <label className="block mb-2 text-sm text-slate-600">
                  Date
                </label>
                <Input
                  value={formData.date}
                  type="text"
                  placeholder="dd/mm/yyyy"
                  onChange={handleFormChanges}
                  name="date"
                />
              </div>

              <div className="w-full max-w-sm min-w-[200px]">
                <label className="block mb-2 text-sm text-slate-600">
                  Category
                </label>
                <Select
                  options={CATEGORY_OPTIONS}
                  value={formData.category}
                  onChange={handleFormChanges}
                  name="category"
                />
              </div>

              <div className="w-full max-w-sm min-w-[200px]">
                <label className="block mb-2 text-sm text-slate-600">
                  Type
                </label>
                <Select
                  options={TYPE_OPTIONS}
                  value={formData.type}
                  onChange={handleFormChanges}
                  name="type"
                />
              </div>
            </form>

            {/* Actions */}
            <div className="flex gap-2 justify-between">
              <button
                onClick={close}
                className="mt-4 w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={() => onNewEntry(formData)}
                className="mt-4 w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                Create
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default NewEntryModal;
