import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  Timestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import { seedDefaultCategories } from "./categories";
import type { Category } from "../types/expense";

interface LegacyEntry {
  id: number | string;
  name: string;
  price: number;
  date: string;
  category: string;
  type?: string;
}

const LEGACY_TO_DEFAULT_NAME: Record<string, string> = {
  salary: "Other",
  food: "Food",
  transport: "Transport",
  entertainment: "Entertainment",
  miscelleneous: "Other",
  other: "Other",
};

/**
 * One-shot migration from the legacy users/{uid}.table array to subcollections.
 *
 * - Seeds default categories if missing.
 * - Maps each legacy entry's category string to a seeded category id.
 * - Skips entries typed as "income" — the app is expense-only now.
 * - Marks `migrated: true` on the user doc; idempotent (re-run is a no-op).
 * - Leaves the legacy `table` field intact for one release as a rollback safety net.
 */
export const migrateUserIfNeeded = async (uid: string): Promise<void> => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await seedDefaultCategories(uid);
    return;
  }

  const data = userSnap.data() ?? {};
  if (data.migrated === true) return;

  const categories = await seedDefaultCategories(uid);
  const categoryByName = new Map<string, Category>(
    categories.map((c) => [c.name.toLowerCase(), c])
  );
  const otherCategory =
    categoryByName.get("other") ?? categories[categories.length - 1];

  const expensesCol = collection(userRef, "expenses");
  const legacyTable = (data.table as LegacyEntry[] | undefined) ?? [];
  const expensesOnly = legacyTable.filter(
    (e) => (e.type ?? "expense").toLowerCase() === "expense"
  );

  const chunkSize = 450;
  for (let i = 0; i < expensesOnly.length; i += chunkSize) {
    const group = expensesOnly.slice(i, i + chunkSize);
    const batch = writeBatch(db);
    for (const entry of group) {
      const defaultName =
        LEGACY_TO_DEFAULT_NAME[String(entry.category).toLowerCase()] ?? "Other";
      const targetCategory =
        categoryByName.get(defaultName.toLowerCase()) ?? otherCategory;
      batch.set(doc(expensesCol), {
        name: entry.name,
        amount: Number(entry.price) || 0,
        date: entry.date,
        categoryId: targetCategory.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    await batch.commit();
  }

  await updateDoc(userRef, {
    migrated: true,
    migratedAt: Timestamp.now(),
  });
};
