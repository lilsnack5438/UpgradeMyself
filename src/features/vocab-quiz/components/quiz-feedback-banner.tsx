import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/features/challenge/components/primary-button';
import { Colors, Radii, Spacing, type ThemeColor } from '@/constants/theme';

import type { QuizFeedback } from '../state/types';

interface QuizFeedbackBannerProps {
  word: string;
  feedback: QuizFeedback;
  isLastQuestion: boolean;
  onNext: () => void;
}

export function QuizFeedbackBanner({
  word,
  feedback,
  isLastQuestion,
  onNext,
}: QuizFeedbackBannerProps) {
  const { t } = useTranslation();
  const color: ThemeColor = feedback.isCorrect ? 'success' : 'danger';

  return (
    <View style={styles.container}>
      <ThemedView type="surface" style={[styles.card, { borderColor: Colors[color] }]}>
        <ThemedText type="bodyStrong" themeColor={color} style={styles.label}>
          {t(feedback.isCorrect ? 'vocabQuiz.correct' : 'vocabQuiz.incorrect')}
        </ThemedText>
        <ThemedText type="caption" themeColor="textSecondary">
          {t('vocabQuiz.wordLabel')}{' '}
          <ThemedText type="bodyStrong" style={styles.word}>
            {word}
          </ThemedText>
        </ThemedText>
        {feedback.isCorrect ? null : (
          <ThemedText type="caption" themeColor="textSecondary" style={styles.modelAnswer}>
            {t('vocabQuiz.correctMeaningLabel')}{' '}
            <ThemedText type="bodyStrong">{feedback.modelAnswer}</ThemedText>
          </ThemedText>
        )}
      </ThemedView>
      <View style={styles.nextButton}>
        <PrimaryButton
          label={t(isLastQuestion ? 'vocabQuiz.seeResults' : 'vocabQuiz.nextQuestion')}
          onPress={onNext}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  card: {
    padding: Spacing.xl,
    borderRadius: Radii.xl,
    borderWidth: 1.5,
  },
  label: {
    marginBottom: Spacing.sm,
  },
  word: {
    textTransform: 'capitalize',
  },
  modelAnswer: {
    marginTop: Spacing.sm,
  },
  nextButton: {
    marginTop: Spacing.lg,
  },
});
