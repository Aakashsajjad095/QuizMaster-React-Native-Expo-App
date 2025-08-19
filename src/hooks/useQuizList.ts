import { useState, useEffect, useCallback } from 'react';

import { useAppDispatch, useAppSelector, RootState } from '../redux/store/index';
import {
  fetchQuizzesStart,
  fetchQuizzesSuccess,
  fetchQuizzesFailure,
  fetchLiveQuizzesSuccess,
  setCurrentQuiz,
  QuizState,
} from '../redux/slices/quizSlice';
import { Quiz, QuizCategory, LiveQuiz } from '../types';
import { UseQuizListResult } from '@/src/types/hooks';

export const useQuizList = (): UseQuizListResult => {
  const dispatch = useAppDispatch();
  const {
    quizzes = [],
    liveQuizzes = [],
    featuredQuizzes = [],
    recentQuizzes = [],
    isLoading = false,
    error = null,
  } = useAppSelector((state: RootState) => state.quiz || {} as QuizState);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | 'All'>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | 'All'>('All');
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'difficulty' | 'duration'>('popular');
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);

  // Filter quizzes based on search and category
  useEffect(() => {
    let filtered = [...quizzes];

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((quiz: Quiz) => quiz.category === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter((quiz: Quiz) => quiz.difficulty === selectedDifficulty);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((quiz: Quiz) =>
        quiz.title.toLowerCase().includes(query) ||
        quiz.description.toLowerCase().includes(query) ||
        quiz.tags.some((tag: string) => tag.toLowerCase().includes(query))
      );
    }

    // Sort quizzes
    switch (sortBy) {
      case 'popular':
        filtered.sort((a: Quiz, b: Quiz) => b.participants - a.participants);
        break;
      case 'recent':
        filtered.sort((a: Quiz, b: Quiz) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'difficulty':
        const difficultyOrder: { [key: string]: number } = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
        filtered.sort((a: Quiz, b: Quiz) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
        break;
      case 'duration':
        filtered.sort((a: Quiz, b: Quiz) => a.duration - b.duration);
        break;
    }

    setFilteredQuizzes(filtered);
  }, [quizzes, searchQuery, selectedCategory, selectedDifficulty, sortBy]);

  const fetchQuizzes = useCallback(async () => {
    try {
      dispatch(fetchQuizzesStart());
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real app, this would be an actual API call
      // For now, we're using the dummy data from Redux
    } catch (err) {
      dispatch(fetchQuizzesFailure('Failed to fetch quizzes'));
    }
  }, [dispatch]);

  const fetchLiveQuizzes = useCallback(async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // In real app, this would be an actual API call
      // For now, we're using the dummy data from Redux
    } catch (err: any) {
      console.error('Failed to fetch live quizzes:', err);
    }
  }, [dispatch]);

  const selectQuiz = (quiz: Quiz) => {
    dispatch(setCurrentQuiz(quiz));
  };

  const refreshQuizzes = async () => {
    await Promise.all([fetchQuizzes(), fetchLiveQuizzes()]);
  };

  const getQuizById = (id: string): Quiz | undefined => {
    return quizzes.find((quiz: Quiz) => quiz.id === id);
  };

  const getQuizzesByCategory = (category: QuizCategory): Quiz[] => {
    return quizzes.filter((quiz: Quiz) => quiz.category === category);
  };

  const getPopularQuizzes = (): Quiz[] => {
    return [...quizzes]
      .sort((a: Quiz, b: Quiz) => b.participants - a.participants)
      .slice(0, 5);
  };

  const getRecentQuizzes = (): Quiz[] => {
    return [...quizzes]
      .sort((a: Quiz, b: Quiz) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  };

  const searchQuizzes = (query: string) => {
    setSearchQuery(query);
  };

  const filterByCategory = (category: QuizCategory | 'All') => {
    setSelectedCategory(category);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  // Auto-fetch on mount
  useEffect(() => {
    if (quizzes.length === 0) {
      fetchQuizzes();
    }
    if (liveQuizzes.length === 0) {
      fetchLiveQuizzes();
    }
  }, [fetchLiveQuizzes, fetchQuizzes, liveQuizzes.length, quizzes.length]);


  return {

    // Data
    quizzes: filteredQuizzes,
    allQuizzes: quizzes,
    liveQuizzes,
    featuredQuizzes,
    recentQuizzes,
    
    // State
    isLoading,
    error,
    searchQuery,
    selectedCategory,
    selectedDifficulty,
    sortBy,
    
    // Actions
    fetchQuizzes,
    fetchLiveQuizzes,
    selectQuiz,
    refreshQuizzes,
    searchQuizzes,
    filterByCategory,
    clearFilters,
    setSelectedDifficulty,
    setSortBy,
    
    // Utilities
    getQuizById,
    getQuizzesByCategory,
    getPopularQuizzes,
    getRecentQuizzes,
  };
};

export default useQuizList;