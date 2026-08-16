import type { ExerciseId } from '../constants/exercises';
import type { MilestoneDays } from '../constants/milestones';

export type { ExerciseId };

export type PenaltyTierId = 'minor' | 'max';

export type HistoryStatus = 'done' | 'missed' | 'reset';

export interface HistoryEntry {
  status: HistoryStatus;
}

export type ToastState =
  { type: 'reward'; milestoneDays: MilestoneDays } | { type: 'penalty'; tier: PenaltyTierId };

export interface ChallengeState {
  hasOnboarded: boolean;
  selectedIds: ExerciseId[];
  goals: Record<ExerciseId, number>;
  progress: Partial<Record<ExerciseId, number>>;
  streak: number;
  missedConsecutive: number;
  penalty: PenaltyTierId | null;
  history: HistoryEntry[];
  toast: ToastState | null;
}

export type PersistedState = Omit<ChallengeState, 'toast'>;
