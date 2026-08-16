import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { PENALTY_TIERS } from '../constants/penalty-tiers';

import type { PenaltyTierId } from '../state/types';

export function PenaltyBanner({ tier }: { tier: PenaltyTierId }) {
  const { t } = useTranslation();
  const color = Colors[PENALTY_TIERS.find((p) => p.id === tier)!.color];

  return (
    <ThemedView type="surfacePressed" style={[styles.banner, { borderColor: color }]}>
      <ThemedText type="label" style={{ color }}>
        {t(tier === 'minor' ? 'home.penaltyActiveMinor' : 'home.penaltyActiveMax')}
      </ThemedText>
      <ThemedText type="caption" themeColor="textSecondary" style={styles.text}>
        {t(`penalties.${tier}.effect`)}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  banner: {
    padding: Spacing.base,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radii.md,
    borderWidth: 1.5,
  },
  text: {
    marginTop: 3,
  },
});
