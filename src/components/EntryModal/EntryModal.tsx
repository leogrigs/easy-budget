import React, { useState } from "react";
import { BudgetTableTypeEnum } from "../../enums/BudgetTableType.enum";
import { BudgetTableData } from "../../interfaces/BudgetTable.interface";
import EntryForm from "../EntryForm";
import Modal from "../Modal";

type EntryModalProps = {
  isOpen: boolean;
  title: string;
  onConfirm: (data: BudgetTableData) => void;
  closeModal: () => void;
};

const EntryModal: React.FC<EntryModalProps> = ({
  isOpen,
  title,
  onConfirm,
  closeModal,
}) => {
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
    <Modal
      isOpen={isOpen}
      title={title}
      onConfirm={() => {
        closeModal();
        onConfirm(formData);
      }}
      onCancel={() => closeModal()}
    >
      <EntryForm entry={formData} handleChanges={handleFormChanges} />
    </Modal>
  );
};

export default EntryModal;
