import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  StatusBar,
  Animated,
  Dimensions,
  TouchableOpacity,
  Alert,
  Modal,
  PanResponder,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Typography, Spacing } from '../src/constants/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const wp = (percentage: string | number) => {
  const value = typeof percentage === 'string' ? parseFloat(percentage) : percentage;
  return (screenWidth * value) / 100;
};

const hp = (percentage: string | number) => {
  const value = typeof percentage === 'string' ? parseFloat(percentage) : percentage;
  return (screenHeight * value) / 100;
};

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  questions: Question[];
  duration: number;
}

const QuizGameScreen: React.FC = () => {
  const router = useRouter();
  const { quizId } = useLocalSearchParams();
  
  // State variables
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [isPauseModalVisible, setIsPauseModalVisible] = useState(false);
  const [isExitModalVisible, setIsExitModalVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPaused, setIsPaused] = useState(false);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Array<{
    questionId: string;
    selectedAnswer: number | null;
    correctAnswer: number;
    isCorrect: boolean;
    timeSpent: number;
    question: string;
  }>>([]);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  
  // Animation refs
  const slideAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const timerPulse = useRef(new Animated.Value(1)).current;
  const explanationSlide = useRef(new Animated.Value(hp('100%'))).current;
  const optionAnimations = useRef(Array(4).fill(0).map(() => ({
    scale: new Animated.Value(1),
    opacity: new Animated.Value(1),
    translateX: new Animated.Value(0),
  }))).current;
  
  // Sample quiz data
  const sampleQuizzes: Quiz[] = [
    {
      id: '1',
      title: 'React Native Basics',
      description: 'Test your knowledge of React Native fundamentals',
      difficulty: 'Medium',
      category: 'Programming',
      duration: 5,
      questions: [
        {
          id: '1',
          question: 'What is React Native primarily used for?',
          options: [
            'Building web applications',
            'Creating mobile applications',
            'Database management',
            'Server-side development'
          ],
          correctAnswer: 1,
          explanation: 'React Native is a framework for building mobile applications using React and JavaScript, allowing developers to create native mobile apps for both iOS and Android platforms.'
        },
        {
          id: '2',
          question: 'Which company originally developed React Native?',
          options: [
            'Google',
            'Microsoft',
            'Meta (Facebook)',
            'Apple'
          ],
          correctAnswer: 2,
          explanation: 'React Native was developed by Meta (formerly Facebook) and was first released in 2015 as an open-source framework.'
        },
        {
          id: '3',
          question: 'What programming language is primarily used in React Native?',
          options: [
            'Java',
            'Swift',
            'JavaScript/TypeScript',
            'Kotlin'
          ],
          correctAnswer: 2,
          explanation: 'React Native primarily uses JavaScript and TypeScript, making it accessible to web developers who want to build mobile applications.'
        }
      ]
    }
  ];
  
  const quiz = useMemo(() => {
    return sampleQuizzes.find(q => q.id === quizId) || sampleQuizzes[0];
  }, [quizId]);
  
  const currentQuestion = quiz?.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === (quiz?.questions.length || 0) - 1;
  
  // Initialize timer and question start time
  useEffect(() => {
    if (quiz) {
      setTimeLeft(30); // 30 seconds per question
      setQuestionStartTime(Date.now());
    }
  }, [quizId, currentQuestionIndex]);
  
  // Timer effect with pulse animation
  useEffect(() => {
    if (timeLeft > 0 && !isPaused && !showExplanation && !answerRevealed) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
        
        // Pulse animation when time is running low
        if (timeLeft <= 10) {
          Animated.sequence([
            Animated.timing(timerPulse, {
              toValue: 1.2,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(timerPulse, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !answerRevealed) {
      handleTimeUp();
    }
  }, [timeLeft, isPaused, showExplanation, answerRevealed]);
  
  // Progress bar animation
  useEffect(() => {
    if (quiz?.questions.length) {
      Animated.timing(progressAnim, {
        toValue: (currentQuestionIndex + 1) / quiz.questions.length,
        duration: 800,
        useNativeDriver: false,
      }).start();
    }
  }, [currentQuestionIndex, quiz?.questions.length]);
  
  // Question transition animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.stagger(100, optionAnimations.map((anim, index) => 
        Animated.parallel([
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 500,
            delay: index * 100,
            useNativeDriver: true,
          }),
          Animated.spring(anim.translateX, {
            toValue: 0,
            tension: 100,
            friction: 8,
            delay: index * 100,
            useNativeDriver: true,
          }),
        ])
      ))
    ]).start();
  }, [currentQuestionIndex]);
  
  // Reset animations for new question
  const resetAnimations = () => {
    fadeAnim.setValue(0.3);
    scaleAnim.setValue(0.8);
    optionAnimations.forEach(anim => {
      anim.opacity.setValue(0);
      anim.scale.setValue(1);
      anim.translateX.setValue(50);
    });
    explanationSlide.setValue(hp('100%'));
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleTimeUp = () => {
    if (!answerRevealed) {
      // Record the answer (null for timeout)
      const timeSpent = Date.now() - questionStartTime;
      const answerData = {
        questionId: currentQuestion?.id || '',
        selectedAnswer: null,
        correctAnswer: currentQuestion?.correctAnswer || 0,
        isCorrect: false,
        timeSpent: Math.round(timeSpent / 1000),
        question: currentQuestion?.question || '',
      };
      setUserAnswers(prev => [...prev, answerData]);
      
      setAnswerRevealed(true);
      setShowExplanation(true);
      revealAnswer();
    }
  };
  
  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null || answerRevealed) return;
    
    setSelectedAnswer(answerIndex);
    setAnswerRevealed(true);
    
    // Calculate time spent on this question
    const timeSpent = Date.now() - questionStartTime;
    const isCorrect = answerIndex === currentQuestion?.correctAnswer;
    
    // Record the answer
    const answerData = {
      questionId: currentQuestion?.id || '',
      selectedAnswer: answerIndex,
      correctAnswer: currentQuestion?.correctAnswer || 0,
      isCorrect,
      timeSpent: Math.round(timeSpent / 1000),
      question: currentQuestion?.question || '',
    };
    setUserAnswers(prev => [...prev, answerData]);
    
    // Animate selected option
    Animated.spring(optionAnimations[answerIndex].scale, {
      toValue: 0.95,
      tension: 150,
      friction: 8,
      useNativeDriver: true,
    }).start();
    
    // Check if answer is correct
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    // Show explanation after a delay
    setTimeout(() => {
      setShowExplanation(true);
      revealAnswer();
    }, 1000);
  };
  
  const revealAnswer = () => {
    // Animate explanation slide up
    Animated.spring(explanationSlide, {
      toValue: 0,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
    
    // Animate all options to show correct/incorrect states
    optionAnimations.forEach((anim, index) => {
      const isCorrect = index === currentQuestion?.correctAnswer;
      const isSelected = index === selectedAnswer;
      
      if (isCorrect || isSelected) {
        Animated.spring(anim.scale, {
          toValue: 1.02,
          tension: 150,
          friction: 8,
          useNativeDriver: true,
        }).start();
      }
    });
  };
  
  const handleNextQuestion = () => {
    if (isLastQuestion) {
      handleQuizComplete();
    } else {
      // Reset states
      setSelectedAnswer(null);
      setShowExplanation(false);
      setAnswerRevealed(false);
      setTimeLeft(30);
      
      // Slide out current question
      Animated.timing(slideAnim, {
        toValue: -screenWidth,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        slideAnim.setValue(screenWidth);
        resetAnimations();
        
        // Slide in new question
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }
  };
  
  const handleQuizComplete = () => {
    setIsQuizCompleted(true);
    
    // Calculate detailed statistics
    const totalTimeSpent = userAnswers.reduce((total, answer) => total + answer.timeSpent, 0);
    const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length;
    const percentage = Math.round((correctAnswers / quiz.questions.length) * 100);
    
    router.push({
      pathname: '/QuizResults',
      params: {
        quizId: quiz.id,
        score: correctAnswers.toString(),
        totalQuestions: quiz.questions.length.toString(),
        quizTitle: quiz.title,
        percentage: percentage.toString(),
        totalTimeSpent: totalTimeSpent.toString(),
        userAnswers: JSON.stringify(userAnswers),
        quizData: JSON.stringify({
          id: quiz.id,
          title: quiz.title,
          difficulty: quiz.difficulty,
          category: quiz.category,
          questions: quiz.questions.length
        })
      },
    });
  };
  
  const handleTogglePause = () => {
    setIsPaused(!isPaused);
    setIsPauseModalVisible(!isPauseModalVisible);
  };
  
  const handleExitQuiz = () => {
    setIsExitModalVisible(true);
  };
  
  const confirmExit = () => {
    router.back();
  };
  
  const getOptionStyle = (index: number) => {
    const isSelected = selectedAnswer === index;
    const isCorrect = index === currentQuestion?.correctAnswer;
    const isIncorrect = isSelected && !isCorrect && answerRevealed;
    
    let backgroundColor = '#FFFFFF';
    let borderColor = '#E8E8E8';
    let shadowColor = 'rgba(0,0,0,0.1)';
    
    if (answerRevealed) {
      if (isCorrect) {
        backgroundColor = '#E8F5E8';
        borderColor = '#4CAF50';
        shadowColor = 'rgba(76, 175, 80, 0.3)';
      } else if (isIncorrect) {
        backgroundColor = '#FFEBEE';
        borderColor = '#F44336';
        shadowColor = 'rgba(244, 67, 54, 0.3)';
      }
    } else if (isSelected) {
      backgroundColor = '#F3F4FF';
      borderColor = '#667EEA';
      shadowColor = 'rgba(102, 126, 234, 0.3)';
    }
    
    return {
      backgroundColor,
      borderColor,
      shadowColor,
    };
  };
  
  const getOptionTextStyle = (index: number) => {
    const isSelected = selectedAnswer === index;
    const isCorrect = index === currentQuestion?.correctAnswer;
    const isIncorrect = isSelected && !isCorrect && answerRevealed;
    
    if (answerRevealed) {
      if (isCorrect) {
        return { color: '#2E7D32', fontWeight: '600' as const };
      } else if (isIncorrect) {
        return { color: '#C62828', fontWeight: '600' as const };
      }
    }
    
    return { color: '#2C3E50', fontWeight: '500' as const };
  };
  
  if (!currentQuestion) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667EEA" />
      
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#667EEA', '#764BA2']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity style={styles.backButton} onPress={handleExitQuiz}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle} numberOfLines={1}>
          {quiz.title}
        </Text>
        
        <TouchableOpacity style={styles.pauseButton} onPress={handleTogglePause}>
          <Ionicons name={isPaused ? "play" : "pause"} size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </LinearGradient>
      
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View 
            style={[
              styles.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              }
            ]} 
          />
        </View>
        
        <View style={styles.progressInfo}>
          <Text style={styles.progressText}>
            {currentQuestionIndex + 1} of {quiz.questions.length}
          </Text>
          
          <Animated.View 
            style={[
              styles.timerContainer,
              {
                transform: [{ scale: timerPulse }],
                backgroundColor: timeLeft <= 10 ? 'rgba(244, 67, 54, 0.2)' : 'rgba(102, 126, 234, 0.2)',
              }
            ]}
          >
            <Ionicons 
              name="time-outline" 
              size={16} 
              color={timeLeft <= 10 ? '#F44336' : '#667EEA'} 
            />
            <Text style={[
              styles.timerText,
              { color: timeLeft <= 10 ? '#F44336' : '#667EEA' }
            ]}>
              {formatTime(timeLeft)}
            </Text>
          </Animated.View>
        </View>
      </View>
      
      {/* Main Content */}
      <View style={styles.content}>
        <Animated.View 
          style={[
            styles.questionCard,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { translateX: slideAnim }
              ],
            }
          ]}
        >
          <Text style={styles.questionText}>
            {currentQuestion.question}
          </Text>
          
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => {
              const optionStyle = getOptionStyle(index);
              const textStyle = getOptionTextStyle(index);
              
              return (
                <Animated.View
                  key={index}
                  style={{
                    opacity: optionAnimations[index].opacity,
                    transform: [
                      { scale: optionAnimations[index].scale },
                      { translateX: optionAnimations[index].translateX },
                    ],
                  }}
                >
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      {
                        backgroundColor: optionStyle.backgroundColor,
                        borderColor: optionStyle.borderColor,
                        shadowColor: optionStyle.shadowColor,
                      }
                    ]}
                    onPress={() => handleAnswerSelect(index)}
                    disabled={answerRevealed}
                    activeOpacity={0.8}
                  >
                    <View style={styles.optionContent}>
                      <View style={[
                        styles.optionIndex,
                        { backgroundColor: optionStyle.borderColor }
                      ]}>
                        <Text style={[
                          styles.optionIndexText,
                          { color: answerRevealed && (index === currentQuestion.correctAnswer || selectedAnswer === index) ? '#FFFFFF' : optionStyle.borderColor }
                        ]}>
                          {String.fromCharCode(65 + index)}
                        </Text>
                      </View>
                      
                      <Text style={[
                        styles.optionText,
                        textStyle
                      ]}>
                        {option}
                      </Text>
                      
                      {answerRevealed && index === currentQuestion.correctAnswer && (
                        <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                      )}
                      
                      {answerRevealed && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                        <Ionicons name="close-circle" size={24} color="#F44336" />
                      )}
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>
      </View>
      
      {/* Explanation Panel */}
      {showExplanation && (
        <Animated.View 
          style={[
            styles.explanationPanel,
            {
              transform: [{ translateY: explanationSlide }],
            }
          ]}
        >
          <View style={styles.explanationHeader}>
            <Ionicons name="information-circle" size={24} color="#667EEA" />
            <Text style={styles.explanationTitle}>Explanation</Text>
          </View>
          
          <Text style={styles.explanationText}>
            {currentQuestion.explanation}
          </Text>
          
          <TouchableOpacity 
            style={styles.nextButton}
            onPress={handleNextQuestion}
          >
            <Text style={styles.nextButtonText}>
              {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
            </Text>
            <Ionicons 
              name={isLastQuestion ? "checkmark" : "arrow-forward"} 
              size={20} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>
        </Animated.View>
      )}
      
      {/* Pause Modal */}
      <Modal
        visible={isPauseModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleTogglePause}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="pause-circle" size={64} color="#667EEA" />
            <Text style={styles.modalTitle}>Quiz Paused</Text>
            <Text style={styles.modalText}>
              Take your time! The timer is paused.
            </Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.resumeButton]}
                onPress={handleTogglePause}
              >
                <Text style={styles.modalButtonText}>Resume</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.exitButton]}
                onPress={confirmExit}
              >
                <Text style={styles.modalButtonText}>Exit Quiz</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Exit Modal */}
      <Modal
        visible={isExitModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsExitModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="warning" size={64} color="#FF9800" />
            <Text style={styles.modalTitle}>Exit Quiz?</Text>
            <Text style={styles.modalText}>
              Are you sure you want to exit? Your progress will be lost.
            </Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsExitModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.exitButton]}
                onPress={confirmExit}
              >
                <Text style={styles.modalButtonText}>Exit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('5%'),
    paddingTop: hp('7%'),
    paddingBottom: hp('3%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  pauseButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E8E8E8',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: hp('1.5%'),
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#667EEA',
    borderRadius: 3,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    padding: wp('5%'),
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: wp('6%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    minHeight: hp('60%'),
  },
  questionText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: hp('4%'),
    lineHeight: 30,
  },
  optionsContainer: {
    gap: 16,
  },
  optionButton: {
    borderRadius: 16,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  optionIndex: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionIndexText: {
    fontSize: 14,
    fontWeight: '700',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
  explanationPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: wp('6%'),
    paddingBottom: hp('4%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    maxHeight: hp('40%'),
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  explanationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#667EEA',
  },
  explanationText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555',
    marginBottom: 24,
  },
  nextButton: {
    backgroundColor: '#667EEA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp('5%'),
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: wp('8%'),
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2C3E50',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  resumeButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#9E9E9E',
  },
  exitButton: {
    backgroundColor: '#F44336',
  },
});

export default QuizGameScreen;