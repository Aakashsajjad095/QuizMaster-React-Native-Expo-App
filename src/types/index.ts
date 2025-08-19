// Core Types for Quiz App

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  rank: number;
  score: number;
  country: string;
  badges: Badge[];
  stats: UserStats;
  level: number;
  totalQuizzes: number;
}

export interface UserStats {
  totalQuizzes: number;
  correctAnswers: number;
  averageScore: number;
  streak: number;
  timeSpent: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: QuizCategory;
  difficulty: QuizDifficulty;
  questions: Question[];
  duration: number; // in minutes
  totalQuestions: number;
  isLive: boolean;
  participants: number;
  image: string;
  imageUrl?: string;
  tags: string[];
  createdAt: string;
}

export interface Question {
  id: string;
  question: string;
  imageUrl?: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  timeLimit: number; // in seconds
  points: number;
}

export interface QuizResult {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  percentage: number;
  timeSpent: number;
  completedAt: string;
  answers: UserAnswer[];
}

export interface UserAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
}

export interface LeaderboardEntry {
  id: string;
  user: User;
  score: number;
  rank: number;
  country: string;
  rankChange?: number;
}

export interface LiveQuiz {
  id: string;
  title: string;
  category: QuizCategory;
  participants: number;
  startTime: string;
  duration: number;
  isActive: boolean;
}

export type QuizCategory = 
  | 'Math'
  | 'Science'
  | 'History'
  | 'Geography'
  | 'Literature'
  | 'General'
  | 'Science'
  | 'History'
  | 'Sports'
  | 'Technology'
  | 'Art'
  | 'Music'
  | 'Movies'
  | 'General Knowledge';

export type QuizDifficulty = 'Easy' | 'Medium' | 'Hard';

export enum LeaderboardType {
  Global = 'Global',
  Local = 'Local',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
}

// Export navigation types
export * from './navigation';

export interface QuizState {
  currentQuestionIndex: number;
  answers: UserAnswer[];
  timeRemaining: number;
  isCompleted: boolean;
  score: number;
}

export interface AppState {
  user: User | null;
  quizzes: Quiz[];
  liveQuizzes: LiveQuiz[];
  leaderboard: LeaderboardEntry[];
  currentQuiz: Quiz | null;
  quizState: QuizState | null;
  isLoading: boolean;
  error: string | null;
}