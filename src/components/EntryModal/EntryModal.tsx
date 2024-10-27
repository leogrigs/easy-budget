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
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setFormData(entry);
  }, [entry]);

  useEffect(() => {
    const isValid = Object.values(formData).every(
      (value) => value !== "" && value !== 0
    );
    setIsFormValid(isValid);
  }, [formData]);

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
      isConfirmDisabled={!isFormValid}
    >
      <EntryForm entry={formData} handleChanges={handleFormChanges} />
    </Modal>
  );
};

export default EntryModal;
