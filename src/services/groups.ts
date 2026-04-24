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
import type { Group, GroupInput } from "../types/expense";
import { db } from "./firebase";

const groupsCol = (uid: string) => collection(db, "users", uid, "groups");

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
