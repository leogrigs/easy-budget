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

export const addEntryToTable = async (uid: string, entry: BudgetTableData) => {
  const userDocRef = doc(db, "users", uid);
  await updateDoc(userDocRef, {
    table: arrayUnion(entry),
  });
};

export const updateEntryInTable = async (
  uid: string,
  updatedEntry: BudgetTableData
) => {
  const userTable = await fetchUserTable(uid);

  const updatedTable = userTable.map((item) =>
    item.id === updatedEntry.id ? updatedEntry : item
  );

  const userDocRef = doc(db, "users", uid);
  await updateDoc(userDocRef, { table: updatedTable });
};

export const deleteEntryFromTable = async (uid: string, entryId: number) => {
  const userTable = await fetchUserTable(uid);

  const updatedTable = userTable.filter((item) => item.id !== entryId);

  const userDocRef = doc(db, "users", uid);
  await updateDoc(userDocRef, { table: updatedTable });
};
