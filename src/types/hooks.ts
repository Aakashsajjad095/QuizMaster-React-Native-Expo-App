import { Quiz, QuizCategory, LiveQuiz, LeaderboardEntry, LeaderboardType } from '.';

export interface UseQuizListResult {
  quizzes: Quiz[];
  allQuizzes: Quiz[];
  liveQuizzes: LiveQuiz[];
  featuredQuizzes: Quiz[];
  recentQuizzes: Quiz[];
  filteredQuizzes: Quiz[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: QuizCategory | 'All';
  selectedDifficulty: string | 'All';
  sortBy: 'popular' | 'recent' | 'difficulty' | 'duration';
  fetchQuizzes: () => Promise<void>;
  fetchLiveQuizzes: () => Promise<void>;
  selectQuiz: (quiz: Quiz) => void;
  refreshQuizzes: () => Promise<void>;
  searchQuizzes: (query: string) => void;
  filterByCategory: (category: QuizCategory | 'All') => void;
  clearFilters: () => void;
  setSelectedDifficulty: React.Dispatch<React.SetStateAction<string | 'All'>>;
  setSortBy: React.Dispatch<React.SetStateAction<'popular' | 'recent' | 'difficulty' | 'duration'>>;
  getQuizById: (id: string) => Quiz | undefined;
  getQuizzesByCategory: (category: QuizCategory) => Quiz[];
  getPopularQuizzes: () => Quiz[];
  getRecentQuizzes: () => Quiz[];
}

export interface UseLeaderboardResult {
  leaderboard: LeaderboardEntry[];
  allLeaderboards: {
    global: LeaderboardEntry[];
    local: LeaderboardEntry[];
    weekly: LeaderboardEntry[];
    monthly: LeaderboardEntry[];
  };
  currentType: LeaderboardType;
  isLoading: boolean;
  error: string | null;
  refreshing: boolean;
  searchQuery: string;
  selectedCountry: string;
  userPosition: { entry: LeaderboardEntry | null; rank: number };
  usersAroundMe: LeaderboardEntry[];
  fetchLeaderboard: (type: LeaderboardType) => Promise<void>;
  refreshLeaderboard: () => Promise<void>;
  switchLeaderboardType: (type: LeaderboardType) => void;
  searchUsers: (query: string) => void;
  filterByCountry: (country: string) => void;
  clearFilters: () => void;
  updateCurrentUserRank: (newScore: number) => void;
  getTopUsers: (count: number) => LeaderboardEntry[];
  getRankChange: (userId: string) => { change: number; direction: 'up' | 'down' | 'same' };
  getMedalType: (rank: number) => 'gold' | 'silver' | 'bronze' | null;
  isInTopPercentage: (rank: number, percentage?: number) => boolean;
  getLeaderboardStats: () => {
    totalUsers: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
    countryCount: number;
  };
  getAvailableCountries: () => string[];
}