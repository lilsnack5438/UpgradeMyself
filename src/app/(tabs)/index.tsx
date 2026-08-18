import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { AllDoneBanner } from '@/features/challenge/components/all-done-banner';
import { PenaltyBanner } from '@/features/challenge/components/penalty-banner';
import { QuizTaskRow } from '@/features/challenge/components/quiz-task-row';
import { SectionLabel } from '@/features/challenge/components/section-label';
import { StreakCard } from '@/features/challenge/components/streak-card';
import { Toast } from '@/features/challenge/components/toast';
import { TodayTaskRow } from '@/features/challenge/components/today-task-row';
import { EXERCISES } from '@/features/challenge/constants/exercises';
import { REWARD_MILESTONES } from '@/features/challenge/constants/milestones';
import { useChallenge } from '@/features/challenge/state/challenge-provider';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { state, addProgress, endDay, skipDay, dismissToast } = useChallenge();
  const insets = useSafeAreaInsets();

  const selectedExercises = EXERCISES.filter((ex) => state.selectedIds.includes(ex.id));
  const allDoneToday =
    selectedExercises.length > 0 &&
    selectedExercises.every((ex) => (state.progress[ex.id] ?? 0) >= (state.goals[ex.id] ?? 0));
  const nextMilestone = REWARD_MILESTONES.find((m) => m.days > state.streak) ?? null;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.headerRow}>
            <ThemedText type="heading">{t('home.greeting')}</ThemedText>
            <Pressable onPress={() => router.push('/edit-goals')}>
              <ThemedText type="label" themeColor="accent">
                {t('home.edit')}
              </ThemedText>
            </Pressable>
          </View>

          <StreakCard
            streak={state.streak}
            history={state.history}
            nextMilestoneDays={nextMilestone?.days ?? null}
          />

          {state.penalty ? <PenaltyBanner tier={state.penalty} /> : null}

          <View style={styles.tasksSection}>
            <SectionLabel>{t('home.todayGoals')}</SectionLabel>
            <View style={styles.taskList}>
              {selectedExercises.map((exercise) =>
                exercise.kind === 'quiz' ? (
                  <QuizTaskRow
                    key={exercise.id}
                    exercise={exercise}
                    progress={state.progress[exercise.id] ?? 0}
                    goal={state.goals[exercise.id] ?? exercise.defaultGoal}
                    onStart={() => router.push(`/vocab-quiz?exerciseId=${exercise.id}`)}
                  />
                ) : (
                  <TodayTaskRow
                    key={exercise.id}
                    exercise={exercise}
                    progress={state.progress[exercise.id] ?? 0}
                    goal={state.goals[exercise.id] ?? exercise.defaultGoal}
                    onAdd={() => addProgress(exercise.id)}
                  />
                ),
              )}
            </View>
          </View>

          {allDoneToday ? (
            <AllDoneBanner onEndDay={endDay} />
          ) : (
            <Pressable onPress={skipDay} style={styles.skipLink}>
              <ThemedText type="caption" themeColor="danger" style={styles.skipText}>
                {t('home.skipDay')}
              </ThemedText>
            </Pressable>
          )}
        </ScrollView>

        {state.toast ? (
          <View
            style={[styles.toastContainer, { top: insets.top + Spacing.xl }]}
            pointerEvents="box-none"
          >
            <Toast toast={state.toast} onDismiss={dismissToast} />
          </View>
        ) : null}
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tasksSection: {
    gap: Spacing.md,
  },
  taskList: {
    gap: Spacing.smd,
  },
  skipLink: {
    alignSelf: 'center',
    paddingVertical: Spacing.xxs,
  },
  skipText: {
    textDecorationLine: 'underline',
  },
  toastContainer: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
  },
});
