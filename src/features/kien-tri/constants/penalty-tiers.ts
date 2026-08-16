import type { ThemeColor } from '@/constants/theme';
import type { PenaltyTierId } from '../state/types';

export interface PenaltyTier {
  id: PenaltyTierId;
  color: ThemeColor;
}

export const PENALTY_TIERS: PenaltyTier[] = [
  { id: 'minor', color: 'accent' },
  { id: 'max', color: 'danger' },
];
