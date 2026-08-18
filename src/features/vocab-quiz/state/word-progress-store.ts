import AsyncStorage from '@react-native-async-storage/async-storage';

import { WORD_BANK } from '../constants/word-bank';

const STORAGE_KEY = '@vocab-quiz/word-progress/v1';

export interface WordProgress {
  lastTestedAt: number;
  timesCorrect: number;
  timesIncorrect: number;
}

export type WordProgressMap = Record<string, WordProgress>;

function isWordProgressMap(value: unknown): value is WordProgressMap {
  if (!value || typeof value !== 'object') return false;
  return Object.values(value as Record<string, unknown>).every((entry) => {
    if (!entry || typeof entry !== 'object') return false;
    const p = entry as Record<string, unknown>;
    return (
      typeof p.lastTestedAt === 'number' &&
      typeof p.timesCorrect === 'number' &&
      typeof p.timesIncorrect === 'number'
    );
  });
}

export async function loadWordProgress(): Promise<WordProgressMap> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    return isWordProgressMap(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export async function saveWordProgress(progress: WordProgressMap): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Best-effort persistence — a failed write shouldn't crash the app.
  }
}

/** Picks `count` words, least-recently-tested first, so the full bank rotates evenly. */
export function pickWordsToTest(progress: WordProgressMap, count: number) {
  return [...WORD_BANK]
    .sort((a, b) => (progress[a.word]?.lastTestedAt ?? 0) - (progress[b.word]?.lastTestedAt ?? 0))
    .slice(0, count);
}

export function recordResult(
  progress: WordProgressMap,
  word: string,
  isCorrect: boolean,
): WordProgressMap {
  const existing = progress[word] ?? { lastTestedAt: 0, timesCorrect: 0, timesIncorrect: 0 };
  return {
    ...progress,
    [word]: {
      lastTestedAt: Date.now(),
      timesCorrect: existing.timesCorrect + (isCorrect ? 1 : 0),
      timesIncorrect: existing.timesIncorrect + (isCorrect ? 0 : 1),
    },
  };
}
