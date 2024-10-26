import React, { useState } from "react";
import { BudgetTableTypeEnum } from "../../enums/BudgetTableType.enum";
import { BudgetTableData } from "../../interfaces/BudgetTable.interface";
import EntryForm from "../EntryForm";
import Modal from "../Modal";

type EntryModalProps = {
  onNewEntry: (data: BudgetTableData) => void;
};

const EntryModal: React.FC<EntryModalProps> = ({ onNewEntry }) => {
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

  return (
    <>
      <button
        className="mt-4 w-fit rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        onClick={() => setIsOpen(true)}
      >
        New Entry
      </button>
      <Modal
        isOpen={isOpen}
        title="New Entry"
        onConfirm={() => {
          setIsOpen(false);
          onNewEntry(formData);
        }}
        onCancel={() => setIsOpen(false)}
      >
        <EntryForm entry={formData} handleChanges={handleFormChanges} />
      </Modal>
    </>
  );
};

export default EntryModal;
