import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { IconBadge } from './icon-badge';

import type { Exercise } from '../constants/exercises';

interface GoalStepperCardProps {
  exercise: Exercise;
  goal: number;
  onAdjust: (delta: number) => void;
}

export function GoalStepperCard({ exercise, goal, onAdjust }: GoalStepperCardProps) {
  const { t } = useTranslation();

  return (
    <ThemedView type="surface" style={styles.card}>
      <View style={styles.header}>
        <IconBadge label={exercise.mono} color={exercise.accent} size="md" />
        <ThemedText type="bodyStrong">{t(`exercises.${exercise.id}.name`)}</ThemedText>
      </View>
      <View style={styles.stepperRow}>
        <Pressable
          onPress={() => onAdjust(-exercise.step)}
          style={[styles.stepButton, { backgroundColor: Colors.surfacePressed }]}
        >
          <ThemedText type="heading" style={styles.stepGlyph}>
            –
          </ThemedText>
        </Pressable>

        <View style={styles.goalColumn}>
          <ThemedText type="statLarge">{goal}</ThemedText>
          <ThemedText type="captionSmall" themeColor="textMuted">
            {t('goals.perDay', { unit: t(`exercises.${exercise.id}.unit`) })}
          </ThemedText>
        </View>

        <Pressable
          onPress={() => onAdjust(exercise.step)}
          style={[styles.stepButton, { backgroundColor: Colors[exercise.accent] }]}
        >
          <ThemedText type="heading" themeColor="onAccent" style={styles.stepGlyph}>
            +
          </ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.lg,
    borderRadius: Radii.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.base,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepButton: {
    width: 38,
    height: 38,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepGlyph: {
    fontSize: 19,
    lineHeight: 22,
  },
  goalColumn: {
    alignItems: 'center',
  },
});
