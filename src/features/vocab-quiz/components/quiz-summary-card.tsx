import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/features/challenge/components/primary-button';
import { Colors, Fonts, Spacing, moderateScale } from '@/constants/theme';

interface QuizSummaryCardProps {
  correctCount: number;
  total: number;
  onFinish: () => void;
}

export function QuizSummaryCard({ correctCount, total, onFinish }: QuizSummaryCardProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <ThemedText style={styles.score}>
        {correctCount}/{total}
      </ThemedText>
      <ThemedText type="body" themeColor="textSecondary" style={styles.label}>
        {t('vocabQuiz.correctAnswersLabel')}
      </ThemedText>
      <View style={styles.finishButton}>
        <PrimaryButton label={t('vocabQuiz.finish')} color="success" onPress={onFinish} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    fontFamily: Fonts.displayExtraBold,
    fontSize: moderateScale(40),
    lineHeight: moderateScale(48),
    color: Colors.text,
  },
  label: {
    marginTop: Spacing.xxs,
    marginBottom: Spacing.xxl,
  },
  finishButton: {
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.xxxl,
  },
});
