import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import React, { useRef } from "react";

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
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      className="relative z-50"
      initialFocus={cancelButtonRef} // Set initial focus
    >
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      <div className="fixed inset-0 flex w-screen items-center justify-center rad p-4">
        <DialogPanel className="w-1/2 max-w-lg space-y-4 border rounded bg-white p-4">
          <DialogTitle>{title}</DialogTitle>

          <div>{children}</div>

          {/* Actions */}
          <div className="flex gap-2 justify-between">
            <button
              ref={cancelButtonRef} // Reference to set initial focus
              onClick={onCancel}
              className="mt-4 w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
            >
              Cancel
            </button>
            <button
              disabled={isConfirmDisabled}
              onClick={onConfirm}
              className="mt-4 w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
            >
              Confirm
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default Modal;
