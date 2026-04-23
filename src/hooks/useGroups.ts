import { useEffect, useMemo, useState } from "react";
import { subscribeGroups } from "../services/groups";
import type { Group } from "../types/expense";

export interface UseGroupsState {
  groups: Group[];
  byId: Map<string, Group>;
  loading: boolean;
  error: Error | null;
}

export const useGroups = (uid: string | null): UseGroupsState => {
  const [inner, setInner] = useState<{
    groups: Group[];
    loading: boolean;
    error: Error | null;
  }>({ groups: [], loading: true, error: null });

  useEffect(() => {
    if (!uid) {
      setInner({ groups: [], loading: false, error: null });
      return;
    }
    setInner((s) => ({ ...s, loading: true }));
    const unsubscribe = subscribeGroups(
      uid,
      (groups) => setInner({ groups, loading: false, error: null }),
      (error) => setInner((s) => ({ ...s, loading: false, error }))
    );
    return () => unsubscribe();
  }, [uid]);

  const byId = useMemo(
    () => new Map(inner.groups.map((g) => [g.id, g])),
    [inner.groups]
  );

  return { ...inner, byId };
};
