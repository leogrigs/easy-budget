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
  writeBatch,
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
): Record<string, unknown> => {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === null) out[k] = deleteField();
    else if (v !== undefined) out[k] = v;
  }
  return out;
};

export type ExpensePatch = Omit<Partial<ExpenseInput>, "groupId"> & {
  groupId?: string | null;
};

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
  }) as Record<string, never>;
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
