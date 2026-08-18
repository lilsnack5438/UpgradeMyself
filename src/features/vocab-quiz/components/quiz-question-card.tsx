import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/features/challenge/components/primary-button';
import { Colors, Fonts, Spacing, moderateScale } from '@/constants/theme';

import type { QuizQuestion } from '../lib/ai-client';

interface QuizQuestionCardProps {
  question: QuizQuestion;
  answerText: string;
  onAnswerChange: (text: string) => void;
  onSubmit: () => void;
}

export function QuizQuestionCard({
  question,
  answerText,
  onAnswerChange,
  onSubmit,
}: QuizQuestionCardProps) {
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <ThemedText type="sectionLabel" themeColor="accentPurple" style={styles.instruction}>
        {question.prompt}
      </ThemedText>
      <ThemedText style={styles.word}>{question.word}</ThemedText>
      <TextInput
        value={answerText}
        onChangeText={onAnswerChange}
        placeholder={t('vocabQuiz.answerPlaceholder')}
        placeholderTextColor={Colors.textMuted}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={[styles.input, { borderColor: isFocused ? Colors.accentPurple : Colors.border }]}
      />
      <PrimaryButton
        label={t('vocabQuiz.submit')}
        color="accentPurple"
        disabled={answerText.trim().length === 0}
        onPress={onSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacing.xs,
  },
  instruction: {
    marginBottom: Spacing.lg,
  },
  word: {
    fontFamily: Fonts.displayExtraBold,
    fontSize: moderateScale(34),
    lineHeight: moderateScale(42),
    color: Colors.text,
    marginBottom: Spacing.xxl,
    textTransform: 'capitalize',
  },
  input: {
    fontFamily: Fonts.body,
    fontSize: moderateScale(15),
    color: Colors.text,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.lg,
    borderRadius: 14,
    borderWidth: 1.5,
    marginBottom: Spacing.lg,
  },
});
