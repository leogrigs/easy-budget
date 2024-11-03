import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import React from "react";
import Button from "../Button";

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  isConfirmDisabled?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  children,
  isConfirmDisabled = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog open={isOpen} onClose={onCancel} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-full max-w-lg space-y-4 border rounded bg-white p-4 shadow-lg dark:bg-gray-800 dark:border-gray-700">
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-200">
            {title}
          </DialogTitle>

          <div className="text-gray-700 dark:text-gray-300">{children}</div>

          {/* Actions */}
          <div className="flex gap-2 justify-between">
            <Button label="Cancel" onClick={onCancel} />
            <Button
              label="Confirm"
              onClick={onConfirm}
              disabled={isConfirmDisabled}
            />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default Modal;
