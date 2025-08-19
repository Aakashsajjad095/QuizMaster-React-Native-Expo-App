import React, { useEffect, useState, useCallback } from 'react';
import {
   View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
  Image,
  Animated,
  ListRenderItem,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
 import { Ionicons } from '@expo/vector-icons';
 import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing } from '../src/constants/theme';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AnimatedThemeToggle from '../src/components/AnimatedThemeToggle';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  topHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    paddingTop: hp('1%'),
    paddingBottom: hp('1%'),
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('4%'),
  },
  notificationButton: {
    position: 'relative',
    padding: wp('2%'),
    borderRadius: wp('3%'),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#667eea',
  },
  notificationBadgeText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: wp('2.5%'),
    color: '#ffffff',
    fontWeight: '700',
  },
  profileButton: {
    position: 'relative',
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  profileBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#667eea',
  },
  greeting: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.lg,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: Spacing.xs,
  },
  userName: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize['2xl'],
    color: '#fff',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.base,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -20,
    paddingTop: hp('3%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  searchContainer: {
    paddingHorizontal: wp('5%'),
    marginBottom: hp('2.5%'),
  },
  searchIcon: {
    fontSize: Typography.fontSize.lg,
  },
  section: {
    marginBottom: hp('3%'),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    marginBottom: hp('2%'),
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: wp('5.5%'),
    color: '#1a1a1a',
    fontWeight: '700',
  },
  seeAllText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: wp('3.8%'),
    color: Colors.primary,
    fontWeight: '600',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('3%'),
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderRadius: wp('4%'),
  },
  horizontalList: {
    paddingHorizontal: wp('5%'),
    paddingBottom: hp('1%'),
  },
  liveQuizItem: {
    marginRight: wp('4%'),
    width: wp('72%'),
  },
  liveQuizCard: {
    padding: wp('5%'),
    backgroundColor: '#ffffff',
    borderRadius: wp('5%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.08)',
  },
  liveQuizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  liveBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.8%'),
    borderRadius: wp('3%'),
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  liveBadgeText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.xs,
    color: Colors.textWhite,
  },
  liveQuizParticipants: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  liveQuizTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  liveQuizStats: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  liveQuizStat: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  featuredQuizItem: {
    marginRight: wp('4%'),
    width: wp('82%'),
  },
  featuredQuizTouchable: {
    borderRadius: wp('6%'),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  featuredQuizGradient: {
    borderRadius: wp('6%'),
    padding: wp('5%'),
    minHeight: hp('25%'),
  },
  featuredQuizContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  featuredQuizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  featuredQuizBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.8%'),
    borderRadius: wp('4%'),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  featuredQuizBadgeText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: wp('3%'),
    color: '#ffffff',
    fontWeight: '700',
  },
  featuredQuizDifficulty: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.8%'),
    borderRadius: wp('4%'),
  },
  featuredQuizDifficultyText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: wp('3%'),
    color: '#ffffff',
    fontWeight: '600',
  },
  featuredQuizBody: {
    flex: 1,
    marginBottom: hp('2%'),
  },
  featuredQuizTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: wp('5.5%'),
    color: '#ffffff',
    marginBottom: hp('1%'),
    fontWeight: '700',
    lineHeight: wp('7%'),
  },
  featuredQuizDescription: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: wp('3.8%'),
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: hp('2%'),
    lineHeight: wp('5.5%'),
  },
  featuredQuizStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('1%'),
  },
  featuredQuizStat: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1%'),
    borderRadius: wp('4%'),
    gap: wp('1.5%'),
  },
  featuredQuizStatText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: wp('3.2%'),
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  featuredQuizButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: hp('1.8%'),
    paddingHorizontal: wp('6%'),
    borderRadius: wp('6%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    gap: wp('2%'),
  },
  featuredQuizButtonText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: wp('4.2%'),
    color: '#667eea',
    fontWeight: '700',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    width: wp('20%'),
    transform: [{ skewX: '-20deg' }],
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  particle1: {
    top: '20%',
    left: '10%',
  },
  particle2: {
    top: '60%',
    right: '15%',
  },
  particle3: {
    top: '40%',
    left: '80%',
  },
  categoryIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.8%'),
    borderRadius: wp('4%'),
    alignSelf: 'flex-start',
  },
  categoryIcon: {
    fontSize: wp('4%'),
    marginRight: wp('2%'),
  },
  categoryText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: wp('3.2%'),
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  recentQuizzesList: {
    paddingHorizontal: wp('5%'),
    gap: hp('1.5%'),
  },
  recentQuizItem: {
    marginBottom: hp('1.5%'),
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp('5%'),
    gap: wp('3%'),
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: wp('4%'),
    backgroundColor: '#ffffff',
    borderRadius: wp('5%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.05)',
  },
  statValue: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: wp('6%'),
    color: Colors.primary,
    marginBottom: hp('0.8%'),
    fontWeight: '700',
  },
  statLabel: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: wp('3.2%'),
    color: '#666666',
    textAlign: 'center',
    fontWeight: '500',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp('5%'),
    gap: wp('4%'),
  },
  quickActionCard: {
    flex: 1,
    borderRadius: wp('5%'),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  quickActionGradient: {
    paddingVertical: hp('2.5%'),
    paddingHorizontal: wp('4%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionIcon: {
    fontSize: wp('8%'),
    marginBottom: hp('1%'),
  },
  quickActionText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: wp('4%'),
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '600',
  },
});

