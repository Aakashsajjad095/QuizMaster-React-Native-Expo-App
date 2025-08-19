import { useEffect, useState } from 'react';
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector, RootState } from '../redux/store';
import {
  startQuiz,
  answerQuestion,
  nextQuestion,
  previousQuestion,
  completeQuiz,
  resetGame,
  pauseQuiz,
  resumeQuiz,
} from '../redux/slices/gameSlice';
import { Quiz, UserAnswer } from '../types';

export const useQuestionNavigation = (quiz: Quiz | null) => {
  const dispatch = useAppDispatch();
  const {
    currentQuiz,
    isGameActive,
    isPaused,
    currentQuestionIndex,
    answers,
    score,
    streak,
    timeRemaining,
  } = useAppSelector((state: RootState) => state.game);

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);

  const currentQuestion = quiz?.questions[currentQuestionIndex] || null;
  const totalQuestions = quiz?.questions.length || 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  // Check if current question is already answered
  const currentAnswer = answers.find(answer => answer.questionId === currentQuestion?.id);
  const isCurrentQuestionAnswered = !!currentAnswer;

  const startNewQuiz = () => {
    if (!quiz) return;
    
    const totalTimeLimit = quiz.duration * 60; // Convert minutes to seconds
    dispatch(startQuiz({
      timeLimit: totalTimeLimit,
    }));
    
    setGameStartTime(Date.now());
    setQuestionStartTime(Date.now());
    resetQuestionState();
  };

  const resetQuestionState = () => {
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setShowExplanation(false);
    setQuestionStartTime(Date.now());
  };

  const selectAnswer = (answerIndex: number) => {
    if (isAnswerSubmitted || !isGameActive || isPaused) return;
    setSelectedAnswer(answerIndex);
  };

  const submitAnswer = useCallback(() => {
    if (selectedAnswer === null || !currentQuestion || isAnswerSubmitted) return;

    const timeSpent = questionStartTime ? (Date.now() - questionStartTime) / 1000 : 0;
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    const userAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
      timeSpent,
    };

    dispatch(answerQuestion(userAnswer));
    setIsAnswerSubmitted(true);
    
    // Show explanation if available
    if (currentQuestion.explanation) {
      setShowExplanation(true);
    }
  }, [selectedAnswer, currentQuestion, isAnswerSubmitted, questionStartTime, dispatch]);

  const goToNextQuestion = () => {
    if (isLastQuestion) {
      finishQuiz();
    } else {
      dispatch(nextQuestion());
      resetQuestionState();
    }
  };

  const goToPreviousQuestion = () => {
    if (!isFirstQuestion) {
      dispatch(previousQuestion());
      resetQuestionState();
      
      // Restore previous answer if exists
      const prevQuestion = quiz?.questions[currentQuestionIndex - 1];
      if (prevQuestion) {
        const prevAnswer = answers.find(a => a.questionId === prevQuestion.id);
        if (prevAnswer) {
          setSelectedAnswer(prevAnswer.selectedAnswer);
          setIsAnswerSubmitted(true);
        }
      }
    }
  };

  const jumpToQuestion = (questionIndex: number) => {
    if (questionIndex < 0 || questionIndex >= totalQuestions) return;
    
    // Update current question index in Redux
    const diff = questionIndex - currentQuestionIndex;
    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        dispatch(nextQuestion());
      }
    } else if (diff < 0) {
      for (let i = 0; i < Math.abs(diff); i++) {
        dispatch(previousQuestion());
      }
    }
    
    resetQuestionState();
    
    // Restore answer if exists
    const targetQuestion = quiz?.questions[questionIndex];
    if (targetQuestion) {
      const existingAnswer = answers.find(a => a.questionId === targetQuestion.id);
      if (existingAnswer) {
        setSelectedAnswer(existingAnswer.selectedAnswer);
        setIsAnswerSubmitted(true);
      }
    }
  };

  const pauseGame = () => {
    dispatch(pauseQuiz());
  };

  const resumeGame = () => {
    dispatch(resumeQuiz());
    setQuestionStartTime(Date.now()); // Reset question timer
  };

  const finishQuiz = () => {
    if (!gameStartTime) return;
    
    const totalTimeSpent = (Date.now() - gameStartTime) / 1000;
    dispatch(completeQuiz({
      totalQuestions,
      timeSpent: totalTimeSpent,
    }));
  };

  const quitQuiz = () => {
    dispatch(resetGame());
    setGameStartTime(null);
    setQuestionStartTime(null);
    resetQuestionState();
  };

  const getQuestionStatus = (questionIndex: number) => {
    const question = quiz?.questions[questionIndex];
    if (!question) return 'unanswered';
    
    const answer = answers.find(a => a.questionId === question.id);
    if (!answer) return 'unanswered';
    
    return answer.isCorrect ? 'correct' : 'incorrect';
  };

  const getAnsweredQuestionsCount = () => {
    return answers.length;
  };

  const getCorrectAnswersCount = () => {
    return answers.filter(a => a.isCorrect).length;
  };

  const getAccuracy = () => {
    if (answers.length === 0) return 0;
    return (getCorrectAnswersCount() / answers.length) * 100;
  };

  // Auto-submit answer when time runs out for current question
  useEffect(() => {
    if (currentQuestion && selectedAnswer !== null && !isAnswerSubmitted) {
      const questionTimeLimit = currentQuestion.timeLimit * 1000; // Convert to milliseconds
      const elapsed = questionStartTime ? Date.now() - questionStartTime : 0;
      
      if (elapsed >= questionTimeLimit) {
        submitAnswer();
      }
    }
  }, [currentQuestion, selectedAnswer, isAnswerSubmitted, questionStartTime, submitAnswer]);

  // Reset question state when question changes
  useEffect(() => {
    if (currentQuestion && !isCurrentQuestionAnswered) {
      resetQuestionState();
    } else if (currentAnswer) {
      setSelectedAnswer(currentAnswer.selectedAnswer);
      setIsAnswerSubmitted(true);
    }
  }, [currentQuestionIndex, currentQuestion, currentAnswer, isCurrentQuestionAnswered]);

  return {
    // Current state
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    selectedAnswer,
    isAnswerSubmitted,
    showExplanation,
    
    // Game state
    isGameActive,
    isPaused,
    score,
    streak,
    timeRemaining,
    progress,
    
    // Question navigation
    isFirstQuestion,
    isLastQuestion,
    isCurrentQuestionAnswered,
    
    // Actions
    startNewQuiz,
    selectAnswer,
    submitAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    jumpToQuestion,
    pauseGame,
    resumeGame,
    finishQuiz,
    quitQuiz,
    
    // Utilities
    getQuestionStatus,
    getAnsweredQuestionsCount,
    getCorrectAnswersCount,
    getAccuracy,
    
    // UI state
    setShowExplanation,
  };
};

export default useQuestionNavigation;