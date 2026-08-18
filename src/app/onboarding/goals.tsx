import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { GoalsEditor } from '@/features/challenge/components/goals-editor';

export default function OnboardingGoalsScreen() {
  const { t } = useTranslation();

  return (
    <GoalsEditor
      submitLabel={t('goals.startPlan')}
      onSubmit={() => router.push('/onboarding/notifications')}
    />
  );
}
