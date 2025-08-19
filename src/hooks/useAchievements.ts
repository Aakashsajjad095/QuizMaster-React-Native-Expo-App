import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Achievement, ACHIEVEMENT_DEFINITIONS, UserAchievements } from '../types/achievements';
import { QuizResult } from '../types';

const ACHIEVEMENTS_STORAGE_KEY = '@quiz_app_achievements';
const STREAK_STORAGE_KEY = '@quiz_app_streak';

interface StreakData {
  currentStreak: number;
  lastQuizDate: string;
  bestStreak: number;
}

export const useAchievements = () => {
  const [userAchievements, setUserAchievements] = useState<UserAchievements>({
    achievements: [],
    totalUnlocked: 0,
    recentlyUnlocked: []
  });
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    lastQuizDate: '',
    bestStreak: 0
  });

  // Load achievements from storage
  useEffect(() => {
    loadAchievements();
    loadStreakData();
  }, []);

  const loadAchievements = async () => {
    try {
      const stored = await AsyncStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUserAchievements(parsed);
      } else {
        // Initialize with default achievements
        const initialAchievements: Achievement[] = ACHIEVEMENT_DEFINITIONS.map(def => ({
          ...def,
          isUnlocked: false
        }));
        const initial: UserAchievements = {
          achievements: initialAchievements,
          totalUnlocked: 0,
          recentlyUnlocked: []
        };
        setUserAchievements(initial);
        await AsyncStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(initial));
      }
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  const loadStreakData = async () => {
    try {
      const stored = await AsyncStorage.getItem(STREAK_STORAGE_KEY);
      if (stored) {
        setStreakData(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading streak data:', error);
    }
  };

  const saveAchievements = async (achievements: UserAchievements) => {
    try {
      await AsyncStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(achievements));
    } catch (error) {
      console.error('Error saving achievements:', error);
    }
  };

  const saveStreakData = async (data: StreakData) => {
    try {
      await AsyncStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving streak data:', error);
    }
  };

  const updateStreak = useCallback(async () => {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
    
    let newStreakData = { ...streakData };
    
    if (streakData.lastQuizDate === today) {
      // Already played today, no change
      return newStreakData;
    } else if (streakData.lastQuizDate === yesterday) {
      // Continuing streak
      newStreakData.currentStreak += 1;
    } else {
      // Starting new streak
      newStreakData.currentStreak = 1;
    }
    
    newStreakData.lastQuizDate = today;
    newStreakData.bestStreak = Math.max(newStreakData.bestStreak, newStreakData.currentStreak);
    
    setStreakData(newStreakData);
    await saveStreakData(newStreakData);
    
    return newStreakData;
  }, [streakData]);

  const checkAchievements = useCallback(async (quizResults: QuizResult[]) => {
    const updatedStreak = await updateStreak();
    
    const stats = {
      totalQuizzes: quizResults.length,
      perfectScores: quizResults.filter(r => r.percentage === 100).length,
      totalScore: quizResults.reduce((sum, r) => sum + r.score, 0),
      categoryStats: quizResults.reduce((acc, r) => {
        acc[r.quizId] = (acc[r.quizId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };

    const newlyUnlocked: Achievement[] = [];
    const updatedAchievements = userAchievements.achievements.map(achievement => {
      if (achievement.isUnlocked) return achievement;

      let shouldUnlock = false;
      const { condition } = achievement;

      switch (condition.type) {
        case 'quizzes_completed':
          shouldUnlock = stats.totalQuizzes >= condition.target;
          break;
        case 'perfect_scores':
          shouldUnlock = stats.perfectScores >= condition.target;
          break;
        case 'streak_days':
          shouldUnlock = updatedStreak.currentStreak >= condition.target;
          break;
        case 'total_score':
          shouldUnlock = stats.totalScore >= condition.target;
          break;
        case 'category_master':
          if (condition.category) {
            const categoryCount = Object.entries(stats.categoryStats)
              .filter(([title]) => title.toLowerCase().includes(condition.category!.toLowerCase()))
              .reduce((sum, [, count]) => sum + count, 0);
            shouldUnlock = categoryCount >= condition.target;
          }
          break;
      }

      if (shouldUnlock) {
        const unlockedAchievement = {
          ...achievement,
          isUnlocked: true,
          unlockedAt: new Date()
        };
        newlyUnlocked.push(unlockedAchievement);
        return unlockedAchievement;
      }

      return achievement;
    });

    if (newlyUnlocked.length > 0) {
      const updatedUserAchievements: UserAchievements = {
        achievements: updatedAchievements,
        totalUnlocked: updatedAchievements.filter(a => a.isUnlocked).length,
        recentlyUnlocked: newlyUnlocked
      };

      setUserAchievements(updatedUserAchievements);
      await saveAchievements(updatedUserAchievements);
      
      return newlyUnlocked;
    }

    return [];
  }, [userAchievements, updateStreak]);

  const clearRecentlyUnlocked = useCallback(async () => {
    const updated = {
      ...userAchievements,
      recentlyUnlocked: []
    };
    setUserAchievements(updated);
    await saveAchievements(updated);
  }, [userAchievements]);

  const getAchievementProgress = useCallback((achievement: Achievement, quizResults: QuizResult[]) => {
    const { condition } = achievement;
    let current = 0;
    
    switch (condition.type) {
      case 'quizzes_completed':
        current = quizResults.length;
        break;
      case 'perfect_scores':
        current = quizResults.filter(r => r.percentage === 100).length;
        break;
      case 'streak_days':
        current = streakData.currentStreak;
        break;
      case 'total_score':
        current = quizResults.reduce((sum, r) => sum + r.score, 0);
        break;
      case 'category_master':
          if (condition.category) {
            current = quizResults.filter(r => 
              r.quizId.toLowerCase().includes(condition.category!.toLowerCase())
            ).length;
          }
          break;
    }
    
    return {
      current,
      target: condition.target,
      percentage: Math.min((current / condition.target) * 100, 100)
    };
  }, [streakData]);

  return {
    userAchievements,
    streakData,
    checkAchievements,
    clearRecentlyUnlocked,
    getAchievementProgress,
    loadAchievements
  };
};