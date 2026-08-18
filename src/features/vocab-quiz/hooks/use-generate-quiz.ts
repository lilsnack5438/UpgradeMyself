import { useMutation } from '@tanstack/react-query';

import { generateQuizQuestions } from '../lib/ai-client';
import type { WordEntry } from '../constants/word-bank';

export function useGenerateQuiz() {
  return useMutation({
    mutationFn: (words: WordEntry[]) => generateQuizQuestions(words),
  });
}
