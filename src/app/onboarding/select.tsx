import { router } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { EXERCISES } from '@/features/kien-tri/constants/exercises';
import { ExerciseSelectRow } from '@/features/kien-tri/components/exercise-select-row';
import { PrimaryButton } from '@/features/kien-tri/components/primary-button';
import { ScreenHeader } from '@/features/kien-tri/components/screen-header';
import { useKienTri } from '@/features/kien-tri/state/kien-tri-provider';

export default function SelectScreen() {
  const { t } = useTranslation();
  const { state, toggleSelect } = useKienTri();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <ScreenHeader
            eyebrow={t('select.eyebrow')}
            title={t('select.title')}
            subtitle={t('select.subtitle')}
          />
          <ThemedView style={styles.list}>
            {EXERCISES.map((exercise) => (
              <ExerciseSelectRow
                key={exercise.id}
                exercise={exercise}
                selected={state.selectedIds.includes(exercise.id)}
                onToggle={() => toggleSelect(exercise.id)}
              />
            ))}
          </ThemedView>
        </ScrollView>
        <ThemedView style={styles.footer}>
          <PrimaryButton
            label={t('select.continue')}
            disabled={state.selectedIds.length === 0}
            onPress={() => router.push('/onboarding/goals')}
          />
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    padding: Spacing.xl,
    gap: Spacing.xxl,
  },
  list: {
    gap: Spacing.md,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
  },
});
