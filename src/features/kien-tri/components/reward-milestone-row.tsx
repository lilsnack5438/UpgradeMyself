import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { RewardRing } from './reward-ring';

import type { MilestoneDays } from '../constants/milestones';

interface RewardMilestoneRowProps {
  days: MilestoneDays;
  streak: number;
}

export function RewardMilestoneRow({ days, streak }: RewardMilestoneRowProps) {
  const { t } = useTranslation();
  const unlocked = streak >= days;
  const fraction = unlocked ? 1 : streak / days;

  return (
    <View style={styles.row}>
      <RewardRing days={days} fraction={fraction} unlocked={unlocked} />
      <View style={styles.textRow}>
        <View style={styles.textColumn}>
          <ThemedText type="bodyStrong" style={styles.title}>
            {t(`milestones.${days}.title`)}
          </ThemedText>
          <ThemedText type="captionSmall" themeColor="textMuted" style={styles.desc}>
            {t(`milestones.${days}.desc`)}
          </ThemedText>
        </View>
        <ThemedText
          type="captionSmall"
          style={[styles.status, { color: unlocked ? Colors.success : Colors.textMuted }]}
        >
          {unlocked ? t('rewards.achieved') : t('rewards.remaining', { days: days - streak })}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.base,
  },
  textRow: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.smd,
    paddingBottom: Spacing.xxl,
  },
  textColumn: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 14.5,
  },
  desc: {
    marginTop: 2,
  },
  status: {
    flexShrink: 0,
    fontWeight: '700',
  },
});
