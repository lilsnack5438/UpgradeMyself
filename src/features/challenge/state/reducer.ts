import { EXERCISES, type ExerciseId } from '../constants/exercises';
import { REWARD_MILESTONES } from '../constants/milestones';
import type { HistoryEntry, ChallengeState, PersistedState } from './types';

const HISTORY_LIMIT = 10;

function defaultGoals(): Record<ExerciseId, number> {
  return EXERCISES.reduce(
    (goals, ex) => {
      goals[ex.id] = ex.defaultGoal;
      return goals;
    },
    {} as Record<ExerciseId, number>,
  );
}

function resetProgress(ids: ExerciseId[]): Partial<Record<ExerciseId, number>> {
  const progress: Partial<Record<ExerciseId, number>> = {};
  ids.forEach((id) => {
    progress[id] = 0;
  });
  return progress;
}

export const initialState: ChallengeState = {
  hasOnboarded: false,
  selectedIds: [],
  goals: defaultGoals(),
  progress: {},
  streak: 0,
  missedConsecutive: 0,
  penalty: null,
  history: [],
  toast: null,
};

export type Action =
  | { type: 'HYDRATE'; state: PersistedState }
  | { type: 'TOGGLE_SELECT'; id: ExerciseId }
  | { type: 'ADJUST_GOAL'; id: ExerciseId; delta: number }
  | { type: 'ADD_PROGRESS'; id: ExerciseId }
  | { type: 'START_PLAN' }
  | { type: 'END_DAY' }
  | { type: 'SKIP_DAY' }
  | { type: 'DISMISS_TOAST' }
  | { type: 'RESET_ALL' };

export function challengeReducer(state: ChallengeState, action: Action): ChallengeState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.state };

    case 'TOGGLE_SELECT': {
      const has = state.selectedIds.includes(action.id);
      return {
        ...state,
        selectedIds: has
          ? state.selectedIds.filter((id) => id !== action.id)
          : [...state.selectedIds, action.id],
      };
    }

    case 'ADJUST_GOAL': {
      const exercise = EXERCISES.find((ex) => ex.id === action.id);
      if (!exercise) return state;
      const current = state.goals[action.id] ?? exercise.defaultGoal;
      const next = Math.min(exercise.max, Math.max(exercise.min, current + action.delta));
      return { ...state, goals: { ...state.goals, [action.id]: next } };
    }

    case 'ADD_PROGRESS': {
      const exercise = EXERCISES.find((ex) => ex.id === action.id);
      if (!exercise) return state;
      const goal = state.goals[action.id] ?? exercise.defaultGoal;
      const current = state.progress[action.id] ?? 0;
      const next = Math.min(goal, current + exercise.step);
      return { ...state, progress: { ...state.progress, [action.id]: next } };
    }

    case 'START_PLAN':
      return {
        ...state,
        hasOnboarded: true,
        progress: resetProgress(state.selectedIds),
      };

    case 'END_DAY': {
      const allDone =
        state.selectedIds.length > 0 &&
        state.selectedIds.every((id) => (state.progress[id] ?? 0) >= (state.goals[id] ?? 0));
      if (!allDone) return state;

      const streak = state.streak + 1;
      const milestone = REWARD_MILESTONES.find((m) => m.days === streak);
      const entry: HistoryEntry = { status: 'done' };

      return {
        ...state,
        streak,
        missedConsecutive: 0,
        penalty: null,
        progress: resetProgress(state.selectedIds),
        history: [...state.history, entry].slice(-HISTORY_LIMIT),
        toast: milestone ? { type: 'reward', milestoneDays: milestone.days } : null,
      };
    }

    case 'SKIP_DAY': {
      const progress = resetProgress(state.selectedIds);
      if (state.missedConsecutive === 0) {
        const entry: HistoryEntry = { status: 'missed' };
        return {
          ...state,
          missedConsecutive: 1,
          penalty: 'minor',
          progress,
          history: [...state.history, entry].slice(-HISTORY_LIMIT),
          toast: { type: 'penalty', tier: 'minor' },
        };
      }
      const entry: HistoryEntry = { status: 'reset' };
      return {
        ...state,
        streak: 0,
        missedConsecutive: 0,
        penalty: 'max',
        progress,
        history: [...state.history, entry].slice(-HISTORY_LIMIT),
        toast: { type: 'penalty', tier: 'max' },
      };
    }

    case 'DISMISS_TOAST':
      return { ...state, toast: null };

    case 'RESET_ALL':
      return { ...initialState };

    default:
      return state;
  }
}
