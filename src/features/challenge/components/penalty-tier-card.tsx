import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Radii, Spacing } from '@/constants/theme';

import type { PenaltyTier } from '../constants/penalty-tiers';
import type { PenaltyTierId } from '../state/types';

interface PenaltyTierCardProps {
  tier: PenaltyTier;
  activeTier: PenaltyTierId | null;
}

export function PenaltyTierCard({ tier, activeTier }: PenaltyTierCardProps) {
  const { t } = useTranslation();
  const color = Colors[tier.color];
  const active = activeTier === tier.id;

  return (
    <ThemedView
      type="surface"
      style={[styles.card, { borderColor: active ? color : Colors.border }]}
    >
      <View style={styles.headerRow}>
        <View style={styles.levelRow}>
          <View style={[styles.levelBadge, { backgroundColor: color }]}>
            <ThemedText type="captionSmall" themeColor="onAccent" style={styles.levelText}>
              {t(`penalties.${tier.id}.level`)}
            </ThemedText>
          </View>
          <ThemedText type="label">{t(`penalties.${tier.id}.trigger`)}</ThemedText>
        </View>
        {active ? (
          <ThemedText type="captionSmall" style={{ color }}>
            {t('rewards.active')}
          </ThemedText>
        ) : null}
      </View>
      <ThemedText type="caption" themeColor="textSecondary">
        {t(`penalties.${tier.id}.effect`)}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.base,
    borderRadius: Radii.lg,
    borderWidth: 1.5,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  levelBadge: {
    paddingVertical: 3,
    paddingHorizontal: Spacing.sm,
    borderRadius: 7,
  },
  levelText: {
    fontWeight: '800',
  },
});
