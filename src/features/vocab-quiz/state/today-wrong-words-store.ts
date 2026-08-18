import AsyncStorage from '@react-native-async-storage/async-storage';

import type { QuizWordResult } from './types';

const STORAGE_KEY = '@vocab-quiz/today-wrong-words/v1';

export async function loadTodaysWrongWords(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.every((w) => typeof w === 'string') ? parsed : [];
  } catch {
    return [];
  }
}

export async function clearTodaysWrongWords(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // Best-effort — a failed clear just means the next session re-derives from stale data.
  }
}

/** Folds a finished session's per-word results into the stored wrong-word list. */
export async function applySessionResults(results: QuizWordResult[]): Promise<void> {
  try {
    const existing = new Set(await loadTodaysWrongWords());
    for (const result of results) {
      if (result.isCorrect) {
        existing.delete(result.word);
      } else {
        existing.add(result.word);
      }
    }
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...existing]));
  } catch {
    // Best-effort persistence — a failed write shouldn't crash the app.
  }
}
