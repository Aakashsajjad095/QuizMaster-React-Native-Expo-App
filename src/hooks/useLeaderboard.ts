import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector, RootState } from '../redux/store';
import {
  fetchLeaderboardStart,
  fetchGlobalLeaderboardSuccess,
  fetchLocalLeaderboardSuccess,
  fetchWeeklyLeaderboardSuccess,
  fetchMonthlyLeaderboardSuccess,
  fetchLeaderboardFailure,
  setLeaderboardType,
  updateUserRank,
} from '../redux/slices/leaderboardSlice';
import { LeaderboardEntry, LeaderboardType, User } from '../types';
import { UseLeaderboardResult } from '../types/hooks';

export const useLeaderboard = (): UseLeaderboardResult => {
  const dispatch = useAppDispatch();
  const {
    globalLeaderboard,
    localLeaderboard,
    weeklyLeaderboard,
    monthlyLeaderboard,
    currentType,
    isLoading,
    error,
  } = useAppSelector((state: RootState) => state.leaderboard);
  
  const { user } = useAppSelector((state: RootState) => state.auth);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [refreshing, setRefreshing] = useState(false);

  // Get current leaderboard based on selected type
  const getCurrentLeaderboard = useCallback((): LeaderboardEntry[] => {
    switch (currentType) {
      case 'Global':
        return globalLeaderboard;
      case 'Local':
        return localLeaderboard;
      case 'Weekly':
        return weeklyLeaderboard;
      case 'Monthly':
        return monthlyLeaderboard;
      default:
        return globalLeaderboard;
    }
  }, [currentType, globalLeaderboard, localLeaderboard, weeklyLeaderboard, monthlyLeaderboard]);

  // Get filtered leaderboard based on search and country
  const getFilteredLeaderboard = (): LeaderboardEntry[] => {
    let filtered = getCurrentLeaderboard();

    // Filter by country
    if (selectedCountry !== 'All') {
      filtered = filtered.filter((entry: LeaderboardEntry) => entry.country === selectedCountry);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((entry: LeaderboardEntry) =>
        entry.user.name.toLowerCase().includes(query) ||
        entry.country.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  // Get unique countries from current leaderboard
  const getAvailableCountries = (): string[] => {
    const countries = getCurrentLeaderboard().map((entry: LeaderboardEntry) => entry.country);
    return ['All', ...Array.from(new Set(countries)).sort()];
  };

  // Find user's position in current leaderboard
  const getUserPosition = (): { entry: LeaderboardEntry | null; rank: number } => {
    if (!user) return { entry: null, rank: -1 };
    
    const leaderboard = getCurrentLeaderboard();
    const userEntry = leaderboard.find((entry: LeaderboardEntry) => entry.user.id === user.id);
    
    if (!userEntry) {
      return { entry: null, rank: -1 };
    }
    
    return { entry: userEntry, rank: userEntry.rank };
  };

  // Get users around current user (for context)
  const getUsersAroundMe = (range: number = 2): LeaderboardEntry[] => {
    const { rank } = getUserPosition();
    if (rank === -1) return [];
    
    const leaderboard = getCurrentLeaderboard();
    const startIndex = Math.max(0, rank - range - 1);
    const endIndex = Math.min(leaderboard.length, rank + range);
    
    return leaderboard.slice(startIndex, endIndex);
  };

  // Get top N users
  const getTopUsers = (count: number = 10): LeaderboardEntry[] => {
    return getCurrentLeaderboard().slice(0, count);
  };

  // Fetch leaderboard data
  const fetchLeaderboard = useCallback(async (type: LeaderboardType): Promise<void> => {
    try {
      dispatch(fetchLeaderboardStart());
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real app, this would be actual API calls
      switch (type) {
        case LeaderboardType.Global:
          dispatch(fetchGlobalLeaderboardSuccess(globalLeaderboard));
          break;
        case LeaderboardType.Local:
          dispatch(fetchLocalLeaderboardSuccess(localLeaderboard));
          break;
        case LeaderboardType.Weekly:
          dispatch(fetchWeeklyLeaderboardSuccess(weeklyLeaderboard));
          break;
        case LeaderboardType.Monthly:
          dispatch(fetchMonthlyLeaderboardSuccess(monthlyLeaderboard));
          break;
      }
    } catch (error) {
      dispatch(fetchLeaderboardFailure('Failed to fetch leaderboard'));
    }
  }, [dispatch, globalLeaderboard, localLeaderboard, weeklyLeaderboard, monthlyLeaderboard]);

  // Refresh current leaderboard
  const refreshLeaderboard = async () => {
    setRefreshing(true);
    await fetchLeaderboard(currentType);
    setRefreshing(false);
  };

  // Switch leaderboard type
  const switchLeaderboardType = (type: LeaderboardType) => {
    dispatch(setLeaderboardType(type));
    if (getCurrentLeaderboard().length === 0) {
      fetchLeaderboard(type);
    }
  };

  // Search users
  const searchUsers = (query: string) => {
    setSearchQuery(query);
  };

  // Filter by country
  const filterByCountry = (country: string) => {
    setSelectedCountry(country);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCountry('All');
  };

  // Get user's rank change (compared to previous period)
  const getRankChange = (userId: string): { change: number; direction: 'up' | 'down' | 'same' } => {
    // This would typically compare with previous period data
    // For now, we'll simulate some rank changes
    const changes = [-2, -1, 0, 1, 2, 3];
    const change = changes[Math.floor(Math.random() * changes.length)];
    
    return {
      change: Math.abs(change),
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'same',
    };
  };

  // Get medal type for rank
  const getMedalType = (rank: number): 'gold' | 'silver' | 'bronze' | null => {
    if (rank === 1) return 'gold';
    if (rank === 2) return 'silver';
    if (rank === 3) return 'bronze';
    return null;
  };

  // Check if user is in top percentage
  const isInTopPercentage = (rank: number, percentage: number = 10): boolean => {
    const leaderboard = getCurrentLeaderboard();
    const topCount = Math.ceil(leaderboard.length * (percentage / 100));
    return rank <= topCount;
  };

  // Get leaderboard statistics
  const getLeaderboardStats = () => {
    const leaderboard = getCurrentLeaderboard();
    
    if (leaderboard.length === 0) {
      return {
        totalUsers: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        countryCount: 0,
      };
    }
    
    const scores = leaderboard.map((entry: LeaderboardEntry) => entry.score);
    const countries = new Set(leaderboard.map((entry: LeaderboardEntry) => entry.country));
    
    return {
      totalUsers: leaderboard.length,
      averageScore: scores.reduce((sum, score) => sum + score, 0) / scores.length,
      highestScore: Math.max(...scores),
      lowestScore: Math.min(...scores),
      countryCount: countries.size,
    };
  };

  // Update user's rank (when they complete a quiz)
  const updateCurrentUserRank = (newScore: number) => {
    if (!user) return;
    
    // Calculate new rank based on score
    const leaderboard = getCurrentLeaderboard();
    const betterUsers = leaderboard.filter((entry: LeaderboardEntry) => entry.score > newScore);
    const newRank = betterUsers.length + 1;
    
    dispatch(updateUserRank({
      userId: user.id,
      newRank,
      newScore,
    }));
  };

  // Auto-fetch leaderboard on mount
  useEffect(() => {
    if (getCurrentLeaderboard().length === 0) {
      fetchLeaderboard(currentType);
    }
  }, [currentType, fetchLeaderboard, getCurrentLeaderboard]);

  return {
    // Data
    leaderboard: getFilteredLeaderboard(),
    allLeaderboards: {
      global: globalLeaderboard,
      local: localLeaderboard,
      weekly: weeklyLeaderboard,
      monthly: monthlyLeaderboard,
    },
    currentType,
    
    // State
    isLoading,
    error,
    refreshing,
    searchQuery,
    selectedCountry,
    
    // User position
    userPosition: getUserPosition(),
    usersAroundMe: getUsersAroundMe(),
    
    // Actions
    fetchLeaderboard,
    refreshLeaderboard,
    switchLeaderboardType,
    searchUsers,
    filterByCountry,
    clearFilters,
    updateCurrentUserRank,
    
    // Utilities
    getTopUsers,
    getRankChange,
    getMedalType,
    isInTopPercentage,
    getLeaderboardStats,
    getAvailableCountries,
  };
};

export default useLeaderboard;