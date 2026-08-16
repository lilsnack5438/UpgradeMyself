import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { GoalsEditor } from '@/features/challenge/components/goals-editor';
import { useChallenge } from '@/features/challenge/state/challenge-provider';

export default function OnboardingGoalsScreen() {
  const { t } = useTranslation();
  const { startPlan } = useChallenge();

  return (
    <GoalsEditor
      submitLabel={t('goals.startPlan')}
      onSubmit={() => {
        startPlan();
        router.replace('/(tabs)');
      }}
    />
  );
}
