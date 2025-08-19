import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QuizState, UserAnswer, QuizResult } from '../../types';

interface GameSliceState {
  currentQuiz: QuizState | null;
  quizResults: QuizResult[];
  isGameActive: boolean;
  isPaused: boolean;
  timeRemaining: number;
  currentQuestionIndex: number;
  answers: UserAnswer[];
  score: number;
  streak: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: GameSliceState = {
  currentQuiz: null,
  quizResults: [
    {
      id: 'result-1',
      quizId: '1',
      userId: '1',
      score: 85,
      totalQuestions: 10,
      correctAnswers: 8,
      timeSpent: 450, // in seconds
      completedAt: '2024-01-15T10:30:00Z',
      answers: [
        {
          questionId: '1',
          selectedAnswer: 1,
          isCorrect: true,
          timeSpent: 25,
        },
        {
          questionId: '2',
          selectedAnswer: 2,
          isCorrect: false,
          timeSpent: 30,
        },
      ],
      incorrectAnswers: 2,
      percentage: 80,
    },
    {
      id: 'result-2',
      quizId: '2',
      userId: '1',
      score: 92,
      totalQuestions: 8,
      correctAnswers: 7,
      timeSpent: 320,
      completedAt: '2024-01-14T15:45:00Z',
      answers: [
        {
          questionId: '1',
          selectedAnswer: 0,
          isCorrect: true,
          timeSpent: 20,
        },
        {
          questionId: '2',
          selectedAnswer: 1,
          isCorrect: true,
          timeSpent: 22,
        },
      ],
      incorrectAnswers: 1,
      percentage: 87.5,
    },
  ],
  isGameActive: false,
  isPaused: false,
  timeRemaining: 0,
  currentQuestionIndex: 0,
  answers: [],
  score: 0,
  streak: 0,
  isLoading: false,
  error: null,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startQuiz: (state, action: PayloadAction<{ timeLimit: number }>) => {
      const { timeLimit } = action.payload;
      state.currentQuiz = {
        currentQuestionIndex: 0,
        answers: [],
        timeRemaining: timeLimit,
        isCompleted: false,
        score: 0,
      };
      state.isGameActive = true;
      state.isPaused = false;
      state.timeRemaining = timeLimit;
      state.currentQuestionIndex = 0;
      state.answers = [];
      state.score = 0;
      state.streak = 0;
      state.error = null;
    },
    
    pauseQuiz: (state) => {
      state.isPaused = true;
    },
    
    resumeQuiz: (state) => {
      state.isPaused = false;
    },
    
    answerQuestion: (state, action: PayloadAction<UserAnswer>) => {
      const answer = action.payload;
      state.answers.push(answer);
      
      if (answer.isCorrect) {
        state.score += 10; // Base points per correct answer
        state.streak += 1;
        
        // Bonus points for streak
        if (state.streak >= 3) {
          state.score += 5;
        }
      } else {
        state.streak = 0;
      }
      
      if (state.currentQuiz) {
        state.currentQuiz.answers = [...state.answers];
        state.currentQuiz.score = state.score;
      }
    },
    
    nextQuestion: (state) => {
      state.currentQuestionIndex += 1;
      if (state.currentQuiz) {
        state.currentQuiz.currentQuestionIndex = state.currentQuestionIndex;
      }
    },
    
    previousQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
        if (state.currentQuiz) {
          state.currentQuiz.currentQuestionIndex = state.currentQuestionIndex;
        }
      }
    },
    
    updateTimer: (state, action: PayloadAction<number>) => {
      state.timeRemaining = action.payload;
      if (state.currentQuiz) {
        state.currentQuiz.timeRemaining = action.payload;
      }
      
      if (action.payload <= 0) {
        state.isGameActive = false;
        if (state.currentQuiz) {
          state.currentQuiz.isCompleted = true;
        }
      }
    },
    
    completeQuiz: (state, action: PayloadAction<{ totalQuestions: number; timeSpent: number }>) => {
      const { totalQuestions, timeSpent } = action.payload;
      
      if (state.currentQuiz) {
        state.currentQuiz.isCompleted = true;
      }
      
      state.isGameActive = false;
      
      // Create quiz result
      const result: QuizResult = {
        id: `result-${Date.now()}`,
        quizId: 'current-quiz',
        userId: '1',
        score: state.score,
        totalQuestions,
        correctAnswers: state.answers.filter(a => a.isCorrect).length,
        incorrectAnswers: state.answers.filter(a => !a.isCorrect).length,
        percentage: (state.answers.filter(a => a.isCorrect).length / totalQuestions) * 100,
        timeSpent,
        completedAt: new Date().toISOString(),
        answers: state.answers,
      };
      
      state.quizResults.unshift(result);
    },
    
    resetGame: (state) => {
      state.currentQuiz = null;
      state.isGameActive = false;
      state.isPaused = false;
      state.timeRemaining = 0;
      state.currentQuestionIndex = 0;
      state.answers = [];
      state.score = 0;
      state.streak = 0;
      state.error = null;
    },
    
    setGameError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    clearGameError: (state) => {
      state.error = null;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    addQuizResult: (state, action: PayloadAction<QuizResult>) => {
      state.quizResults.unshift(action.payload);
    },
    
    updateQuizResult: (state, action: PayloadAction<{ id: string; updates: Partial<QuizResult> }>) => {
      const { id, updates } = action.payload;
      const resultIndex = state.quizResults.findIndex(r => r.id === id);
      if (resultIndex !== -1) {
        state.quizResults[resultIndex] = { ...state.quizResults[resultIndex], ...updates };
      }
    },
  },
});

export const {
  startQuiz,
  pauseQuiz,
  resumeQuiz,
  answerQuestion,
  nextQuestion,
  previousQuestion,
  updateTimer,
  completeQuiz,
  resetGame,
  setGameError,
  clearGameError,
  setLoading,
  addQuizResult,
  updateQuizResult,
} = gameSlice.actions;

export default gameSlice.reducer;