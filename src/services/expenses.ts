import {
  addDoc,
  collection,
  deleteDoc,
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
  recurringId: (data.recurringId as string | undefined) ?? undefined,
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

export const addExpense = async (
  uid: string,
  input: ExpenseInput
): Promise<string> => {
  const ref = await addDoc(expensesCol(uid), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
};

export const updateExpense = async (
  uid: string,
  id: string,
  patch: Partial<ExpenseInput>
): Promise<void> => {
  await updateDoc(doc(expensesCol(uid), id), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
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

export const bulkAddExpenses = async (
  uid: string,
  inputs: ExpenseInput[]
): Promise<void> => {
  for (const group of chunk(inputs, 450)) {
    const batch = writeBatch(db);
    for (const input of group) {
      const ref = doc(expensesCol(uid));
      batch.set(ref, {
        ...input,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    await batch.commit();
  }
};
