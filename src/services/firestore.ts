import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { BudgetTableData } from "../interfaces/BudgetTable.interface";
import { db } from "./firebase";

export const initializeUserDocument = async (uid: string) => {
  const userDocRef = doc(db, "users", uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    await setDoc(userDocRef, {
      table: [],
      createdAt: new Date(),
    });
  }
};

export const fetchUserTable = async (
  uid: string
): Promise<BudgetTableData[]> => {
  const userDocRef = doc(db, "users", uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    return (userDoc.data()?.table as BudgetTableData[]) || [];
  } else {
    console.warn(`No user document found for UID: ${uid}`);
    return [];
  }
};

export const addEntryToTable = async (
  uid: string,
  entry: BudgetTableData
): Promise<BudgetTableData[]> => {
  const userDocRef = doc(db, "users", uid);
  await updateDoc(userDocRef, {
    table: arrayUnion(entry),
  });
  return await fetchUserTable(uid);
};

export const updateEntryInTable = async (
  uid: string,
  updatedEntry: BudgetTableData,
  table: BudgetTableData[]
): Promise<BudgetTableData[]> => {
  const updatedTable = table.map((item) =>
    item.id === updatedEntry.id ? updatedEntry : item
  );

  const userDocRef = doc(db, "users", uid);
  await updateDoc(userDocRef, { table: updatedTable });
  return await fetchUserTable(uid);
};

export const deleteEntryFromTable = async (
  uid: string,
  entryId: number,
  table: BudgetTableData[]
): Promise<BudgetTableData[]> => {
  const updatedTable = table
    .filter((item) => item.id !== entryId)
    .map((item, index) => ({ ...item, id: index + 1 }));

  const userDocRef = doc(db, "users", uid);
  await updateDoc(userDocRef, { table: updatedTable });
  return await fetchUserTable(uid);
};
