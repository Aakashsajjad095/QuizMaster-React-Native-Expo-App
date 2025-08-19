import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Share,
  StatusBar,
  Animated,
  Dimensions,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing } from '../src/constants/theme';
import { useAppSelector } from '../src/redux/store';
import { AntDesign, MaterialIcons, Ionicons } from '@expo/vector-icons';

import { useResults } from '../src/hooks/useResults';
import { useAchievements } from '../src/hooks/useAchievements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Quiz, UserAnswer, QuizResult } from '../src/types';
import { RootState } from '../src/redux/store';
import ConfettiAnimation from '../src/components/animations/ConfettiAnimation';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Attractive Loading Component
const AttractiveLoader: React.FC = () => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const bounceValue = useRef(new Animated.Value(0)).current;
  const progressValue = useRef(new Animated.Value(0)).current;
  const glowValue = useRef(new Animated.Value(0)).current;
  const particleAnims = useRef(
    Array.from({ length: 8 }, () => ({
      translateY: new Animated.Value(0),
      translateX: new Animated.Value(0),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0),
      rotate: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    // Entrance animation
    Animated.timing(fadeValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.spring(scaleValue, {
      toValue: 1,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();

    // Continuous spinning animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    // Pulsing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Progress animation
    Animated.timing(progressValue, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start();

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowValue, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowValue, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Bouncing dots animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceValue, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(bounceValue, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Particle animations
    particleAnims.forEach((anim, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 200),
          Animated.parallel([
            Animated.timing(anim.opacity, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(anim.scale, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(anim.translateY, {
              toValue: -30,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(anim.rotate, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(anim.opacity, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(anim.translateY, {
              toValue: -50,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(anim.translateY, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(anim.scale, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const bounce = bounceValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const progress = progressValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
  });

  const glow = glowValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Animated.View style={[loaderStyles.container, { opacity: fadeValue, transform: [{ scale: scaleValue }] }]}>
      {/* Main spinning circle with glow effect */}
      <Animated.View style={[loaderStyles.spinnerContainer, { transform: [{ rotate: spin }] }]}>
        <Animated.View style={[loaderStyles.glowEffect, { opacity: glow }]} />
        <LinearGradient
          colors={['#667eea', '#764ba2', '#f093fb']}
          style={loaderStyles.spinner}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={loaderStyles.spinnerInner} />
        </LinearGradient>
      </Animated.View>

      {/* Pulsing brain emoji */}
      <Animated.View style={[loaderStyles.emojiContainer, { transform: [{ scale: pulseValue }] }]}>
        <Text style={loaderStyles.brainEmoji}>🧠</Text>
      </Animated.View>

      {/* Progress bar */}
      <View style={loaderStyles.progressContainer}>
        <View style={loaderStyles.progressBar}>
          <Animated.View 
            style={[
              loaderStyles.progressFill,
              {
                width: progressValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                })
              }
            ]} 
          />
        </View>
        <Text style={loaderStyles.progressText}>
           Calculating Results...
         </Text>
      </View>

      {/* Loading text with animated dots */}
      <View style={loaderStyles.textContainer}>
        <Text style={loaderStyles.loadingTitle}>Calculating Results</Text>
        <View style={loaderStyles.dotsContainer}>
          {[0, 1, 2].map((index) => (
            <Animated.View
              key={index}
              style={[
                loaderStyles.dot,
                {
                  transform: [
                    {
                      translateY: bounceValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -8],
                        extrapolate: 'clamp',
                      }),
                    },
                  ],
                  opacity: bounceValue.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0.3, 1, 0.3],
                  }),
                },
              ]}
            />
          ))}
        </View>
        <Text style={loaderStyles.loadingSubtitle}>Analyzing your performance...</Text>
      </View>

      {/* Enhanced floating particles */}
      {particleAnims.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            loaderStyles.particle,
            {
              left: `${10 + index * 10}%`,
              top: `${15 + (index % 4) * 15}%`,
              transform: [
                { translateY: anim.translateY },
                { translateX: anim.translateX },
                { scale: anim.scale },
                {
                  rotate: anim.rotate.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  })
                },
              ],
              opacity: anim.opacity,
            },
          ]}
        >
          <Text style={loaderStyles.particleEmoji}>
            {['✨', '🎯', '📊', '🏆', '💡', '🎉', '⭐', '🔥'][index]}
          </Text>
        </Animated.View>
      ))}
    </Animated.View>
  );
};

const loaderStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('8%'),
  },
  spinnerContainer: {
    marginBottom: hp('3%'),
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    width: wp('30%'),
    height: wp('30%'),
    borderRadius: wp('15%'),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    top: -wp('2.5%'),
    left: -wp('2.5%'),
  },
  spinner: {
    width: wp('25%'),
    height: wp('25%'),
    borderRadius: wp('12.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  spinnerInner: {
    width: wp('18%'),
    height: wp('18%'),
    borderRadius: wp('9%'),
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: hp('2%'),
    width: wp('60%'),
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  progressText: {
    fontSize: wp('4%'),
    fontFamily: Typography.fontFamily.bold,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  emojiContainer: {
    position: 'absolute',
    top: '35%',
  },
  brainEmoji: {
    fontSize: wp('12%'),
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  loadingTitle: {
    fontSize: wp('6%'),
    fontFamily: Typography.fontFamily.bold,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: hp('1%'),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  dot: {
    width: wp('2%'),
    height: wp('2%'),
    borderRadius: wp('1%'),
    backgroundColor: '#FFD700',
    marginHorizontal: wp('1%'),
  },
  loadingSubtitle: {
    fontSize: wp('4%'),
    fontFamily: Typography.fontFamily.medium,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  particle: {
    position: 'absolute',
  },
  particleEmoji: {
    fontSize: wp('6%'),
    opacity: 0.7,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  // Modern Header Styles
  modernHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    zIndex: 1,
  },
  modernBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  modernHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  modernHeaderSubtitle: {
    fontSize: wp('3.5%'),
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.8,
    marginTop: 2,
  },
  modernHeaderCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.lg,
    color: Colors.textSecondary,
  },
  backIcon: {
    fontSize: Typography.fontSize.lg,
    color: '#FFFFFF',
  },
  // Modern Score Card
  modernScoreCard: {
    marginBottom: 25,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  scoreCardGradient: {
    borderRadius: 24,
    padding: 30,
    position: 'relative',
    overflow: 'hidden',
  },
  floatingElement: {
    position: 'absolute',
    zIndex: 1,
  },
  floatingElement1: {
    top: 20,
    right: 30,
  },
  floatingElement2: {
    bottom: 25,
    left: 25,
  },
  floatingEmoji: {
    fontSize: 20,
    opacity: 0.6,
  },
  modernScoreHeader: {
    alignItems: 'center',
    zIndex: 2,
  },
  modernScoreEmoji: {
    fontSize: 64,
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  modernPerformanceMessage: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  modernScoreText: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  scoreDivider: {
    fontSize: 32,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginHorizontal: 8,
  },
  modernTotalText: {
    fontSize: 32,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  modernPercentageText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 1,
  },
  // Modern Stats
  modernStatsContainer: {
    marginBottom: 25,
  },
  modernStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  modernStatItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 16,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  correctStat: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  incorrectStat: {
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  timeStat: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  modernStatValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  modernStatLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Modern Insights
  modernInsightsCard: {
    marginBottom: 25,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.08)',
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modernInsightsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginLeft: 12,
  },
  modernInsightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingLeft: 8,
  },
  insightIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  modernInsightText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    lineHeight: 24,
  },
  modernNoInsightsText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
    fontStyle: 'italic',
  },
  // Modern Action Buttons
  modernActionButtons: {
    marginTop: 30,
    marginBottom: 20,
    paddingHorizontal: 8,
    gap: 16,
  },
  modernActionButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modernButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  modernButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  // New styles for the bottom sheet effect
  bottomSheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: screenHeight * 0.02,
  },
  scrollContent: {
    flex: 1,
  },
});

const QuizResultsScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Extract parameters from navigation
  const {
    quizId,
    score,
    totalQuestions,
    quizTitle,
    percentage,
    totalTimeSpent,
    userAnswers: userAnswersString,
    quizData: quizDataString
  } = params;
  
  // Memoize parsed parameters to prevent infinite loops
  const parsedParams = useMemo(() => {
    const userAnswersData = userAnswersString ? JSON.parse(Array.isArray(userAnswersString) ? userAnswersString[0] : userAnswersString) : [];
    const quizDataParsed = quizDataString ? JSON.parse(Array.isArray(quizDataString) ? quizDataString[0] : quizDataString) : null;
    
    return {
      userAnswers: userAnswersData,
      quizData: quizDataParsed,
      scoreNum: parseInt(Array.isArray(score) ? score[0] : score || '0'),
      totalQuestionsNum: parseInt(Array.isArray(totalQuestions) ? totalQuestions[0] : totalQuestions || '0'),
      percentageNum: parseInt(Array.isArray(percentage) ? percentage[0] : percentage || '0'),
      totalTimeSpentNum: parseInt(Array.isArray(totalTimeSpent) ? totalTimeSpent[0] : totalTimeSpent || '0'),
      quizTitleStr: Array.isArray(quizTitle) ? quizTitle[0] : quizTitle || 'Quiz',
      quizIdStr: Array.isArray(quizId) ? quizId[0] : quizId || ''
    };
  }, [userAnswersString, quizDataString, score, totalQuestions, percentage, totalTimeSpent, quizTitle, quizId]);
  
  const { userAnswers, quizData, scoreNum, totalQuestionsNum, percentageNum, totalTimeSpentNum, quizTitleStr, quizIdStr } = parsedParams;
  
  // Mock user and quizzes data for now
  const user = { id: '1', name: 'User' };
  const quizzes: Quiz[] = [];
  const answers = userAnswers;

  // Enhanced animation values
  const headerAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const statsAnim = useRef(new Animated.Value(0)).current;
  const insightsAnim = useRef(new Animated.Value(0)).current;
  const buttonsAnim = useRef(new Animated.Value(0)).current;
  const floatingAnim = useRef(new Animated.Value(0)).current;
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Staggered entrance animations
    Animated.stagger(150, [
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(statsAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(insightsAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(buttonsAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating animation for decorative elements
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const {
    saveQuizResult: originalSaveQuizResult,
  } = useResults();
  const { checkAchievements } = useAchievements();
  
  const saveQuizResult = useCallback((result: QuizResult) => {
    originalSaveQuizResult(result);
  }, [originalSaveQuizResult]);
  
  const [currentResult, setCurrentResult] = useState<QuizResult | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [hasSavedResult, setHasSavedResult] = useState<boolean>(false);
  const [forceShowResults, setForceShowResults] = useState<boolean>(false);
  
  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];
  const scoreAnim = useState(new Animated.Value(0))[0];
  const confettiAnim = useState(new Animated.Value(0))[0];
  const pulseAnim = useState(new Animated.Value(1))[0];
  // Helper function to generate insights based on quiz results
  const generateInsights = (result: QuizResult, quiz: Quiz): string[] => {
    const insights: string[] = [];

    if (result.percentage >= 90) {
      insights.push('Fantastic performance! You have a deep understanding of the subject.');
    } else if (result.percentage >= 70) {
      insights.push('Great job! You performed well, keep up the good work.');
    } else if (result.percentage >= 50) {
      insights.push('Good effort! There\'s room for improvement, focus on your weaker areas.');
    } else {
      insights.push('Keep practicing! Review the topics where you struggled.');
    }

    if (result.incorrectAnswers > 0) {
      insights.push(`You got ${result.incorrectAnswers} questions incorrect. Review these topics.`);
    }

    if (result.timeSpent > quiz.duration * 60 * 0.8) { // If time spent is more than 80% of duration
      insights.push('You took a bit longer than average. Try to improve your speed.');
    }

    return insights;
  };

  const quiz = quizzes.find((q: Quiz) => q.id === quizId);

  // Helper function to calculate quiz statistics
  const calculateQuizStatistics = (quiz: Quiz, answers: UserAnswer[]) => {
    let correctAnswers = 0;
    let totalScore = 0;
    let timeSpent = 0;

    answers.forEach(answer => {
      const question = quiz.questions.find(q => q.id === answer.questionId);
      if (question) {
        timeSpent += answer.timeSpent;
        if (answer.isCorrect) {
          correctAnswers++;
          totalScore += question.points;
        }
      }
    });

    const incorrectAnswers = quiz.questions.length - correctAnswers;
    const percentage = (correctAnswers / quiz.questions.length) * 100;

    return {
      score: totalScore,
      totalQuestions: quiz.questions.length,
      correctAnswers,
      incorrectAnswers,
      timeSpent,
      percentage,
    };
  };

  // Handle back button to prevent auto-navigation
  // useFocusEffect(
  //   React.useCallback(() => {
  //     const onBackPress = () => {
  //       // Prevent default back behavior
  //       return true;
  //     };

  //     const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
  //     return () => subscription?.remove();
  //   }, [])
  // );

  // Entrance animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(confettiAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Show confetti for high scores
    setTimeout(() => {
      if (currentResult && currentResult.percentage >= 70) {
        setShowConfetti(true);
      }
    }, 1000);
    
    // Start pulse animation for high scores
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Use the passed quiz data and results
  useEffect(() => {
    if (scoreNum !== undefined && totalQuestionsNum !== undefined) {
      const result: QuizResult = {
        id: `result_${Date.now()}`,
        userId: user.id,
        quizId: quizIdStr,
        score: scoreNum,
        totalQuestions: totalQuestionsNum,
        correctAnswers: scoreNum,
        incorrectAnswers: totalQuestionsNum - scoreNum,
        timeSpent: totalTimeSpentNum,
        completedAt: new Date().toISOString(),
        answers: userAnswers,
        percentage: percentageNum,
      };

      if (!hasSavedResult) {
        setCurrentResult(result);
          saveQuizResult(result);
          checkAchievements([result]);
          setHasSavedResult(true);
        
        // Animate score counter with spring effect
        Animated.spring(scoreAnim, {
          toValue: result.percentage,
          tension: 50,
          friction: 8,
          useNativeDriver: false,
        }).start();
      }

      // Generate insights based on the result
      const resultInsights: string[] = [];
      if (percentageNum >= 90) {
        resultInsights.push('Fantastic performance! You have a deep understanding of the subject.');
      } else if (percentageNum >= 70) {
        resultInsights.push('Great job! You performed well, keep up the good work.');
      } else if (percentageNum >= 50) {
        resultInsights.push('Good effort! There\'s room for improvement, focus on your weaker areas.');
      } else {
        resultInsights.push('Keep practicing! Review the topics where you struggled.');
      }

      if (result.incorrectAnswers > 0) {
        resultInsights.push(`You got ${result.incorrectAnswers} questions incorrect. Review these topics.`);
      }

      setInsights(resultInsights);
    } else {
      // Force show results after 3 seconds if no data
      const timeout = setTimeout(() => {
        setForceShowResults(true);
      }, 3000);
      
      return () => clearTimeout(timeout);
    }
  }, [scoreNum, totalQuestionsNum, percentageNum, totalTimeSpentNum, quizIdStr, hasSavedResult]);

  // Fallback effect for when data is missing
  useEffect(() => {
    if (forceShowResults && !currentResult) {
      const fallbackResult: QuizResult = {
        id: `result_${Date.now()}`,
        userId: user?.id || 'unknown',
        quizId: quizIdStr,
        score: 0,
        totalQuestions: 10,
        correctAnswers: 0,
        incorrectAnswers: 10,
        timeSpent: 0,
        completedAt: new Date().toISOString(),
        answers: userAnswers || [],
        percentage: 0,
      };
      
      setCurrentResult(fallbackResult);
      setInsights(['Unable to calculate detailed results. Please try again.']);
    }
  }, [forceShowResults, currentResult, quizIdStr, user]);
  
  const handleRetakeQuiz = () => {
    router.push('/QuizGame');
  };
  
  const handleGoHome = () => {
    router.push('/Home');
  };
  
  const handleViewLeaderboard = () => {
    router.push('/Leaderboard');
  };
  
  const handleShareResults = async () => {
    if (!currentResult || !quiz) return;
    
    try {
      const message = `I just scored ${currentResult.score}/${currentResult.totalQuestions} (${currentResult.percentage.toFixed(1)}%) on "${quiz.title}" quiz! 🎉`;
      
      await Share.share({
        message,
        title: 'Quiz Results',
      });
    } catch (error) {
      console.error('Error sharing results:', error);
    }
  };
  
  if (!currentResult && !forceShowResults) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#6C63FF" />
        <LinearGradient
          colors={['#6C63FF', '#4F46E5', '#7C3AED']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        >
          <SafeAreaView style={styles.safeArea}>
            <AttractiveLoader />
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }
  
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return Colors.success;
    if (percentage >= 60) return Colors.warning;
    return Colors.error;
  };
  
  const getScoreEmoji = (percentage: number) => {
    if (percentage >= 90) return '🏆';
    if (percentage >= 80) return '🎉';
    if (percentage >= 70) return '👏';
    if (percentage >= 60) return '👍';
    return '💪';
  };
  
  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return 'Outstanding!';
    if (percentage >= 80) return 'Excellent!';
    if (percentage >= 70) return 'Great job!';
    if (percentage >= 60) return 'Good effort!';
    return 'Keep practicing!';
  };
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6C63FF" />
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Modern Header */}
          <Animated.View 
            style={[
              styles.modernHeader,
              {
                opacity: headerAnim,
                transform: [{
                  translateY: headerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-50, 0],
                  })
                }]
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.modernBackButton}
              onPress={handleGoHome}
            >
              <AntDesign name="arrowleft" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.modernHeaderCenter}>
              <Text style={styles.modernHeaderTitle}>Quiz Complete!</Text>
              <Text style={styles.modernHeaderSubtitle}>{quizTitleStr}</Text>
            </View>
            <View style={styles.headerSpacer} />
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <ScrollView 
              style={styles.scrollContent} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContainer}
            >
              {currentResult && (
                <>
                  {/* Modern Score Card */}
                  <Animated.View
                    style={[
                      styles.modernScoreCard,
                      {
                        opacity: cardAnim,
                        transform: [
                          {
                            translateY: cardAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [100, 0],
                            })
                          },
                          {
                            scale: cardAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [0.8, 1],
                            })
                          }
                        ]
                      }
                    ]}
                  >
                    <LinearGradient
                      colors={[
                        currentResult.percentage >= 80 ? '#4facfe' : currentResult.percentage >= 60 ? '#43e97b' : '#fa709a',
                        currentResult.percentage >= 80 ? '#00f2fe' : currentResult.percentage >= 60 ? '#38f9d7' : '#fee140'
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.scoreCardGradient}
                    >
                      {/* Floating decorative elements */}
                      <Animated.View 
                        style={[
                          styles.floatingElement,
                          styles.floatingElement1,
                          {
                            transform: [{
                              translateY: floatingAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, -10],
                              })
                            }]
                          }
                        ]}
                      >
                        <Text style={styles.floatingEmoji}>✨</Text>
                      </Animated.View>
                      
                      <Animated.View 
                        style={[
                          styles.floatingElement,
                          styles.floatingElement2,
                          {
                            transform: [{
                              translateY: floatingAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 8],
                              })
                            }]
                          }
                        ]}
                      >
                        <Text style={styles.floatingEmoji}>🎯</Text>
                      </Animated.View>

                      {/* Score Content */}
                      <View style={styles.modernScoreHeader}>
                        <Animated.Text 
                          style={[
                            styles.modernScoreEmoji,
                            {
                              transform: [{
                                scale: scoreAnim.interpolate({
                                  inputRange: [0, 100],
                                  outputRange: [0.5, 1.2],
                                  extrapolate: 'clamp',
                                })
                              }]
                            }
                          ]}
                        >
                          {getScoreEmoji(percentageNum || currentResult.percentage)}
                        </Animated.Text>
                        
                        <Text style={styles.modernPerformanceMessage}>
                          {getPerformanceMessage(percentageNum || currentResult.percentage)}
                        </Text>
                        
                        <View style={styles.scoreContainer}>
                          <Text style={styles.modernScoreText}>
                            {scoreNum || currentResult.score}
                          </Text>
                          <Text style={styles.scoreDivider}>/</Text>
                          <Text style={styles.modernTotalText}>
                            {totalQuestionsNum || currentResult.totalQuestions}
                          </Text>
                        </View>
                        
                        <Text style={styles.modernPercentageText}>
                          {(percentageNum || currentResult.percentage).toFixed(1)}%
                        </Text>
                      </View>
                    </LinearGradient>
                  </Animated.View>

                  {/* Modern Stats Grid */}
                  <Animated.View
                    style={[
                      styles.modernStatsContainer,
                      {
                        opacity: statsAnim,
                        transform: [{
                          translateY: statsAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [50, 0],
                          })
                        }]
                      }
                    ]}
                  >
                    <View style={styles.modernStatsGrid}>
                      <View style={[styles.modernStatItem, styles.correctStat]}>
                        <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
                        <Text style={styles.modernStatValue}>{scoreNum || currentResult.correctAnswers}</Text>
                        <Text style={styles.modernStatLabel}>Correct</Text>
                      </View>
                      
                      <View style={[styles.modernStatItem, styles.incorrectStat]}>
                        <MaterialIcons name="cancel" size={24} color="#F44336" />
                        <Text style={styles.modernStatValue}>{(totalQuestionsNum - scoreNum) || currentResult.incorrectAnswers}</Text>
                        <Text style={styles.modernStatLabel}>Incorrect</Text>
                      </View>
                      
                      <View style={[styles.modernStatItem, styles.timeStat]}>
                        <Ionicons name="time" size={24} color="#FF9800" />
                        <Text style={styles.modernStatValue}>
                          {((totalTimeSpentNum || currentResult.timeSpent) / 60).toFixed(1)}m
                        </Text>
                        <Text style={styles.modernStatLabel}>Time</Text>
                      </View>
                    </View>
                  </Animated.View>

                  <Animated.View style={[styles.modernInsightsCard, { opacity: insightsAnim, transform: [{ translateY: insightsAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }] }]}>
                    <View style={styles.insightsHeader}>
                      <MaterialIcons name="analytics" size={24} color="#667eea" />
                      <Text style={styles.modernInsightsTitle}>Quiz Insights</Text>
                    </View>
                    {insights && insights.length > 0 ? (
                      insights.map((insight, index) => (
                        <View key={index} style={styles.modernInsightItem}>
                          <View style={styles.insightIconContainer}>
                            <MaterialIcons name="lightbulb" size={16} color="#667eea" />
                          </View>
                          <Text style={styles.modernInsightText}>{insight}</Text>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.modernNoInsightsText}>No specific insights for this quiz.</Text>
                    )}
                  </Animated.View>

                  <Animated.View style={[styles.modernActionButtons, { opacity: buttonsAnim, transform: [{ translateY: buttonsAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }] }]}>
                    <TouchableOpacity
                      style={styles.modernActionButton}
                      onPress={handleViewLeaderboard}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#667eea', '#764ba2']}
                        style={styles.modernButtonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <AntDesign name="Trophy" size={20} color="#FFFFFF" />
                        <Text style={styles.modernButtonText}>Leaderboard</Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.modernActionButton}
                      onPress={handleRetakeQuiz}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#11998e', '#38ef7d']}
                        style={styles.modernButtonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Ionicons name="refresh" size={20} color="#FFFFFF" />
                        <Text style={styles.modernButtonText}>Play Again</Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.modernActionButton}
                      onPress={handleShareResults}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#ffecd2', '#fcb69f']}
                        style={styles.modernButtonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Ionicons name="share-social" size={20} color="#FFFFFF" />
                        <Text style={styles.modernButtonText}>Share</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animated.View>
                </>
              )}
            </ScrollView>
          </Animated.View>
        </SafeAreaView>
        <ConfettiAnimation 
          isVisible={showConfetti} 
          duration={4000} 
          pieceCount={60}
        />
      </LinearGradient>
    </View>
  );
};

export default QuizResultsScreen;