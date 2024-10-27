import React, { useEffect, useState } from "react";
import { BudgetTableData } from "../../interfaces/BudgetTable.interface";
import EntryForm from "../EntryForm";
import Modal from "../Modal";

type EntryModalProps = {
  isOpen: boolean;
  title: string;
  entry: BudgetTableData;
  onConfirm: (data: BudgetTableData) => void;
  closeModal: () => void;
};

const EntryModal: React.FC<EntryModalProps> = ({
  isOpen,
  title,
  entry,
  onConfirm,
  closeModal,
}) => {
  const [formData, setFormData] = useState(entry);

  useEffect(() => {
    setFormData(entry);
  }, [entry]);

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
