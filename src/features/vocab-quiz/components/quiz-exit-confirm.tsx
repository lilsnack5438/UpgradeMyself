import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Radii, Spacing } from '@/constants/theme';

interface QuizExitConfirmProps {
  onStay: () => void;
  onLeave: () => void;
}

export function QuizExitConfirm({ onStay, onLeave }: QuizExitConfirmProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.backdrop}>
      <ThemedView type="surface" style={styles.card}>
        <ThemedText type="bodyStrong" style={styles.title}>
          {t('vocabQuiz.exitConfirmTitle')}
        </ThemedText>
        <ThemedText type="caption" themeColor="textSecondary" style={styles.body}>
          {t('vocabQuiz.exitConfirmBody')}
        </ThemedText>
        <Pressable onPress={onStay} style={[styles.button, { backgroundColor: Colors.accent }]}>
          <ThemedText type="label" themeColor="onAccent">
            {t('vocabQuiz.exitConfirmStay')}
          </ThemedText>
        </Pressable>
        <Pressable onPress={onLeave} style={styles.leaveButton}>
          <ThemedText type="label" themeColor="danger">
            {t('vocabQuiz.exitConfirmLeave')}
          </ThemedText>
        </Pressable>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
  },
  card: {
    width: '100%',
    maxWidth: 280,
    borderRadius: Radii.xl,
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  body: {
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  button: {
    alignSelf: 'stretch',
    paddingVertical: Spacing.md,
    borderRadius: Radii.md,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  leaveButton: {
    paddingVertical: Spacing.xs,
  },
});
