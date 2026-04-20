import { useEffect, useMemo, useState } from "react";
import { subscribeCategories } from "../services/categories";
import type { Category } from "../types/expense";

export interface UseCategoriesState {
  categories: Category[];
  byId: Map<string, Category>;
  loading: boolean;
  error: Error | null;
}

export const useCategories = (uid: string | null): UseCategoriesState => {
  const [inner, setInner] = useState<{
    categories: Category[];
    loading: boolean;
    error: Error | null;
  }>({ categories: [], loading: true, error: null });

  useEffect(() => {
    if (!uid) {
      setInner({ categories: [], loading: false, error: null });
      return;
    }
    setInner((s) => ({ ...s, loading: true }));
    const unsubscribe = subscribeCategories(
      uid,
      (categories) => setInner({ categories, loading: false, error: null }),
      (error) => setInner((s) => ({ ...s, loading: false, error }))
    );
    return () => unsubscribe();
  }, [uid]);

  const byId = useMemo(
    () => new Map(inner.categories.map((c) => [c.id, c])),
    [inner.categories]
  );

  return { ...inner, byId };
};
