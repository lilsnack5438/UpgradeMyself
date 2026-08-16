import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Colors, Radii, Spacing } from '@/constants/theme';
import { PENALTY_TIERS } from '../constants/penalty-tiers';

import type { ToastState } from '../state/types';

interface ToastProps {
  toast: ToastState;
  onDismiss: () => void;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const { t } = useTranslation();

  const accent =
    toast.type === 'reward'
      ? Colors.success
      : Colors[PENALTY_TIERS.find((p) => p.id === toast.tier)!.color];
  const glyph = toast.type === 'reward' ? '★' : '!';
  const title =
    toast.type === 'reward'
      ? t(`milestones.${toast.milestoneDays}.title`)
      : t(toast.tier === 'minor' ? 'toast.missedOneDayTitle' : 'toast.lostStreakTitle');
  const desc =
    toast.type === 'reward'
      ? t(`milestones.${toast.milestoneDays}.desc`)
      : t(`penalties.${toast.tier}.effect`);

  return (
    <Animated.View
      entering={FadeInDown.duration(250)}
      exiting={FadeOutUp.duration(200)}
      style={[styles.toast, { borderColor: accent }]}
    >
      <View style={[styles.glyphCircle, { backgroundColor: accent }]}>
        <ThemedText type="bodyStrong" themeColor="onAccent">
          {glyph}
        </ThemedText>
      </View>
      <View style={styles.textColumn}>
        <ThemedText type="label">{title}</ThemedText>
        <ThemedText type="captionSmall" themeColor="textSecondary" style={styles.desc}>
          {desc}
        </ThemedText>
      </View>
      <Pressable onPress={onDismiss} hitSlop={8}>
        <ThemedText themeColor="textMuted" style={styles.dismiss}>
          ×
        </ThemedText>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.smd,
    padding: Spacing.base,
    borderRadius: Radii.lg,
    borderWidth: 1.5,
    backgroundColor: Colors.surfacePressed,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 30,
    elevation: 12,
  },
  glyphCircle: {
    flexShrink: 0,
    width: 30,
    height: 30,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: {
    flex: 1,
    minWidth: 0,
  },
  desc: {
    marginTop: 3,
  },
  dismiss: {
    fontSize: 18,
    lineHeight: 18,
    padding: 2,
  },
});
