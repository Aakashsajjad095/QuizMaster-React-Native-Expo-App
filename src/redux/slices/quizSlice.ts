import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Quiz, LiveQuiz, Question } from '../../types';

export interface QuizState {
  quizzes: Quiz[];
  liveQuizzes: LiveQuiz[];
  featuredQuizzes: Quiz[];
  recentQuizzes: Quiz[];
  currentQuiz: Quiz | null;
  isLoading: boolean;
  error: string | null;
}

const dummyQuestions: Question[] = [
  {
    id: '1',
    question: 'What is the mean of the dataset: 2, 4, 6, 8, 10?',
    options: ['5', '6', '7', '8'],
    correctAnswer: 1,
    explanation: 'The mean is calculated by adding all values and dividing by the count: (2+4+6+8+10)/5 = 30/5 = 6',
    timeLimit: 30,
    points: 10,
  },
  {
    id: '2',
    question: 'What is the median of: 1, 3, 5, 7, 9?',
    options: ['3', '5', '7', '9'],
    correctAnswer: 1,
    explanation: 'The median is the middle value when numbers are arranged in order. Here it is 5.',
    timeLimit: 30,
    points: 10,
  },
];

const initialState: QuizState = {
  quizzes: [
    {
      id: '1',
      title: 'Statistics Math Quiz',
      description: 'Test your knowledge of basic statistics concepts',
      category: 'Math',
      difficulty: 'Medium',
      questions: dummyQuestions,
      duration: 15,
      totalQuestions: 12,
      isLive: true,
      participants: 1234,
      image: 'https://via.placeholder.com/300x200',
      tags: ['Statistics', 'Math', 'Data'],
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      title: 'Integers Math Quiz',
      description: 'Master the fundamentals of integer operations',
      category: 'Math',
      difficulty: 'Easy',
      questions: dummyQuestions,
      duration: 10,
      totalQuestions: 8,
      isLive: true,
      participants: 856,
      image: 'https://via.placeholder.com/300x200',
      tags: ['Integers', 'Math', 'Basic'],
      createdAt: '2024-01-14',
    },
    {
      id: '3',
      title: 'Matrices Math Quiz',
      description: 'Advanced matrix operations and transformations',
      category: 'Math',
      difficulty: 'Hard',
      questions: dummyQuestions,
      duration: 25,
      totalQuestions: 15,
      isLive: false,
      participants: 432,
      image: 'https://via.placeholder.com/300x200',
      tags: ['Matrices', 'Math', 'Advanced'],
      createdAt: '2024-01-13',
    },
    {
      id: '4',
      title: 'World Geography',
      description: 'Test your knowledge of countries, capitals, and landmarks',
      category: 'Geography',
      difficulty: 'Medium',
      questions: dummyQuestions,
      duration: 20,
      totalQuestions: 20,
      isLive: false,
      participants: 2156,
      image: 'https://via.placeholder.com/300x200',
      tags: ['Geography', 'World', 'Countries'],
      createdAt: '2024-01-12',
    },
    {
      id: '5',
      title: 'Science Fundamentals',
      description: 'Basic concepts in physics, chemistry, and biology',
      category: 'Science',
      difficulty: 'Easy',
      questions: dummyQuestions,
      duration: 18,
      totalQuestions: 16,
      isLive: false,
      participants: 1789,
      image: 'https://via.placeholder.com/300x200',
      tags: ['Science', 'Physics', 'Chemistry', 'Biology'],
      createdAt: '2024-01-11',
    },
  ],
  liveQuizzes: [
    {
      id: '1',
      title: 'Statistics Math Quiz',
      category: 'Math',
      participants: 1234,
      startTime: '2024-01-15T10:00:00Z',
      duration: 15,
      isActive: true,
    },
    {
      id: '2',
      title: 'Integers Math Quiz',
      category: 'Math',
      participants: 856,
      startTime: '2024-01-15T11:00:00Z',
      duration: 10,
      isActive: true,
    },
  ],
  featuredQuizzes: [],
  recentQuizzes: [],
  currentQuiz: null,
  isLoading: false,
  error: null,
};

// Set featured and recent quizzes from the main quizzes array
initialState.featuredQuizzes = initialState.quizzes.slice(0, 3);
initialState.recentQuizzes = initialState.quizzes.slice(2, 5);

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    fetchQuizzesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchQuizzesSuccess: (state, action: PayloadAction<Quiz[]>) => {
      state.isLoading = false;
      state.quizzes = action.payload;
      state.featuredQuizzes = action.payload.slice(0, 3);
      state.recentQuizzes = action.payload.slice(-3);
    },
    fetchQuizzesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    fetchLiveQuizzesSuccess: (state, action: PayloadAction<LiveQuiz[]>) => {
      state.liveQuizzes = action.payload;
    },
    setCurrentQuiz: (state, action: PayloadAction<Quiz>) => {
      state.currentQuiz = action.payload;
    },
    clearCurrentQuiz: (state) => {
      state.currentQuiz = null;
    },
    updateQuizParticipants: (state, action: PayloadAction<{ quizId: string; participants: number }>) => {
      const { quizId, participants } = action.payload;
      const quiz = state.quizzes.find(q => q.id === quizId);
      if (quiz) {
        quiz.participants = participants;
      }
      const liveQuiz = state.liveQuizzes.find(q => q.id === quizId);
      if (liveQuiz) {
        liveQuiz.participants = participants;
      }
    },
    addQuiz: (state, action: PayloadAction<Quiz>) => {
      state.quizzes.unshift(action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchQuizzesStart,
  fetchQuizzesSuccess,
  fetchQuizzesFailure,
  fetchLiveQuizzesSuccess,
  setCurrentQuiz,
  clearCurrentQuiz,
  updateQuizParticipants,
  addQuiz,
  clearError,
} = quizSlice.actions;

export default quizSlice.reducer;