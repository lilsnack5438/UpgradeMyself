import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { PrimaryButton } from '@/features/challenge/components/primary-button';
import { useChallenge } from '@/features/challenge/state/challenge-provider';
import { ensureDailyReminders, requestNotificationPermission } from '@/lib/notifications';

export default function OnboardingNotificationsScreen() {
  const { t } = useTranslation();
  const { startPlan } = useChallenge();

  const finishOnboarding = () => {
    startPlan();
    router.replace('/(tabs)');
  };

  const handleEnable = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      await ensureDailyReminders();
    }
    finishOnboarding();
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.content}>
          <View style={styles.badge}>
            <ThemedText type="label" themeColor="accent">
              {t('onboarding.notifications.badge')}
            </ThemedText>
          </View>
          <ThemedText type="heading" style={styles.title}>
            {t('onboarding.notifications.title')}
          </ThemedText>
          <ThemedText type="body" themeColor="textSecondary" style={styles.body}>
            {t('onboarding.notifications.body')}
          </ThemedText>
        </View>
        <View style={styles.footer}>
          <PrimaryButton label={t('onboarding.notifications.enable')} onPress={handleEnable} />
          <Pressable onPress={finishOnboarding} style={styles.skipLink}>
            <ThemedText type="label" themeColor="textMuted">
              {t('onboarding.notifications.skip')}
            </ThemedText>
          </Pressable>
        </View>
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  badge: {
    width: 64,
    height: 64,
    borderRadius: Radii.full,
    backgroundColor: Colors.accentSoft,
    borderWidth: 1.5,
    borderColor: 'rgba(247,127,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  body: {
    textAlign: 'center',
    maxWidth: 290,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
    gap: Spacing.sm,
  },
  skipLink: {
    alignSelf: 'center',
    paddingVertical: Spacing.xxs,
  },
});
