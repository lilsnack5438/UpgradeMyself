import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { EXERCISES } from '../constants/exercises';
import { useChallenge } from '../state/challenge-provider';
import { GoalStepperCard } from './goal-stepper-card';
import { PrimaryButton } from './primary-button';

interface GoalsEditorProps {
  submitLabel: string;
  onSubmit: () => void;
}

export function GoalsEditor({ submitLabel, onSubmit }: GoalsEditorProps) {
  const { t } = useTranslation();
  const { state, adjustGoal } = useChallenge();
  const selectedExercises = EXERCISES.filter((ex) => state.selectedIds.includes(ex.id));

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.backHeader}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <ThemedText type="heading" themeColor="textSecondary" style={styles.backGlyph}>
                ‹
              </ThemedText>
            </Pressable>
            <ThemedText type="heading" style={styles.headerTitle}>
              {t('goals.title')}
            </ThemedText>
          </View>
          <ThemedText type="body" themeColor="textSecondary">
            {t('goals.subtitle')}
          </ThemedText>
          <View style={styles.list}>
            {selectedExercises.map((exercise) => (
              <GoalStepperCard
                key={exercise.id}
                exercise={exercise}
                goal={state.goals[exercise.id] ?? exercise.defaultGoal}
                onAdjust={(delta) => adjustGoal(exercise.id, delta)}
              />
            ))}
          </View>
        </ScrollView>
        <ThemedView style={styles.footer}>
          <PrimaryButton label={submitLabel} onPress={onSubmit} />
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
    gap: Spacing.lg,
  },
  backHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.smd,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: Radii.full,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backGlyph: {
    fontSize: 16,
    lineHeight: 18,
  },
  headerTitle: {
    flexShrink: 1,
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
