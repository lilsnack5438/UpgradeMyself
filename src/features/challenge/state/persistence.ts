import AsyncStorage from '@react-native-async-storage/async-storage';

import { initialState } from './reducer';
import type { ChallengeState, PersistedState } from './types';

const STORAGE_KEY = '@challenge/state/v1';

function toPersisted(state: ChallengeState): PersistedState {
  const {
    hasOnboarded,
    selectedIds,
    goals,
    progress,
    streak,
    missedConsecutive,
    penalty,
    history,
  } = state;
  return {
    hasOnboarded,
    selectedIds,
    goals,
    progress,
    streak,
    missedConsecutive,
    penalty,
    history,
  };
}

function isPersistedState(value: unknown): value is PersistedState {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.hasOnboarded === 'boolean' &&
    Array.isArray(v.selectedIds) &&
    typeof v.goals === 'object' &&
    typeof v.progress === 'object' &&
    typeof v.streak === 'number' &&
    typeof v.missedConsecutive === 'number' &&
    Array.isArray(v.history)
  );
}

export async function loadState(): Promise<PersistedState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return toPersisted(initialState);
    const parsed: unknown = JSON.parse(raw);
    return isPersistedState(parsed) ? parsed : toPersisted(initialState);
  } catch {
    return toPersisted(initialState);
  }
}

export async function saveState(state: ChallengeState): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toPersisted(state)));
  } catch {
    // Best-effort persistence — a failed write shouldn't crash the app.
  }
}
