import { useAppDispatch, useAppSelector, RootState } from '../redux/store';
import { addQuizResult, updateQuizResult } from '../redux/slices/gameSlice';
import { updateUserStats, updateUser } from '../redux/slices/authSlice';
import { Quiz, QuizResult } from '../types';
import { useState, useMemo, useCallback } from 'react';

export const useResults = (quizResult?: QuizResult) => {
  const dispatch = useAppDispatch();
  const { quizResults } = useAppSelector((state: RootState) => state.game);
  const { user } = useAppSelector((state: RootState) => state.auth);
  const { quizzes } = useAppSelector((state: RootState) => state.quiz);

  const saveQuizResult = useCallback((result: QuizResult) => {
    dispatch(addQuizResult(result));
    if (user) {
      dispatch(updateUser({ id: user.id, totalQuizzesCompleted: (user.totalQuizzesCompleted || 0) + 1, totalScore: (user.totalScore || 0) + result.score }));
    }
  }, [dispatch, user]);

  const updateExistingQuizResult = useCallback((result: QuizResult) => {
    dispatch(updateQuizResult({ id: result.id, updates: result }));
  }, [dispatch]);

  const getQuizResultById = useCallback((resultId: string) => {
    return quizResults.find(res => res.id === resultId);
  }, [quizResults]);

  const deleteQuizResult = useCallback((resultId: string) => {
    // Implement deletion logic if needed
  }, []);

  const getQuizResultsForUser = useCallback((userId: string) => {
    return quizResults.filter(res => res.userId === userId);
  }, [quizResults]);

  const getQuizResultsForQuiz = useCallback((quizId: string) => {
    return quizResults.filter(res => res.quizId === quizId);
  }, [quizResults]);

  const getQuizResultsByDateRange = useCallback((startDate: string, endDate: string) => {
    return quizResults.filter(res => new Date(res.completedAt) >= new Date(startDate) && new Date(res.completedAt) <= new Date(endDate));
  }, [quizResults]);

  const getTopQuizResults = useCallback((count: number) => {
    return [...quizResults].sort((a, b) => b.score - a.score).slice(0, count);
  }, [quizResults]);

  const getRecentQuizResults = useCallback((count: number) => {
    return [...quizResults].sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()).slice(0, count);
  }, [quizResults]);

  const getQuizResultDetails = useCallback((resultId: string) => {
    const result = quizResults.find(res => res.id === resultId);
    if (!result) return null;
    const quiz = quizzes.find(q => q.id === result.quizId);
    return { result, quiz };
  }, [quizResults, quizzes]);

  const toggleDetailedAnalysis = useCallback(() => {
    setShowDetailedAnalysis(prev => !prev);
  }, []);

  const handleSortChange = useCallback((sortOption: 'date' | 'score' | 'accuracy') => {
    setSortBy(sortOption);
  }, []);

  const handleFilterChange = useCallback((filterOption: 'all' | 'passed' | 'failed') => {
    setFilterBy(filterOption);
  }, []);

  const [selectedResult, setSelectedResult] = useState<QuizResult | null>(quizResult || null);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'accuracy'>('date');
  const [filterBy, setFilterBy] = useState<'all' | 'passed' | 'failed'>('all');


  const filteredResults = useMemo(() => {
    let filtered = [...quizResults];
    
    // Apply filter
    if (filterBy === 'passed') {
      filtered = filtered.filter((result: QuizResult) => {
        const accuracy = (result.correctAnswers / result.totalQuestions) * 100;
        return accuracy >= 60; // 60% pass rate
      });
    } else if (filterBy === 'failed') {
      filtered = filtered.filter((result: QuizResult) => {
        const accuracy = (result.correctAnswers / result.totalQuestions) * 100;
        return accuracy < 60;
      });
    }
    
    // Apply sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
        case 'score':
          return b.score - a.score;
        case 'accuracy':
          const accuracyA = (a.correctAnswers / a.totalQuestions) * 100;
          const accuracyB = (b.correctAnswers / b.totalQuestions) * 100;
          return accuracyB - accuracyA;
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [quizResults, sortBy, filterBy]);

  const getOverallStatistics = useCallback((results: QuizResult[]) => {
    if (results.length === 0) {
      return {
        totalQuizzes: 0,
        averageScore: 0,
        averageAccuracy: 0,
        totalTimeSpent: 0,
        bestScore: 0,
        worstScore: 0,
        improvementTrend: 0,
        passRate: 0,
      };
    }
    
    const totalQuizzes = results.length;
    const totalScore = results.reduce((sum: number, result: QuizResult) => sum + result.score, 0);
    const averageScore = totalScore / totalQuizzes;
    
    const totalCorrect = results.reduce((sum: number, result: QuizResult) => sum + result.correctAnswers, 0);
    const totalQuestions = results.reduce((sum: number, result: QuizResult) => sum + result.totalQuestions, 0);
    const averageAccuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
    
    const totalTimeSpent = results.reduce((sum: number, result: QuizResult) => sum + result.timeSpent, 0);
    const bestScore = Math.max(...results.map((r: QuizResult) => r.score));
    const worstScore = Math.min(...results.map((r: QuizResult) => r.score));
    
    // Calculate improvement trend (last 5 vs first 5 quizzes)
    const recentResults = results.slice(0, 5);
    const oldResults = results.slice(-5);
    const recentAvg = recentResults.reduce((sum: number, r: QuizResult) => sum + r.score, 0) / recentResults.length;
    const oldAvg = oldResults.reduce((sum: number, r: QuizResult) => sum + r.score, 0) / oldResults.length;
    const improvementTrend = recentAvg - oldAvg;
    
    // Calculate pass rate (60% accuracy)
    const passedQuizzes = results.filter((result: QuizResult) => {
      const accuracy = (result.correctAnswers / result.totalQuestions) * 100;
      return accuracy >= 60;
    }).length;
    const passRate = (passedQuizzes / totalQuizzes) * 100;
    
    return {
      totalQuizzes,
      averageScore,
      averageAccuracy,
      totalTimeSpent,
      bestScore,
      worstScore,
      improvementTrend,
      passRate,
    };
  }, []);





















  // Get quiz name by ID
  const getQuizName = (quizId: string): string => {
    const quiz = quizzes.find((q: Quiz) => q.id === quizId);
    return quiz?.title || 'Unknown Quiz';
  };

  return {
    selectedResult,
    setSelectedResult,
    showDetailedAnalysis,
    toggleDetailedAnalysis,
    sortBy,
    handleSortChange,
    filterBy,
    handleFilterChange,
    filteredResults,
    saveQuizResult,
    updateExistingQuizResult,
    getQuizResultById,
    deleteQuizResult,
    getQuizResultsForUser,
    getQuizResultsForQuiz,
    getQuizResultsByDateRange,
    getTopQuizResults,
    getRecentQuizResults,
    getQuizResultDetails,
    getOverallStatistics,
  };




};

export default useResults;