import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { HistoryDots } from './history-dots';

import type { MilestoneDays } from '../constants/milestones';
import type { HistoryEntry } from '../state/types';

interface StreakCardProps {
  streak: number;
  history: HistoryEntry[];
  nextMilestoneDays: MilestoneDays | null;
}

export function StreakCard({ streak, history, nextMilestoneDays }: StreakCardProps) {
  const { t } = useTranslation();

  return (
    <ThemedView type="surface" style={styles.card}>
      <View style={styles.avatar}>
        <ThemedText type="heading" themeColor="onAccent">
          {streak}
        </ThemedText>
      </View>
      <View style={styles.textColumn}>
        <ThemedText type="bodyStrong">{t('home.streakLabel')}</ThemedText>
        {nextMilestoneDays ? (
          <ThemedText type="caption" themeColor="textMuted" style={styles.milestoneHint}>
            {t('home.nextMilestone', {
              days: nextMilestoneDays - streak,
              title: t(`milestones.${nextMilestoneDays}.title`),
            })}
          </ThemedText>
        ) : null}
        <HistoryDots history={history} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    padding: Spacing.xl,
    borderRadius: Radii.xl,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  avatar: {
    flexShrink: 0,
    width: 64,
    height: 64,
    borderRadius: Radii.full,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    flex: 1,
    minWidth: 0,
  },
  milestoneHint: {
    marginTop: 3,
  },
});
