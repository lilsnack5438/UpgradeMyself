import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useReducer } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/features/challenge/components/primary-button';
import { Colors, Radii, Spacing } from '@/constants/theme';
import type { ExerciseId } from '@/features/challenge/constants/exercises';
import { useChallenge } from '@/features/challenge/state/challenge-provider';

import { QuizExitConfirm } from './quiz-exit-confirm';
import { QuizFeedbackBanner } from './quiz-feedback-banner';
import { QuizQuestionCard } from './quiz-question-card';
import { QuizSummaryCard } from './quiz-summary-card';
import { findWordEntries } from '../constants/word-bank';
import { useGenerateQuiz } from '../hooks/use-generate-quiz';
import { useGradeAnswer } from '../hooks/use-grade-answer';
import { initialQuizSessionState, quizSessionReducer } from '../state/reducer';
import {
  applySessionResults,
  clearTodaysWrongWords,
  loadTodaysWrongWords,
} from '../state/today-wrong-words-store';
import {
  loadWordProgress,
  pickWordsToTest,
  recordResult,
  saveWordProgress,
} from '../state/word-progress-store';

export function VocabQuizScreen() {
  const { t } = useTranslation();
  const { exerciseId: rawExerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  const exerciseId = rawExerciseId as ExerciseId;
  const { state, addProgress } = useChallenge();
  const goal = state.goals[exerciseId] ?? 5;

  const [session, dispatch] = useReducer(quizSessionReducer, initialQuizSessionState);
  const generateQuiz = useGenerateQuiz();
  const gradeAnswer = useGradeAnswer();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (session.status !== 'generating') return;
    let cancelled = false;
    const isFreshStart = (state.progress[exerciseId] ?? 0) === 0;

    (async () => {
      if (isFreshStart) {
        // A new day's attempt — any wrong words left over from a previous day
        // no longer apply, so clear them before this session's results refill it.
        await clearTodaysWrongWords();
      }
      const wrongWords = isFreshStart ? [] : await loadTodaysWrongWords();
      let words = findWordEntries(wrongWords);

      if (words.length === 0) {
        // Fresh start, or a "continue" with no recorded wrong words (shouldn't
        // normally happen — falls back to sampling the remaining question count).
        const remaining = isFreshStart ? goal : goal - (state.progress[exerciseId] ?? 0);
        const wordProgress = await loadWordProgress();
        words = pickWordsToTest(wordProgress, Math.max(1, remaining));
      }

      if (cancelled) return;
      generateQuiz.mutate(words, {
        onSuccess: (questions) => {
          if (!cancelled) dispatch({ type: 'QUESTIONS_READY', questions });
        },
        onError: () => {
          if (!cancelled) dispatch({ type: 'GENERATE_FAILED' });
        },
      });
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.status]);

  const currentQuestion = session.questions[session.questionIndex];

  function handleSubmit() {
    if (!currentQuestion) return;
    dispatch({ type: 'SUBMIT_ANSWER' });
    gradeAnswer.mutate(
      { question: currentQuestion, userAnswer: session.answerText },
      {
        onSuccess: async (result) => {
          dispatch({ type: 'GRADED', feedback: result });
          const progress = await loadWordProgress();
          await saveWordProgress(recordResult(progress, currentQuestion.word, result.isCorrect));
        },
        onError: () => dispatch({ type: 'GRADE_FAILED' }),
      },
    );
  }

  function commitAndExit() {
    for (let i = 0; i < session.correctCount; i += 1) {
      addProgress(exerciseId);
    }
    applySessionResults(session.results);
    router.back();
  }

  function handleExitPress() {
    if (session.status === 'summary') {
      commitAndExit();
    } else {
      dispatch({ type: 'REQUEST_EXIT' });
    }
  }

  const showProgressLabel = session.status !== 'generating' && session.status !== 'summary';

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
        <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
          <Pressable onPress={handleExitPress} style={styles.exitButton}>
            <ThemedText type="bodyStrong" themeColor="textSecondary">
              ×
            </ThemedText>
          </Pressable>
          <ThemedText type="label" themeColor="textMuted">
            {showProgressLabel
              ? t('vocabQuiz.progressLabel', {
                  current: session.questionIndex + 1,
                  total: session.questions.length,
                })
              : ''}
          </ThemedText>
          <View style={styles.exitButton} />
        </View>

        <View style={styles.content}>
          {session.status === 'generating' ? (
            <LoadingState label={t('vocabQuiz.generating')} />
          ) : null}

          {session.status === 'active' && currentQuestion ? (
            <QuizQuestionCard
              question={currentQuestion}
              answerText={session.answerText}
              onAnswerChange={(text) => dispatch({ type: 'ANSWER_CHANGED', text })}
              onSubmit={handleSubmit}
            />
          ) : null}

          {session.status === 'grading' ? <LoadingState label={t('vocabQuiz.grading')} /> : null}

          {session.status === 'feedback' && currentQuestion && session.feedback ? (
            <QuizFeedbackBanner
              word={currentQuestion.word}
              feedback={session.feedback}
              isLastQuestion={session.questionIndex + 1 >= session.questions.length}
              onNext={() => dispatch({ type: 'NEXT_QUESTION' })}
            />
          ) : null}

          {session.status === 'summary' ? (
            <QuizSummaryCard
              correctCount={session.correctCount}
              total={session.questions.length}
              onFinish={commitAndExit}
            />
          ) : null}

          {session.status === 'error' ? (
            <ErrorState onRetry={() => dispatch({ type: 'RETRY' })} />
          ) : null}
        </View>

        {session.showExitConfirm ? (
          <QuizExitConfirm
            onStay={() => dispatch({ type: 'CANCEL_EXIT' })}
            onLeave={() => router.back()}
          />
        ) : null}
      </SafeAreaView>
    </ThemedView>
  );
}

function LoadingState({ label }: { label: string }) {
  return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color={Colors.accentPurple} />
      <ThemedText type="body" themeColor="textSecondary" style={styles.loadingLabel}>
        {label}
      </ThemedText>
    </View>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation();
  return (
    <View style={styles.centered}>
      <ThemedText type="bodyStrong" style={styles.errorTitle}>
        {t('vocabQuiz.errorTitle')}
      </ThemedText>
      <ThemedText type="caption" themeColor="textSecondary" style={styles.errorBody}>
        {t('vocabQuiz.errorBody')}
      </ThemedText>
      <PrimaryButton label={t('vocabQuiz.retry')} onPress={onRetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  exitButton: {
    width: 34,
    height: 34,
    borderRadius: Radii.full,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  loadingLabel: {
    textAlign: 'center',
  },
  errorTitle: {
    textAlign: 'center',
  },
  errorBody: {
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
});
