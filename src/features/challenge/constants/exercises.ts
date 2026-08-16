import type { ThemeColor } from '@/constants/theme';

export type ExerciseId = 'pushup' | 'jumprope' | 'english';

export interface Exercise {
  id: ExerciseId;
  mono: string;
  min: number;
  max: number;
  step: number;
  defaultGoal: number;
  accent: ThemeColor;
}

export const EXERCISES: Exercise[] = [
  { id: 'pushup', mono: 'HD', min: 10, max: 100, step: 5, defaultGoal: 30, accent: 'accent' },
  {
    id: 'jumprope',
    mono: 'ND',
    min: 50,
    max: 500,
    step: 25,
    defaultGoal: 150,
    accent: 'accentCyan',
  },
  { id: 'english', mono: 'TV', min: 5, max: 50, step: 5, defaultGoal: 10, accent: 'accentPurple' },
];
