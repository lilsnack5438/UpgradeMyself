import { createContext, useContext, useEffect, useReducer, useState, type ReactNode } from 'react';

import type { ExerciseId } from '../constants/exercises';
import { loadState, saveState } from './persistence';
import { initialState, kienTriReducer } from './reducer';
import type { KienTriState } from './types';

interface KienTriContextValue {
  state: KienTriState;
  isHydrated: boolean;
  toggleSelect: (id: ExerciseId) => void;
  adjustGoal: (id: ExerciseId, delta: number) => void;
  addProgress: (id: ExerciseId) => void;
  startPlan: () => void;
  endDay: () => void;
  skipDay: () => void;
  dismissToast: () => void;
  resetAll: () => void;
}

const KienTriContext = createContext<KienTriContextValue | null>(null);

export function KienTriProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(kienTriReducer, initialState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadState().then((persisted) => {
      if (cancelled) return;
      dispatch({ type: 'HYDRATE', state: persisted });
      setIsHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    saveState(state);
  }, [state, isHydrated]);

  const value: KienTriContextValue = {
    state,
    isHydrated,
    toggleSelect: (id) => dispatch({ type: 'TOGGLE_SELECT', id }),
    adjustGoal: (id, delta) => dispatch({ type: 'ADJUST_GOAL', id, delta }),
    addProgress: (id) => dispatch({ type: 'ADD_PROGRESS', id }),
    startPlan: () => dispatch({ type: 'START_PLAN' }),
    endDay: () => dispatch({ type: 'END_DAY' }),
    skipDay: () => dispatch({ type: 'SKIP_DAY' }),
    dismissToast: () => dispatch({ type: 'DISMISS_TOAST' }),
    resetAll: () => dispatch({ type: 'RESET_ALL' }),
  };

  return <KienTriContext.Provider value={value}>{children}</KienTriContext.Provider>;
}

export function useKienTri() {
  const ctx = useContext(KienTriContext);
  if (!ctx) throw new Error('useKienTri must be used within a KienTriProvider');
  return ctx;
}
