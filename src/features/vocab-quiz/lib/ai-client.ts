import i18n from '@/i18n';
import { supabase } from '@/lib/supabase';
import type { WordEntry } from '../constants/word-bank';
import { gradeAnswerLocally } from './local-grading';

/**
 * Flip to true once the Anthropic API key has billing enabled. Nothing else
 * needs to change — both generateQuizQuestions and gradeAnswer switch from
 * the local word-bank fallback to the real vocab-ai Edge Function.
 */
export const AI_QUIZ_ENABLED = false;

export interface QuizQuestion {
  word: string;
  meaningVi: string;
  prompt: string;
}

export interface GradeResult {
  isCorrect: boolean;
  modelAnswer: string;
}

export async function generateQuizQuestions(words: WordEntry[]): Promise<QuizQuestion[]> {
  if (!AI_QUIZ_ENABLED) {
    return words.map((entry) => ({
      word: entry.word,
      meaningVi: entry.meaningVi,
      prompt: i18n.t('vocabQuiz.instruction'),
    }));
  }

  const { data, error } = await supabase.functions.invoke<{
    questions: { word: string; prompt: string }[];
  }>('vocab-ai', { body: { action: 'generate', words } });
  if (error || !data) {
    throw error ?? new Error('vocab-ai generate returned no data');
  }

  const meaningByWord = new Map(words.map((entry) => [entry.word, entry.meaningVi]));
  return data.questions.map((q) => ({
    word: q.word,
    prompt: q.prompt,
    meaningVi: meaningByWord.get(q.word) ?? '',
  }));
}

export async function gradeAnswer(
  question: QuizQuestion,
  userAnswer: string,
): Promise<GradeResult> {
  if (!AI_QUIZ_ENABLED) {
    return gradeAnswerLocally({ word: question.word, meaningVi: question.meaningVi }, userAnswer);
  }

  const { data, error } = await supabase.functions.invoke<{
    isCorrect: boolean;
    feedback: string;
    modelAnswer: string;
  }>('vocab-ai', {
    body: {
      action: 'grade',
      word: question.word,
      meaningVi: question.meaningVi,
      prompt: question.prompt,
      userAnswer,
    },
  });
  if (error || !data) {
    throw error ?? new Error('vocab-ai grade returned no data');
  }
  return { isCorrect: data.isCorrect, modelAnswer: data.modelAnswer };
}
