import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Radii, Spacing, type ThemeColor } from '@/constants/theme';

interface NotificationSettingsCardProps {
  enabled: boolean;
  onEnable: () => void;
}

export function NotificationSettingsCard({ enabled, onEnable }: NotificationSettingsCardProps) {
  const { t } = useTranslation();

  return (
    <ThemedView type="surface" style={styles.card}>
      <View style={styles.headerRow}>
        <ThemedText type="bodyStrong">{t('rewards.dailyReminders')}</ThemedText>
        {enabled ? (
          <ThemedText type="captionSmall" themeColor="success">
            {t('rewards.notifEnabled')}
          </ThemedText>
        ) : (
          <Pressable onPress={onEnable} style={styles.enableButton}>
            <ThemedText type="captionSmall" themeColor="onAccent" style={styles.enableText}>
              {t('rewards.enableNotifs')}
            </ThemedText>
          </Pressable>
        )}
      </View>
      <View style={styles.reminderList}>
        <ReminderInfoRow
          label={t('notifications.morningLabel')}
          body={t('notifications.morningBody')}
          color="accent"
        />
        <ReminderInfoRow
          label={t('notifications.eveningLabel')}
          body={t('notifications.eveningBody')}
          color="accentCyan"
        />
      </View>
    </ThemedView>
  );
}

interface ReminderInfoRowProps {
  label: string;
  body: string;
  color: ThemeColor;
}

function ReminderInfoRow({ label, body, color }: ReminderInfoRowProps) {
  return (
    <ThemedView type="surfacePressed" style={styles.reminderRow}>
      <ThemedText type="captionSmall" themeColor={color} style={styles.reminderLabel}>
        {label}
      </ThemedText>
      <ThemedText type="caption" themeColor="textSecondary">
        {body}
      </ThemedText>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.base,
  },
  enableButton: {
    paddingVertical: Spacing.xxs,
    paddingHorizontal: Spacing.sm,
    borderRadius: 9,
    backgroundColor: Colors.accent,
  },
  enableText: {
    fontWeight: '700',
  },
  reminderList: {
    gap: Spacing.smd,
  },
  reminderRow: {
    padding: Spacing.md,
    borderRadius: Radii.md,
  },
  reminderLabel: {
    fontWeight: '700',
    marginBottom: 3,
  },
});
