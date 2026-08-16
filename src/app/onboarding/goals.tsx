import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { GoalsEditor } from '@/features/kien-tri/components/goals-editor';
import { useKienTri } from '@/features/kien-tri/state/kien-tri-provider';

export default function OnboardingGoalsScreen() {
  const { t } = useTranslation();
  const { startPlan } = useKienTri();

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
