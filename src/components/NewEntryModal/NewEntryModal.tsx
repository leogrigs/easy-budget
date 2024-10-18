import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Field,
  Fieldset,
  Input,
  Label,
  Select,
} from "@headlessui/react";
import React from "react";

const NewEntryModal: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

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

        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
            <DialogTitle>New entry</DialogTitle>
            <Fieldset>
              <Field>
                <Label>Name</Label>
                <Input name="name" type="text" />
              </Field>

              <Field>
                <Label>Price</Label>
                <Input name="price" type="number" />
              </Field>

              <Field>
                <Label>Date</Label>
                <Input name="date" type="text" />
              </Field>

              <Field>
                <Label>Category</Label>
                <Select name="category">
                  <option value="food">Food</option>
                  <option value="salary">Salary</option>
                </Select>
              </Field>

              <Field>
                <Label>Type</Label>
                <Select name="type">
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </Select>
              </Field>

              <Field>
                <Label>Bank</Label>
                <Select name="bank">
                  <option value="Itau">Itau</option>
                  <option value="Nubank">Nubank</option>
                </Select>
              </Field>
            </Fieldset>
            <div className="flex gap-4">
              <Button onClick={close}>Cancel</Button>
              <Button onClick={close}>Create</Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default NewEntryModal;
