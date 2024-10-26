import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import React, { useState } from "react";
import { BudgetTableTypeEnum } from "../../enums/BudgetTableType.enum";
import { BudgetTableData } from "../../interfaces/BudgetTable.interface";
import EntryForm from "../EntryForm";

type NewEntryModalProps = {
  onNewEntry: (data: BudgetTableData) => void;
};

const NewEntryModal: React.FC<NewEntryModalProps> = ({ onNewEntry }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    price: 0,
    date: "",
    category: "food",
    type: BudgetTableTypeEnum.EXPENSE,
  });

  const handleFormChanges = (name: string, value: string | number) => {
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
            <EntryForm entry={formData} handleChanges={handleFormChanges} />

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
                onClick={() => {
                  onNewEntry(formData as BudgetTableData);
                  close();
                }}
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