import { useAppSelector } from '../src/redux/store/index';

import { useQuizList } from '../src/hooks/useQuizList';
import { Header, Input, Card } from '../src/components/common';
import { QuizCard } from '../src/components/quiz';
import { Quiz, LiveQuiz } from '../src/types';
import { UseQuizListResult } from '../src/types/hooks';
import { RootState } from '../src/redux/store';
import { QuizState } from '../src/redux/slices/quizSlice';







const FeaturedQuizItem: React.FC<{ item: Quiz; onQuizPress: (quiz: Quiz) => void }> = ({ item, onQuizPress }) => {
  // Ensure immutability by creating a shallow copy if any modification were to happen
  const featuredQuizItem = { ...item };

  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;
  const shimmerAnim = React.useRef(new Animated.Value(0)).current;

  // Start shimmer animation
  React.useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmerAnimation.start();
    return () => shimmerAnimation.stop();
  }, [shimmerAnim]);

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Science': return '🧪';
      case 'Geography': return '🌍';
      case 'History': return '📚';
      case 'Math': return '🔢';
      case 'Sports': return '⚽';
      case 'Technology': return '💻';
      default: return '🎯';
    }
  };

  const getCategoryGradient = (category: string): [string, string, string] => {
    switch (category) {
      case 'Science': return ['#FF6B6B', '#4ECDC4', '#45B7D1'];
      case 'Geography': return ['#96CEB4', '#FFEAA7', '#DDA0DD'];
      case 'History': return ['#FDCB6E', '#E17055', '#74B9FF'];
      case 'Math': return ['#A29BFE', '#FD79A8', '#FDCB6E'];
      case 'Sports': return ['#00B894', '#00CEC9', '#74B9FF'];
      case 'Technology': return ['#6C5CE7', '#A29BFE', '#FD79A8'];
      default: return ['#FF6B6B', '#4ECDC4', '#45B7D1'];
    }
  };

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100],
  });

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '2deg'],
  });

  return (
    <Animated.View 
      style={[
        styles.featuredQuizItem,
        {
          transform: [
            { scale: scaleAnim },
            { rotate: rotateInterpolate }
          ],
        },
      ]}
    >
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => onQuizPress(item)}
        activeOpacity={1}
        style={styles.featuredQuizTouchable}
      >
        <LinearGradient
          colors={getCategoryGradient(item.category)}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.featuredQuizGradient}
        >
          {/* Shimmer Effect */}
          <Animated.View
            style={[
              styles.shimmerOverlay,
              {
                transform: [{ translateX: shimmerTranslate }],
              },
            ]}
          />
          
          {/* Floating Particles */}
          <View style={styles.particlesContainer}>
            <View style={[styles.particle, styles.particle1]} />
            <View style={[styles.particle, styles.particle2]} />
            <View style={[styles.particle, styles.particle3]} />
          </View>
          
          <View style={styles.featuredQuizContent}>
              <View style={styles.featuredQuizHeader}>
                <View style={styles.featuredQuizBadge}>
                  <Text style={styles.featuredQuizBadgeText}>✨ FEATURED</Text>
                </View>
  
                <View style={styles.featuredQuizDifficulty}>
                  <Text style={styles.featuredQuizDifficultyText}>
                    {item.difficulty.toUpperCase()}
                  </Text>
                </View>
              </View>
              
              <View style={styles.featuredQuizBody}>
                <View style={styles.categoryIconContainer}>
                  <Text style={styles.categoryIcon}>{getCategoryIcon(item.category)}</Text>
                  <Text style={styles.categoryText}>{item.category}</Text>
                </View>
                
                <Text style={styles.featuredQuizTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.featuredQuizDescription} numberOfLines={2}>
                  {item.description || 'Test your knowledge with this amazing quiz!'}
                </Text>
                
                <View style={styles.featuredQuizStats}>
                  <View style={styles.featuredQuizStat}>
                    <Ionicons name="help-circle-outline" size={wp('4%')} color="rgba(255,255,255,0.9)" />
                    <Text style={styles.featuredQuizStatText}>{item.questions.length} Questions</Text>
                  </View>
                  <View style={styles.featuredQuizStat}>
                    <Ionicons name="time-outline" size={wp('4%')} color="rgba(255,255,255,0.9)" />
                    <Text style={styles.featuredQuizStatText}>{item.duration} Min</Text>
                  </View>
                </View>
              </View>
              
              {/* The button */}
              <View 
                style={styles.featuredQuizButton}
              >
                <Text style={styles.featuredQuizButtonText}>Start Quiz</Text>
                <Ionicons name="arrow-forward" size={wp('5%')} color="#667eea" />
              </View>
            </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const Home: React.FC = () => {
  const authState = useAppSelector((state: RootState) => state.auth);
  const user = authState.user;
  const { liveQuizzes, featuredQuizzes, recentQuizzes, isLoading } = useAppSelector((state: RootState) => state.quiz);
  const { searchQuery, refreshQuizzes, searchQuizzes } = useQuizList();

  const router = useRouter();



  const renderLiveQuizItem: ListRenderItem<LiveQuiz> = ({ item }) => {
    // Ensure immutability by creating a shallow copy if any modification were to happen
    const liveQuizItem = { ...item };
    return (
      <TouchableOpacity
        style={styles.liveQuizItem}
        onPress={() => handleLiveQuizPress(liveQuizItem)}
      >
        <Card variant="elevated" style={styles.liveQuizCard}>
          <View style={styles.liveQuizHeader}>
            <View style={styles.liveBadge}>
              <Text style={styles.liveBadgeText}>LIVE</Text>
            </View>
            <Text style={styles.liveQuizParticipants}>
              {liveQuizItem.participants} playing
            </Text>
          </View>
          
          <Text style={styles.liveQuizTitle} numberOfLines={2}>
            {liveQuizItem.title}
          </Text>
          
          <View style={styles.liveQuizStats}>
            <Text style={styles.liveQuizStat}>
              {liveQuizItem.duration}m
            </Text>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  const handleLiveQuizPress = (liveQuiz: LiveQuiz) => {
    router.push({
      pathname: '/QuizGame',
      params: { quizId: liveQuiz.id, type: 'live' },
    });
  };

  const handleQuizPress = (quiz: Quiz) => {
    router.push({
      pathname: '/QuizGame',
      params: { quizId: quiz.id, type: 'normal' },
    });
  };



  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    refreshQuizzes();
    
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [refreshQuizzes, fadeAnim, slideAnim]);

  const handleProfilePress = () => {
    router.push('/Profile');
  };



  const handleSeeAllQuizzes = () => {
    router.push('/QuizList');
  };

  const handleSeeAllLiveQuizzes = () => {
    router.push('/QuizList');
  };

  const handleNotificationPress = () => {
    router.push('/Notifications');
  };

  const renderSectionHeader = (title: string, onSeeAll?: () => void) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.topHeaderContainer}>
            <AnimatedThemeToggle size={wp('10%')} />
          </View>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                <Text style={styles.greeting}>Good morning,</Text>
                <Text style={styles.userName}>{user?.name || 'User'}</Text>
                <Text style={styles.subtitle}>Ready for today's challenge?</Text>
              </View>
              <View style={styles.headerRight}>
                <TouchableOpacity
                  style={styles.notificationButton}
                  onPress={handleNotificationPress}
                >
                  <Ionicons name="notifications" size={24} color="#fff" />
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationBadgeText}>3</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.profileButton}
                  onPress={handleProfilePress}
                >
                  <Image
                    source={{
                      uri: user?.avatar || 'https://via.placeholder.com/50x50.png?text=U',
                    }}
                    style={styles.profileAvatar}
                  />
                  <View style={styles.profileBadge}>
                    <Ionicons name="star" size={12} color="#667eea" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          <Animated.ScrollView
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
            showsVerticalScrollIndicator={false}
            // refreshControl={
            //   <RefreshControl
            //     refreshing={isLoading}
            //     onRefresh={refreshQuizzes}
            //     colors={[Colors.primary]}
            //     tintColor="#fff"
            //   />
            // }
          >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Input
            value={searchQuery}
            onChangeText={searchQuizzes}
            placeholder="Search quizzes..."
            variant="filled"
            leftIcon={
              <Text style={styles.searchIcon}>🔍</Text>
            }
          />
        </View>

        {/* Live Quizzes */}
        {liveQuizzes.length > 0 && (
          <View style={styles.section}>
            {renderSectionHeader('Live Quizzes', handleSeeAllLiveQuizzes)}
            <FlatList
              data={liveQuizzes.slice(0, 5)}
              renderItem={renderLiveQuizItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>
        )}

        {/* Featured Quizzes */}
        {featuredQuizzes.length > 0 && (
          <View style={styles.section}>
            {renderSectionHeader('Featured Quizzes')}
            <FlatList
              data={featuredQuizzes.slice(0, 3)}
              renderItem={({ item }) => <FeaturedQuizItem item={item} onQuizPress={handleQuizPress} />}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>
        )}

        {/* Recent Quizzes */}
        {recentQuizzes.length > 0 && (
          <View style={styles.section}>
            {renderSectionHeader('Recent Quizzes', handleSeeAllQuizzes)}
            <View style={styles.recentQuizzesList}>
              {recentQuizzes.slice(0, 5).map((quiz: Quiz) => (
                <View key={quiz.id} style={styles.recentQuizItem}>
                  <QuizCard
                    quiz={quiz}
                    variant="compact"
                    onPress={() => handleQuizPress(quiz)}
                  />
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          {renderSectionHeader('Quick Actions')}
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity style={styles.quickActionCard} onPress={() => router.push('/QuizList')}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.quickActionGradient}
              >
                <Text style={styles.quickActionIcon}>🎯</Text>
                <Text style={styles.quickActionText}>Browse Quizzes</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickActionCard} onPress={() => router.push('/Leaderboard')}>
              <LinearGradient
                colors={['#FF6B6B', '#FF5252']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.quickActionGradient}
              >
                <Text style={styles.quickActionIcon}>🏆</Text>
                <Text style={styles.quickActionText}>Leaderboard</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          {renderSectionHeader('Your Stats')}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{user?.totalQuizzes || 0}</Text>
              <Text style={styles.statLabel}>Quizzes Taken</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{user?.stats?.averageScore || 0}%</Text>
              <Text style={styles.statLabel}>Average Score</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{user?.badges?.length || 0}</Text>
              <Text style={styles.statLabel}>Badges</Text>
            </View>
          </View>
        </View>
      </Animated.ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};






export default Home