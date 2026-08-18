import { useMutation } from '@tanstack/react-query';

import { gradeAnswer, type QuizQuestion } from '../lib/ai-client';

export function useGradeAnswer() {
  return useMutation({
    mutationFn: ({ question, userAnswer }: { question: QuizQuestion; userAnswer: string }) =>
      gradeAnswer(question, userAnswer),
  });
}
