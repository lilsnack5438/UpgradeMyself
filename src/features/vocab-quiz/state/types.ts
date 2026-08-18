import type { QuizQuestion } from '../lib/ai-client';

export type QuizStatus = 'generating' | 'active' | 'grading' | 'feedback' | 'summary' | 'error';

export interface QuizFeedback {
  isCorrect: boolean;
  modelAnswer: string;
}

export interface QuizWordResult {
  word: string;
  isCorrect: boolean;
}

export interface QuizSessionState {
  status: QuizStatus;
  questions: QuizQuestion[];
  questionIndex: number;
  answerText: string;
  correctCount: number;
  feedback: QuizFeedback | null;
  showExitConfirm: boolean;
  /** Per-word outcomes this session, committed to the wrong-words store on finish. */
  results: QuizWordResult[];
}

export type QuizSessionAction =
  | { type: 'QUESTIONS_READY'; questions: QuizQuestion[] }
  | { type: 'GENERATE_FAILED' }
  | { type: 'ANSWER_CHANGED'; text: string }
  | { type: 'SUBMIT_ANSWER' }
  | { type: 'GRADED'; feedback: QuizFeedback }
  | { type: 'GRADE_FAILED' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'REQUEST_EXIT' }
  | { type: 'CANCEL_EXIT' }
  | { type: 'RETRY' };
