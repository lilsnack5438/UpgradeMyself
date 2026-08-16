import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { IconBadge } from './icon-badge';
import { ProgressBar } from './progress-bar';

import type { Exercise } from '../constants/exercises';

interface TodayTaskRowProps {
  exercise: Exercise;
  progress: number;
  goal: number;
  onAdd: () => void;
}

export function TodayTaskRow({ exercise, progress, goal, onAdd }: TodayTaskRowProps) {
  const { t } = useTranslation();
  const done = progress >= goal;

  return (
    <ThemedView type="surface" style={styles.card}>
      <View style={styles.row}>
        <IconBadge label={exercise.mono} color={exercise.accent} size="sm" />
        <View style={styles.textColumn}>
          <ThemedText type="body">{t(`exercises.${exercise.id}.name`)}</ThemedText>
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
            onPress={onAdd}
            style={[styles.addButton, { backgroundColor: Colors[exercise.accent] }]}
          >
            <ThemedText type="label" themeColor="onAccent">
              {t('home.addStep', { step: exercise.step })}
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
  progressText: {
    marginTop: 1,
  },
  addButton: {
    flexShrink: 0,
    paddingVertical: 7,
    paddingHorizontal: Spacing.base,
    borderRadius: Radii.sm,
  },
  progressBar: {
    marginTop: 11,
  },
});
