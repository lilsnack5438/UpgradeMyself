import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { PenaltyTierCard } from '@/features/kien-tri/components/penalty-tier-card';
import { RewardMilestoneRow } from '@/features/kien-tri/components/reward-milestone-row';
import { SectionLabel } from '@/features/kien-tri/components/section-label';
import { PENALTY_TIERS } from '@/features/kien-tri/constants/penalty-tiers';
import { REWARD_MILESTONES } from '@/features/kien-tri/constants/milestones';
import { useKienTri } from '@/features/kien-tri/state/kien-tri-provider';

export default function RewardsScreen() {
  const { t } = useTranslation();
  const { state, resetAll } = useKienTri();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <ThemedView style={styles.header}>
            <ThemedText type="heading">{t('rewards.title')}</ThemedText>
            <ThemedText type="body" themeColor="textSecondary">
              {t('rewards.subtitle')}
            </ThemedText>
          </ThemedView>

          <View style={styles.section}>
            <SectionLabel>{t('rewards.milestonesLabel')}</SectionLabel>
            <ThemedView type="surface" style={styles.milestonesCard}>
              {REWARD_MILESTONES.map((milestone) => (
                <RewardMilestoneRow
                  key={milestone.days}
                  days={milestone.days}
                  streak={state.streak}
                />
              ))}
            </ThemedView>
          </View>

          <View style={styles.section}>
            <SectionLabel>{t('rewards.penaltiesLabel')}</SectionLabel>
            <View style={styles.penaltyList}>
              {PENALTY_TIERS.map((tier) => (
                <PenaltyTierCard key={tier.id} tier={tier} activeTier={state.penalty} />
              ))}
            </View>
          </View>

          <Pressable onPress={resetAll} style={styles.resetLink}>
            <ThemedText type="caption" themeColor="textMuted" style={styles.resetText}>
              {t('rewards.resetAll')}
            </ThemedText>
          </Pressable>
        </ScrollView>
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
    gap: Spacing.xxl,
  },
  header: {
    gap: Spacing.xs,
  },
  section: {
    gap: Spacing.md,
  },
  milestonesCard: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    borderRadius: Radii.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  penaltyList: {
    gap: Spacing.smd,
  },
  resetLink: {
    alignSelf: 'center',
  },
  resetText: {
    textDecorationLine: 'underline',
  },
});
