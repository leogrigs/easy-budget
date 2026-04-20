import { addDays, addMonths, parseISO } from "date-fns";
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
  where,
  writeBatch,
} from "firebase/firestore";
import type { Recurring, RecurringInput } from "../types/expense";
import { db } from "./firebase";

const recurringCol = (uid: string) =>
  collection(db, "users", uid, "recurring");

const expensesCol = (uid: string) =>
  collection(db, "users", uid, "expenses");

const recurringQuery = (uid: string) =>
  query(recurringCol(uid), orderBy("startDate", "desc"));

const mapDoc = (id: string, data: Record<string, unknown>): Recurring => ({
  id,
  name: data.name as string,
  amount: data.amount as number,
  categoryId: data.categoryId as string,
  frequency: data.frequency as Recurring["frequency"],
  startDate: data.startDate as string,
  endDate: (data.endDate as string | undefined) ?? undefined,
  lastGeneratedAt: (data.lastGeneratedAt as string | undefined) ?? undefined,
  createdAt: data.createdAt as Recurring["createdAt"],
  updatedAt: data.updatedAt as Recurring["updatedAt"],
});

export const listRecurring = async (uid: string): Promise<Recurring[]> => {
  const snap = await getDocs(recurringQuery(uid));
  return snap.docs.map((d) => mapDoc(d.id, d.data()));
};

export const subscribeRecurring = (
  uid: string,
  onNext: (list: Recurring[]) => void,
  onError?: (error: Error) => void
) => {
  return onSnapshot(
    recurringQuery(uid),
    (snap) => onNext(snap.docs.map((d) => mapDoc(d.id, d.data()))),
    onError
  );
};

export const addRecurring = async (
  uid: string,
  input: RecurringInput
): Promise<string> => {
  const ref = await addDoc(recurringCol(uid), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
};

export const updateRecurring = async (
  uid: string,
  id: string,
  patch: Partial<RecurringInput> & { lastGeneratedAt?: string }
): Promise<void> => {
  await updateDoc(doc(recurringCol(uid), id), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
};

export const deleteRecurring = async (
  uid: string,
  id: string
): Promise<void> => {
  await deleteDoc(doc(recurringCol(uid), id));
};

const toISODate = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

/**
 * Produces the list of occurrence dates (inclusive of start, up to and including `now`)
 * for a recurring template. Dates are compared as YYYY-MM-DD strings so timezone
 * shifts never cause a day to be skipped or double-counted.
 * Caller is expected to filter out dates already materialized.
 */
export const occurrencesBetween = (
  startDate: string,
  frequency: Recurring["frequency"],
  endDate: string | undefined,
  now: Date
): string[] => {
  const nowIso = toISODate(now);
  const limitIso = endDate && endDate < nowIso ? endDate : nowIso;
  const step =
    frequency === "weekly"
      ? (d: Date) => addDays(d, 7)
      : (d: Date) => addMonths(d, 1);

  const out: string[] = [];
  let cursor = parseISO(startDate);
  while (toISODate(cursor) <= limitIso) {
    out.push(toISODate(cursor));
    cursor = step(cursor);
  }
  return out;
};

/**
 * For each recurring template, creates expense docs for any occurrence dates
 * that don't already have an expense linked via recurringId + date.
 * Idempotent — safe to call on every login.
 */
export const materializePendingRecurring = async (
  uid: string,
  now: Date = new Date()
): Promise<number> => {
  const templates = await listRecurring(uid);
  if (templates.length === 0) return 0;

  let created = 0;
  for (const template of templates) {
    const occurrences = occurrencesBetween(
      template.startDate,
      template.frequency,
      template.endDate,
      now
    );
    if (occurrences.length === 0) continue;

    const existingSnap = await getDocs(
      query(expensesCol(uid), where("recurringId", "==", template.id))
    );
    const existingDates = new Set(
      existingSnap.docs.map((d) => d.data().date as string)
    );

    const missing = occurrences.filter((d) => !existingDates.has(d));
    if (missing.length === 0) continue;

    const batch = writeBatch(db);
    for (const date of missing) {
      const ref = doc(expensesCol(uid));
      batch.set(ref, {
        name: template.name,
        amount: template.amount,
        date,
        categoryId: template.categoryId,
        recurringId: template.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      created += 1;
    }
    batch.update(doc(recurringCol(uid), template.id), {
      lastGeneratedAt: toISODate(now),
      updatedAt: serverTimestamp(),
    });
    await batch.commit();
  }
  return created;
};
