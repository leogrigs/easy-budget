import { useEffect, useState } from "react";
import { subscribeRecurring } from "../services/recurring";
import type { Recurring } from "../types/expense";

export interface UseRecurringState {
  recurring: Recurring[];
  loading: boolean;
  error: Error | null;
}

export const useRecurring = (uid: string | null): UseRecurringState => {
  const [state, setState] = useState<UseRecurringState>({
    recurring: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!uid) {
      setState({ recurring: [], loading: false, error: null });
      return;
    }
    setState((s) => ({ ...s, loading: true }));
    const unsubscribe = subscribeRecurring(
      uid,
      (recurring) => setState({ recurring, loading: false, error: null }),
      (error) => setState((s) => ({ ...s, loading: false, error }))
    );
    return () => unsubscribe();
  }, [uid]);

  return state;
};
