export type MilestoneDays = 3 | 7 | 14 | 30 | 66;

export interface RewardMilestone {
  days: MilestoneDays;
}

export const REWARD_MILESTONES: RewardMilestone[] = [
  { days: 3 },
  { days: 7 },
  { days: 14 },
  { days: 30 },
  { days: 66 },
];
