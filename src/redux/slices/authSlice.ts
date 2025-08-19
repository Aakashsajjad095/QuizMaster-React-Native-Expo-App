import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://via.placeholder.com/100',
    rank: 1,
    score: 2450,
    country: 'United States',
    badges: [
      {
        id: '1',
        name: 'Quiz Master',
        icon: '🏆',
        description: 'Complete 10 quizzes',
        earnedAt: '2024-01-15',
      },
      {
        id: '2',
        name: 'Speed Demon',
        icon: '⚡',
        description: 'Answer 5 questions in under 30 seconds',
        earnedAt: '2024-01-20',
      }
    ],
    level: 1,
    totalQuizzes: 25,
    stats: {
      totalQuizzes: 25,
      correctAnswers: 180,
      averageScore: 85,
      streak: 5,
      timeSpent: 1200,
    },
  },
  isAuthenticated: true,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    updateUserStats: (state, action: PayloadAction<Partial<User['stats']>>) => {
      if (state.user) {
        state.user.stats = { ...state.user.stats, ...action.payload };
      }
    },
    addBadge: (state, action: PayloadAction<any>) => {
      if (state.user) {
        state.user.badges.push(action.payload);
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
  updateUserStats,
  addBadge,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;