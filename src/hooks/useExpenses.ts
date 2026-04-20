import { useEffect, useState } from "react";
import { subscribeExpenses } from "../services/expenses";
import type { Expense } from "../types/expense";

export interface UseExpensesState {
  expenses: Expense[];
  loading: boolean;
  error: Error | null;
}

export const useExpenses = (uid: string | null): UseExpensesState => {
  const [state, setState] = useState<UseExpensesState>({
    expenses: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!uid) {
      setState({ expenses: [], loading: false, error: null });
      return;
    }
    setState((s) => ({ ...s, loading: true }));
    const unsubscribe = subscribeExpenses(
      uid,
      (expenses) => setState({ expenses, loading: false, error: null }),
      (error) => setState((s) => ({ ...s, loading: false, error }))
    );
    return () => unsubscribe();
  }, [uid]);

  return state;
};
