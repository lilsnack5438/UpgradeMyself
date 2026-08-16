import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { GoalsEditor } from '@/features/kien-tri/components/goals-editor';

export default function EditGoalsScreen() {
  const { t } = useTranslation();

  return <GoalsEditor submitLabel={t('goals.saveChanges')} onSubmit={() => router.back()} />;
}
