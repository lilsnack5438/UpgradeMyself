import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { AiBadge } from './ai-badge';
import { IconBadge } from './icon-badge';
import { ProgressBar } from './progress-bar';

import type { QuizExercise } from '../constants/exercises';

interface QuizTaskRowProps {
  exercise: QuizExercise;
  progress: number;
  goal: number;
  onStart: () => void;
}

export function QuizTaskRow({ exercise, progress, goal, onStart }: QuizTaskRowProps) {
  const { t } = useTranslation();
  const done = progress >= goal;

  return (
    <ThemedView type="surface" style={styles.card}>
      <View style={styles.row}>
        <IconBadge label={exercise.mono} color={exercise.accent} size="sm" />
        <View style={styles.textColumn}>
          <View style={styles.nameRow}>
            <ThemedText type="body">{t(`exercises.${exercise.id}.name`)}</ThemedText>
            <AiBadge />
          </View>
          <ThemedText type="captionSmall" themeColor="textMuted" style={styles.progressText}>
            {t('home.taskProgress', {
              progress,
              goal,
              unit: t(`exercises.${exercise.id}.unit`),
            })}
          </ThemedText>
        </View>
        {done ? (
          <ThemedText type="label" themeColor="success">
            {t('home.done')}
          </ThemedText>
        ) : (
          <Pressable
            onPress={onStart}
            style={[styles.actionButton, { backgroundColor: Colors[exercise.accent] }]}
          >
            <ThemedText type="label" themeColor="onAccent">
              {t(progress > 0 ? 'home.continueQuiz' : 'home.startQuiz')}
            </ThemedText>
          </Pressable>
        )}
      </View>
      <View style={styles.progressBar}>
        <ProgressBar progress={progress} goal={goal} color={exercise.accent} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.base,
    borderRadius: Radii.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  textColumn: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  progressText: {
    marginTop: 1,
  },
  actionButton: {
    flexShrink: 0,
    paddingVertical: 7,
    paddingHorizontal: Spacing.base,
    borderRadius: Radii.sm,
  },
  progressBar: {
    marginTop: 11,
  },
});
