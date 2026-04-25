import { addMonths, format } from "date-fns";
import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
  type DocumentData,
  type UpdateData,
} from "firebase/firestore";
import type { Expense, ExpenseInput } from "../types/expense";
import { db } from "./firebase";

const expensesCol = (uid: string) =>
  collection(db, "users", uid, "expenses");

const expensesQuery = (uid: string) =>
  query(expensesCol(uid), orderBy("date", "desc"));

const mapDoc = (id: string, data: Record<string, unknown>): Expense => ({
  id,
  name: data.name as string,
  amount: data.amount as number,
  date: data.date as string,
  categoryId: data.categoryId as string,
  groupId: (data.groupId as string | undefined) ?? undefined,
  recurringId: (data.recurringId as string | undefined) ?? undefined,
  refunded: (data.refunded as boolean | undefined) ?? false,
  installmentGroupId:
    (data.installmentGroupId as string | undefined) ?? undefined,
  installmentNumber:
    (data.installmentNumber as number | undefined) ?? undefined,
  installmentTotal:
    (data.installmentTotal as number | undefined) ?? undefined,
  createdAt: data.createdAt as Expense["createdAt"],
  updatedAt: data.updatedAt as Expense["updatedAt"],
});

export const listExpenses = async (uid: string): Promise<Expense[]> => {
  const snap = await getDocs(expensesQuery(uid));
  return snap.docs.map((d) => mapDoc(d.id, d.data()));
};

export const subscribeExpenses = (
  uid: string,
  onNext: (expenses: Expense[]) => void,
  onError?: (error: Error) => void
) => {
  return onSnapshot(
    expensesQuery(uid),
    (snap) => onNext(snap.docs.map((d) => mapDoc(d.id, d.data()))),
    onError
  );
};

const stripUndefined = <T extends Record<string, unknown>>(obj: T): T => {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) out[k] = v;
  }
  return out as T;
};

// Patch normalizer: `null` → deleteField() sentinel, `undefined` → omitted.
// Required so update callers can *clear* optional fields like groupId.
export const normalizePatch = (
  obj: Record<string, unknown>
): UpdateData<DocumentData> => {
  const out: UpdateData<DocumentData> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === null) out[k] = deleteField();
    else if (v !== undefined) out[k] = v;
  }
  return out;
};

export type ExpensePatch = Omit<Partial<ExpenseInput>, "groupId"> & {
  groupId?: string | null;
};

// Translates a form's `groupId` (string | undefined) into the patch shape,
// which needs `null` to signal "clear" (via deleteField). Shared between
// Expenses.tsx and GroupDetail.tsx edit handlers.
export const resolveGroupIdPatch = (
  nextValue: string | undefined,
  currentValue: string | undefined
): string | null | undefined =>
  nextValue ?? (currentValue ? null : undefined);

export const addExpense = async (
  uid: string,
  input: ExpenseInput
): Promise<string> => {
  const ref = await addDoc(
    expensesCol(uid),
    stripUndefined({
      ...input,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  );
  return ref.id;
};

export const updateExpense = async (
  uid: string,
  id: string,
  patch: ExpensePatch
): Promise<void> => {
  const normalized = normalizePatch({
    ...patch,
    updatedAt: serverTimestamp(),
  });
  await updateDoc(doc(expensesCol(uid), id), normalized);
};

export const deleteExpense = async (uid: string, id: string): Promise<void> => {
  await deleteDoc(doc(expensesCol(uid), id));
};

const chunk = <T>(arr: T[], size: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

export const bulkDeleteExpenses = async (
  uid: string,
  ids: string[]
): Promise<void> => {
  for (const group of chunk(ids, 450)) {
    const batch = writeBatch(db);
    for (const id of group) batch.delete(doc(expensesCol(uid), id));
    await batch.commit();
  }
};

export const bulkUpdateCategory = async (
  uid: string,
  ids: string[],
  categoryId: string
): Promise<void> => {
  for (const group of chunk(ids, 450)) {
    const batch = writeBatch(db);
    for (const id of group) {
      batch.update(doc(expensesCol(uid), id), {
        categoryId,
        updatedAt: serverTimestamp(),
      });
    }
    await batch.commit();
  }
};

export const bulkUpdateGroup = async (
  uid: string,
  ids: string[],
  groupId: string | null
): Promise<void> => {
  const value = groupId === null ? deleteField() : groupId;
  for (const group of chunk(ids, 450)) {
    const batch = writeBatch(db);
    for (const id of group) {
      batch.update(doc(expensesCol(uid), id), {
        groupId: value,
        updatedAt: serverTimestamp(),
      });
    }
    await batch.commit();
  }
};

export const bulkAddExpenses = async (
  uid: string,
  inputs: ExpenseInput[]
): Promise<void> => {
  for (const group of chunk(inputs, 450)) {
    const batch = writeBatch(db);
    for (const input of group) {
      const ref = doc(expensesCol(uid));
      batch.set(
        ref,
        stripUndefined({
          ...input,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      );
    }
    await batch.commit();
  }
};

export interface InstallmentPurchaseInput {
  name: string;
  totalAmount: number;
  parts: number;
  firstDate: string;
  categoryId: string;
  groupId?: string;
}

// Splits a purchase into N expenses that share an installmentGroupId.
// Amounts are computed in cents to avoid float drift; any remainder
// (e.g. R$1000 / 3) is added to the last installment so the per-part
// amounts sum to the original total exactly.
export const buildInstallmentInputs = (
  input: InstallmentPurchaseInput,
  installmentGroupId: string
): ExpenseInput[] => {
  const totalCents = Math.round(input.totalAmount * 100);
  const baseCents = Math.floor(totalCents / input.parts);
  const remainderCents = totalCents - baseCents * input.parts;
  const firstDate = new Date(`${input.firstDate}T00:00:00`);

  const inputs: ExpenseInput[] = [];
  for (let i = 0; i < input.parts; i++) {
    const cents = baseCents + (i === input.parts - 1 ? remainderCents : 0);
    inputs.push({
      name: input.name,
      amount: cents / 100,
      date: format(addMonths(firstDate, i), "yyyy-MM-dd"),
      categoryId: input.categoryId,
      groupId: input.groupId,
      installmentGroupId,
      installmentNumber: i + 1,
      installmentTotal: input.parts,
    });
  }
  return inputs;
};

export const addInstallmentPurchase = async (
  uid: string,
  input: InstallmentPurchaseInput
): Promise<string> => {
  const installmentGroupId = crypto.randomUUID();
  const inputs = buildInstallmentInputs(input, installmentGroupId);
  await bulkAddExpenses(uid, inputs);
  return installmentGroupId;
};

export const deleteInstallmentGroup = async (
  uid: string,
  installmentGroupId: string
): Promise<number> => {
  const q = query(
    expensesCol(uid),
    where("installmentGroupId", "==", installmentGroupId)
  );
  const snap = await getDocs(q);
  const ids = snap.docs.map((d) => d.id);
  if (ids.length > 0) await bulkDeleteExpenses(uid, ids);
  return ids.length;
};
