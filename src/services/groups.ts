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
import type { Group, GroupInput } from "../types/expense";
import { db } from "./firebase";

const groupsCol = (uid: string) => collection(db, "users", uid, "groups");
const expensesCol = (uid: string) => collection(db, "users", uid, "expenses");

const BATCH_SIZE = 450;

const chunk = <T>(arr: T[], size: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

const groupsQuery = (uid: string) =>
  query(groupsCol(uid), orderBy("order", "asc"));

const mapDoc = (id: string, data: Record<string, unknown>): Group => ({
  id,
  name: data.name as string,
  order: (data.order as number) ?? 0,
  createdAt: data.createdAt as Group["createdAt"],
});

export const listGroups = async (uid: string): Promise<Group[]> => {
  const snap = await getDocs(groupsQuery(uid));
  return snap.docs.map((d) => mapDoc(d.id, d.data()));
};

export const subscribeGroups = (
  uid: string,
  onNext: (groups: Group[]) => void,
  onError?: (error: Error) => void
) => {
  return onSnapshot(
    groupsQuery(uid),
    (snap) => onNext(snap.docs.map((d) => mapDoc(d.id, d.data()))),
    onError
  );
};

export const addGroup = async (
  uid: string,
  input: GroupInput
): Promise<string> => {
  const ref = await addDoc(groupsCol(uid), {
    ...input,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const updateGroup = async (
  uid: string,
  id: string,
  patch: Partial<GroupInput>
): Promise<void> => {
  await updateDoc(doc(groupsCol(uid), id), patch);
};

export const deleteGroup = async (uid: string, id: string): Promise<void> => {
  await deleteDoc(doc(groupsCol(uid), id));
};

// Atomically reassigns (or clears) `groupId` on all affected expenses and
// deletes the group. The group delete lives in the final batch so a failed
// reassign never leaves expenses pointing at a deleted group.
export const deleteGroupWithExpenses = async (
  uid: string,
  groupId: string,
  expenseIds: string[],
  reassignTo: string | null
): Promise<void> => {
  if (expenseIds.length === 0) {
    await deleteDoc(doc(groupsCol(uid), groupId));
    return;
  }

  const groupValue = reassignTo === null ? deleteField() : reassignTo;
  const chunks = chunk(expenseIds, BATCH_SIZE);

  for (let i = 0; i < chunks.length; i++) {
    const batch = writeBatch(db);
    for (const id of chunks[i]) {
      batch.update(doc(expensesCol(uid), id), {
        groupId: groupValue,
        updatedAt: serverTimestamp(),
      });
    }
    if (i === chunks.length - 1) {
      batch.delete(doc(groupsCol(uid), groupId));
    }
    await batch.commit();
  }
};

export const reorderGroups = async (
  uid: string,
  ids: string[]
): Promise<void> => {
  const batch = writeBatch(db);
  ids.forEach((id, index) => {
    batch.update(doc(groupsCol(uid), id), { order: index });
  });
  await batch.commit();
};
