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
import type { Category, CategoryInput } from "../types/expense";
import { db } from "./firebase";

const categoriesCol = (uid: string) =>
  collection(db, "users", uid, "categories");

const categoriesQuery = (uid: string) =>
  query(categoriesCol(uid), orderBy("order", "asc"));

const mapDoc = (id: string, data: Record<string, unknown>): Category => ({
  id,
  name: data.name as string,
  color: data.color as string,
  icon: data.icon as string,
  order: (data.order as number) ?? 0,
  createdAt: data.createdAt as Category["createdAt"],
});

export const listCategories = async (uid: string): Promise<Category[]> => {
  const snap = await getDocs(categoriesQuery(uid));
  return snap.docs.map((d) => mapDoc(d.id, d.data()));
};

export const subscribeCategories = (
  uid: string,
  onNext: (categories: Category[]) => void,
  onError?: (error: Error) => void
) => {
  return onSnapshot(
    categoriesQuery(uid),
    (snap) => onNext(snap.docs.map((d) => mapDoc(d.id, d.data()))),
    onError
  );
};

export const addCategory = async (
  uid: string,
  input: CategoryInput
): Promise<string> => {
  const ref = await addDoc(categoriesCol(uid), {
    ...input,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const updateCategory = async (
  uid: string,
  id: string,
  patch: Partial<CategoryInput>
): Promise<void> => {
  await updateDoc(doc(categoriesCol(uid), id), patch);
};

export const deleteCategory = async (
  uid: string,
  id: string
): Promise<void> => {
  await deleteDoc(doc(categoriesCol(uid), id));
};

export const reorderCategories = async (
  uid: string,
  ids: string[]
): Promise<void> => {
  const batch = writeBatch(db);
  ids.forEach((id, index) => {
    batch.update(doc(categoriesCol(uid), id), { order: index });
  });
  await batch.commit();
};

export interface DefaultCategorySeed {
  name: string;
  color: string;
  icon: string;
}

export const DEFAULT_CATEGORIES: DefaultCategorySeed[] = [
  { name: "Food", color: "#eab308", icon: "UtensilsCrossed" },
  { name: "Transport", color: "#06b6d4", icon: "Car" },
  { name: "Housing", color: "#8b5cf6", icon: "Home" },
  { name: "Entertainment", color: "#ec4899", icon: "Popcorn" },
  { name: "Health", color: "#10b981", icon: "HeartPulse" },
  { name: "Other", color: "#64748b", icon: "Package" },
];

/**
 * Ensures the user has at least one category; seeds defaults if empty.
 * Returns the final category list after seeding.
 */
export const seedDefaultCategories = async (
  uid: string
): Promise<Category[]> => {
  const existing = await listCategories(uid);
  if (existing.length > 0) return existing;

  const batch = writeBatch(db);
  DEFAULT_CATEGORIES.forEach((seed, index) => {
    const ref = doc(categoriesCol(uid));
    batch.set(ref, {
      ...seed,
      order: index,
      createdAt: serverTimestamp(),
    });
  });
  await batch.commit();
  return listCategories(uid);
};
