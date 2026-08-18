import type { QuizSessionAction, QuizSessionState } from './types';

export const initialQuizSessionState: QuizSessionState = {
  status: 'generating',
  questions: [],
  questionIndex: 0,
  answerText: '',
  correctCount: 0,
  feedback: null,
  showExitConfirm: false,
  results: [],
};

export function quizSessionReducer(
  state: QuizSessionState,
  action: QuizSessionAction,
): QuizSessionState {
  switch (action.type) {
    case 'QUESTIONS_READY':
      return { ...state, status: 'active', questions: action.questions };

    case 'GENERATE_FAILED':
    case 'GRADE_FAILED':
      return { ...state, status: 'error' };

    case 'ANSWER_CHANGED':
      return { ...state, answerText: action.text };

    case 'SUBMIT_ANSWER':
      return state.answerText.trim().length > 0 ? { ...state, status: 'grading' } : state;

    case 'GRADED': {
      const word = state.questions[state.questionIndex]?.word;
      return {
        ...state,
        status: 'feedback',
        feedback: action.feedback,
        correctCount: state.correctCount + (action.feedback.isCorrect ? 1 : 0),
        results: word
          ? [...state.results, { word, isCorrect: action.feedback.isCorrect }]
          : state.results,
      };
    }

    case 'NEXT_QUESTION': {
      const nextIndex = state.questionIndex + 1;
      if (nextIndex >= state.questions.length) {
        return { ...state, status: 'summary' };
      }
      return {
        ...state,
        status: 'active',
        questionIndex: nextIndex,
        answerText: '',
        feedback: null,
      };
    }

    case 'REQUEST_EXIT':
      return { ...state, showExitConfirm: true };

    case 'CANCEL_EXIT':
      return { ...state, showExitConfirm: false };

    case 'RETRY':
      return { ...state, status: 'generating' };

    default:
      return state;
  }
}
