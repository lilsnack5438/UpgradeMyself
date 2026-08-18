import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import i18n from '@/i18n';

const ANDROID_CHANNEL_ID = 'daily-reminders';
const MORNING_HOUR = 8;
const EVENING_HOUR = 20;

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: i18n.t('notifications.channelName'),
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  await ensureAndroidChannel();
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

/**
 * Cancels any previously scheduled reminders and schedules exactly the two
 * daily ones — safe to call repeatedly (e.g. every app start) without
 * accumulating duplicates, since nothing else in this app schedules
 * local notifications.
 */
export async function ensureDailyReminders(): Promise<void> {
  if (Platform.OS === 'web') return;

  await cancelAllReminders();

  const channelId = Platform.OS === 'android' ? ANDROID_CHANNEL_ID : undefined;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: i18n.t('notifications.morningTitle'),
      body: i18n.t('notifications.morningBody'),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: MORNING_HOUR,
      minute: 0,
      channelId,
    },
  });

  await Notifications.scheduleNotificationAsync({
    content: {
      title: i18n.t('notifications.eveningTitle'),
      body: i18n.t('notifications.eveningBody'),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: EVENING_HOUR,
      minute: 0,
      channelId,
    },
  });
}

export async function cancelAllReminders(): Promise<void> {
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}
