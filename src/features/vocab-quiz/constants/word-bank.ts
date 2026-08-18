import wordBankData from './word-bank.json';

export interface WordEntry {
  word: string;
  meaningVi: string;
}

export const WORD_BANK: WordEntry[] = wordBankData;

/** Looks up entries by word, dropping any that no longer exist in the bank. */
export function findWordEntries(words: string[]): WordEntry[] {
  const byWord = new Map(WORD_BANK.map((entry) => [entry.word, entry]));
  return words.map((word) => byWord.get(word)).filter((entry) => entry !== undefined);
}

/**
 * The individual acceptable Vietnamese meanings for a word, so the user only
 * has to match one of them. `meaningVi` mixes commas, semicolons, and
 * occasionally slashes as separators (e.g. "đến, tới; dấu hiệu động từ
 * nguyên mẫu" for "to", "bạn, anh/chị" for "you"), and some entries append a
 * parenthetical grammatical note to a meaning (e.g. "cái, con (mạo từ xác
 * định)" for "the") — split on all three separators and strip parentheticals
 * so each resulting phrase is standalone-matchable.
 */
export function acceptableMeanings(entry: WordEntry): string[] {
  return entry.meaningVi
    .replace(/\([^)]*\)/g, '')
    .split(/[,;/]/)
    .map((meaning) => meaning.trim())
    .filter((meaning) => meaning.length > 0);
}
