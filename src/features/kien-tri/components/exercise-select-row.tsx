import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { IconBadge } from './icon-badge';

import type { Exercise } from '../constants/exercises';

interface ExerciseSelectRowProps {
  exercise: Exercise;
  selected: boolean;
  onToggle: () => void;
}

export function ExerciseSelectRow({ exercise, selected, onToggle }: ExerciseSelectRowProps) {
  const { t } = useTranslation();
  const unit = t(`exercises.${exercise.id}.unit`);

  return (
    <Pressable onPress={onToggle}>
      <ThemedView type="surface" style={styles.row}>
        <IconBadge label={exercise.mono} color={exercise.accent} size="lg" />
        <View style={styles.textColumn}>
          <ThemedText type="bodyStrong">{t(`exercises.${exercise.id}.name`)}</ThemedText>
          <ThemedText type="caption" themeColor="textMuted" style={styles.hint}>
            {t('select.goalHint', { goal: exercise.defaultGoal, unit })}
          </ThemedText>
        </View>
        <View
          style={[
            styles.checkbox,
            {
              borderColor: selected ? Colors[exercise.accent] : Colors.borderStrong,
              backgroundColor: selected ? Colors[exercise.accent] : 'transparent',
            },
          ]}
        >
          {selected ? <View style={styles.checkboxDot} /> : null}
        </View>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    padding: Spacing.lg,
    borderRadius: Radii.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  textColumn: {
    flex: 1,
    minWidth: 0,
  },
  hint: {
    marginTop: 2,
  },
  checkbox: {
    flexShrink: 0,
    width: 24,
    height: 24,
    borderRadius: Radii.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDot: {
    width: 10,
    height: 10,
    borderRadius: Radii.full,
    backgroundColor: Colors.onAccent,
  },
});
