import type { ThemeColor } from '@/constants/theme';

export type ExerciseId = 'pushup' | 'jumprope' | 'english';

interface BaseExercise {
  id: ExerciseId;
  mono: string;
  min: number;
  max: number;
  step: number;
  defaultGoal: number;
  accent: ThemeColor;
}

export interface StepperExercise extends BaseExercise {
  kind: 'stepper';
}

/** An AI-graded quiz instead of a manual counter — `min`/`max`/`step`/`defaultGoal` count questions per day. */
export interface QuizExercise extends BaseExercise {
  kind: 'quiz';
}

export type Exercise = StepperExercise | QuizExercise;

export const EXERCISES: Exercise[] = [
  {
    id: 'pushup',
    kind: 'stepper',
    mono: 'HD',
    min: 10,
    max: 100,
    step: 5,
    defaultGoal: 30,
    accent: 'accent',
  },
  {
    id: 'jumprope',
    kind: 'stepper',
    mono: 'ND',
    min: 50,
    max: 500,
    step: 25,
    defaultGoal: 150,
    accent: 'accentCyan',
  },
  {
    id: 'english',
    kind: 'quiz',
    mono: 'TV',
    min: 3,
    max: 10,
    step: 1,
    defaultGoal: 5,
    accent: 'accentPurple',
  },
];
