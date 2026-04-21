import { Timestamp } from "firebase/firestore";

export interface Expense {
  id: string;
  name: string;
  amount: number;
  date: string;
  categoryId: string;
  recurringId?: string;
  refunded?: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type ExpenseInput = Omit<Expense, "id" | "createdAt" | "updatedAt">;

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  order: number;
  createdAt: Timestamp;
}

export type CategoryInput = Omit<Category, "id" | "createdAt">;

export type RecurringFrequency = "weekly" | "monthly";

export interface Recurring {
  id: string;
  name: string;
  amount: number;
  categoryId: string;
  frequency: RecurringFrequency;
  startDate: string;
  endDate?: string;
  lastGeneratedAt?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type RecurringInput = Omit<
  Recurring,
  "id" | "createdAt" | "updatedAt" | "lastGeneratedAt"
>;
