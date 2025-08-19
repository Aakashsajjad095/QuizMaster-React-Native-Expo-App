import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LeaderboardEntry, LeaderboardType } from '../../types';

interface LeaderboardState {
  globalLeaderboard: LeaderboardEntry[];
  localLeaderboard: LeaderboardEntry[];
  weeklyLeaderboard: LeaderboardEntry[];
  monthlyLeaderboard: LeaderboardEntry[];
  currentType: LeaderboardType;
  isLoading: boolean;
  error: string | null;
}

const dummyUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://via.placeholder.com/100',
    rank: 1,
    score: 2450,
    country: 'United States',
    badges: [],
    stats: {
      totalQuizzes: 25,
      correctAnswers: 180,
      averageScore: 85,
      streak: 5,
      timeSpent: 1200,
    },
  },
  {
    id: '2',
    name: 'Emma Wilson',
    email: 'emma@example.com',
    avatar: 'https://via.placeholder.com/100',
    rank: 2,
    score: 2380,
    country: 'Canada',
    badges: [],
    stats: {
      totalQuizzes: 23,
      correctAnswers: 175,
      averageScore: 83,
      streak: 4,
      timeSpent: 1150,
    },
  },
  {
    id: '3',
    name: 'Alex Chen',
    email: 'alex@example.com',
    avatar: 'https://via.placeholder.com/100',
    rank: 3,
    score: 2320,
    country: 'Singapore',
    badges: [],
    stats: {
      totalQuizzes: 22,
      correctAnswers: 170,
      averageScore: 82,
      streak: 3,
      timeSpent: 1100,
    },
  },
  {
    id: '4',
    name: 'Maria Garcia',
    email: 'maria@example.com',
    avatar: 'https://via.placeholder.com/100',
    rank: 4,
    score: 2280,
    country: 'Spain',
    badges: [],
    stats: {
      totalQuizzes: 21,
      correctAnswers: 165,
      averageScore: 81,
      streak: 2,
      timeSpent: 1050,
    },
  },
  {
    id: '5',
    name: 'David Kim',
    email: 'david@example.com',
    avatar: 'https://via.placeholder.com/100',
    rank: 5,
    score: 2250,
    country: 'South Korea',
    badges: [],
    stats: {
      totalQuizzes: 20,
      correctAnswers: 160,
      averageScore: 80,
      streak: 1,
      timeSpent: 1000,
    },
  },
  {
    id: '6',
    name: 'Sophie Martin',
    email: 'sophie@example.com',
    avatar: 'https://via.placeholder.com/100',
    rank: 6,
    score: 2200,
    country: 'France',
    badges: [],
    stats: {
      totalQuizzes: 19,
      correctAnswers: 155,
      averageScore: 79,
      streak: 0,
      timeSpent: 950,
    },
  },
  {
    id: '7',
    name: 'James Brown',
    email: 'james@example.com',
    avatar: 'https://via.placeholder.com/100',
    rank: 7,
    score: 2150,
    country: 'United Kingdom',
    badges: [],
    stats: {
      totalQuizzes: 18,
      correctAnswers: 150,
      averageScore: 78,
      streak: 0,
      timeSpent: 900,
    },
  },
  {
    id: '8',
    name: 'Lisa Anderson',
    email: 'lisa@example.com',
    avatar: 'https://via.placeholder.com/100',
    rank: 8,
    score: 2100,
    country: 'Australia',
    badges: [],
    stats: {
      totalQuizzes: 17,
      correctAnswers: 145,
      averageScore: 77,
      streak: 0,
      timeSpent: 850,
    },
  },
  {
    id: '9',
    name: 'Michael Johnson',
    email: 'michael@example.com',
    avatar: 'https://via.placeholder.com/100',
    rank: 9,
    score: 2050,
    country: 'United States',
    badges: [],
    stats: {
      totalQuizzes: 16,
      correctAnswers: 140,
      averageScore: 76,
      streak: 0,
      timeSpent: 800,
    },
  },
  {
    id: '10',
    name: 'Anna Müller',
    email: 'anna@example.com',
    avatar: 'https://via.placeholder.com/100',
    rank: 10,
    score: 2000,
    country: 'Germany',
    badges: [],
    stats: {
      totalQuizzes: 15,
      correctAnswers: 135,
      averageScore: 75,
      streak: 0,
      timeSpent: 750,
    },
  },
];

const createLeaderboardEntries = (users: any[]): LeaderboardEntry[] => {
  return users.map((user, index) => ({
    id: `entry-${user.id}`,
    user,
    score: user.score,
    rank: index + 1,
    country: user.country,
  }));
};

const initialState: LeaderboardState = {
  globalLeaderboard: createLeaderboardEntries(dummyUsers),
  localLeaderboard: createLeaderboardEntries(dummyUsers.filter(u => u.country === 'United States')),
  weeklyLeaderboard: createLeaderboardEntries(dummyUsers.slice(0, 7)),
  monthlyLeaderboard: createLeaderboardEntries(dummyUsers.slice(0, 8)),
  currentType: LeaderboardType.Global,
  isLoading: false,
  error: null,
};

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    fetchLeaderboardStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchGlobalLeaderboardSuccess: (state, action: PayloadAction<LeaderboardEntry[]>) => {
      state.isLoading = false;
      state.globalLeaderboard = action.payload;
    },
    fetchLocalLeaderboardSuccess: (state, action: PayloadAction<LeaderboardEntry[]>) => {
      state.isLoading = false;
      state.localLeaderboard = action.payload;
    },
    fetchWeeklyLeaderboardSuccess: (state, action: PayloadAction<LeaderboardEntry[]>) => {
      state.isLoading = false;
      state.weeklyLeaderboard = action.payload;
    },
    fetchMonthlyLeaderboardSuccess: (state, action: PayloadAction<LeaderboardEntry[]>) => {
      state.isLoading = false;
      state.monthlyLeaderboard = action.payload;
    },
    fetchLeaderboardFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setLeaderboardType: (state, action: PayloadAction<LeaderboardType>) => {
      state.currentType = action.payload;
    },
    updateUserRank: (state, action: PayloadAction<{ userId: string; newRank: number; newScore: number }>) => {
      const { userId, newRank, newScore } = action.payload;
      
      // Update in all leaderboards
      [state.globalLeaderboard, state.localLeaderboard, state.weeklyLeaderboard, state.monthlyLeaderboard].forEach(leaderboard => {
        const entry = leaderboard.find(e => e.user.id === userId);
        if (entry) {
          entry.rank = newRank;
          entry.score = newScore;
          entry.user.score = newScore;
          entry.user.rank = newRank;
        }
      });
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchLeaderboardStart,
  fetchGlobalLeaderboardSuccess,
  fetchLocalLeaderboardSuccess,
  fetchWeeklyLeaderboardSuccess,
  fetchMonthlyLeaderboardSuccess,
  fetchLeaderboardFailure,
  setLeaderboardType,
  updateUserRank,
  clearError,
} = leaderboardSlice.actions;

export default leaderboardSlice.reducer;