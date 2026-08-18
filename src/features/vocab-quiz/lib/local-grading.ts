import { acceptableMeanings, type WordEntry } from '../constants/word-bank';

function normalize(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Exact-match comparison against the word bank's canonical meaning(s) — used
 * while AI grading is disabled. Deliberately simple (no synonym/typo
 * tolerance): this is a stopgap, not a replacement for semantic grading.
 */
export function gradeAnswerLocally(entry: WordEntry, userAnswer: string) {
  const normalizedAnswer = normalize(userAnswer);
  const isCorrect =
    normalizedAnswer.length > 0 &&
    acceptableMeanings(entry).some((meaning) => normalize(meaning) === normalizedAnswer);

  return {
    isCorrect,
    modelAnswer: entry.meaningVi,
  };
}
