import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
  TextInput,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
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

interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  questionsCount: number;
  duration: number;
  completedBy: number;
  rating: number;
  image?: string;
}

const QuizItem: React.FC<{ quiz: Quiz; index: number; onPress: () => void }> = ({ quiz, index, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(translateYAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      tension: 150,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 150,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const getDifficultyColor = (difficulty: string): readonly [string, string] => {
    switch (difficulty) {
      case 'Easy': return ['#4CAF50', '#66BB6A'] as const;
      case 'Medium': return ['#FF9800', '#FFB74D'] as const;
      case 'Hard': return ['#F44336', '#EF5350'] as const;
      default: return ['#9E9E9E', '#BDBDBD'] as const;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'programming': return 'code-slash';
      case 'science': return 'flask';
      case 'history': return 'library';
      case 'math': return 'calculator';
      case 'geography': return 'earth';
      default: return 'help-circle';
    }
  };

  const difficultyColors = getDifficultyColor(quiz.difficulty);

  return (
    <Animated.View
      style={[
        styles.quizCard,
        {
          opacity: opacityAnim,
          transform: [
            { scale: scaleAnim },
            { translateY: translateYAnim },
          ],
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={styles.cardTouchable}
      >
        <LinearGradient
          colors={['#FFFFFF', '#F8F9FA'] as const}
          style={styles.cardGradient}
        >
          {/* Header Section */}
          <View style={styles.cardHeader}>
            <View style={styles.categoryContainer}>
              <View style={styles.categoryIcon}>
                <Ionicons 
                  name={getCategoryIcon(quiz.category) as any} 
                  size={20} 
                  color="#667EEA" 
                />
              </View>
              <Text style={styles.categoryText}>{quiz.category}</Text>
            </View>
            
            <LinearGradient
              colors={difficultyColors}
              style={styles.difficultyBadge}
            >
              <Text style={styles.difficultyText}>{quiz.difficulty}</Text>
            </LinearGradient>
          </View>

          {/* Content Section */}
          <View style={styles.cardContent}>
            <Text style={styles.quizTitle} numberOfLines={2}>
              {quiz.title}
            </Text>
            
            <Text style={styles.quizDescription} numberOfLines={3}>
              {quiz.description}
            </Text>

            {/* Stats Section */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Ionicons name="help-circle-outline" size={16} color="#666" />
                <Text style={styles.statText}>{quiz.questionsCount} Questions</Text>
              </View>
              
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.statText}>{quiz.duration} min</Text>
              </View>
              
              <View style={styles.statItem}>
                <Ionicons name="people-outline" size={16} color="#666" />
                <Text style={styles.statText}>{quiz.completedBy}</Text>
              </View>
            </View>

            {/* Rating Section */}
            <View style={styles.ratingContainer}>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name={star <= quiz.rating ? "star" : "star-outline"}
                    size={14}
                    color={star <= quiz.rating ? "#FFD700" : "#DDD"}
                  />
                ))}
              </View>
              <Text style={styles.ratingText}>({quiz.rating}.0)</Text>
            </View>
          </View>

          {/* Action Section */}
          <View style={styles.cardAction}>
            <LinearGradient
              colors={['#667EEA', '#764BA2'] as const}
              style={styles.startButton}
            >
              <Text style={styles.startButtonText}>Start Quiz</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </LinearGradient>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const QuizListScreen: React.FC = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('Popular');
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const searchFocused = useRef(new Animated.Value(0)).current;
  
  // Sample quiz data
  const sampleQuizzes: Quiz[] = [
    {
      id: '1',
      title: 'React Native Fundamentals',
      description: 'Master the basics of React Native development including components, navigation, and state management.',
      difficulty: 'Medium',
      category: 'Programming',
      questionsCount: 15,
      duration: 20,
      completedBy: 1250,
      rating: 5,
    },
    {
      id: '2',
      title: 'JavaScript ES6+ Features',
      description: 'Explore modern JavaScript features including arrow functions, destructuring, async/await, and more.',
      difficulty: 'Easy',
      category: 'Programming',
      questionsCount: 12,
      duration: 15,
      completedBy: 2100,
      rating: 4,
    },
    {
      id: '3',
      title: 'Advanced TypeScript',
      description: 'Deep dive into TypeScript generics, decorators, advanced types, and best practices.',
      difficulty: 'Hard',
      category: 'Programming',
      questionsCount: 20,
      duration: 30,
      completedBy: 850,
      rating: 5,
    },
    {
      id: '4',
      title: 'World Geography',
      description: 'Test your knowledge of countries, capitals, landmarks, and geographical features.',
      difficulty: 'Medium',
      category: 'Geography',
      questionsCount: 18,
      duration: 25,
      completedBy: 1800,
      rating: 4,
    },
    {
      id: '5',
      title: 'Basic Mathematics',
      description: 'Fundamental math concepts including algebra, geometry, and basic calculus.',
      difficulty: 'Easy',
      category: 'Math',
      questionsCount: 10,
      duration: 12,
      completedBy: 3200,
      rating: 4,
    },
    {
      id: '6',
      title: 'Physics Principles',
      description: 'Explore the fundamental laws of physics including mechanics, thermodynamics, and electromagnetism.',
      difficulty: 'Hard',
      category: 'Science',
      questionsCount: 25,
      duration: 35,
      completedBy: 650,
      rating: 5,
    },
    {
      id: '7',
      title: 'World History',
      description: 'Journey through major historical events, civilizations, and influential figures.',
      difficulty: 'Medium',
      category: 'History',
      questionsCount: 22,
      duration: 28,
      completedBy: 1400,
      rating: 4,
    },
    {
      id: '8',
      title: 'Chemistry Basics',
      description: 'Learn about elements, compounds, chemical reactions, and the periodic table.',
      difficulty: 'Easy',
      category: 'Science',
      questionsCount: 14,
      duration: 18,
      completedBy: 2800,
      rating: 4,
    },
  ];
  
  const categories = ['All', 'Programming', 'Science', 'History', 'Math', 'Geography'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  const sortOptions = ['Popular', 'Newest', 'Rating', 'Duration'];
  
  const filteredQuizzes = sampleQuizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quiz.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || quiz.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || quiz.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'Popular':
        return b.completedBy - a.completedBy;
      case 'Rating':
        return b.rating - a.rating;
      case 'Duration':
        return a.duration - b.duration;
      default:
        return 0;
    }
  });
  
  const handleQuizPress = (quizId: string) => {
    router.push(`/QuizGame?quizId=${quizId}`);
  };
  
  const handleSearchFocus = () => {
    Animated.timing(searchFocused, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };
  
  const handleSearchBlur = () => {
    Animated.timing(searchFocused, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };
  
  const renderFilterChip = (items: string[], selected: string, onSelect: (item: string) => void, type: string) => (
    <View style={styles.filterChips}>
      {items.map((item) => (
        <TouchableOpacity
          key={item}
          style={[
            styles.filterChip,
            selected === item && styles.selectedChip,
          ]}
          onPress={() => onSelect(item)}
        >
          <Text style={[
            styles.chipText,
            selected === item && styles.selectedChipText,
          ]}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
  
  const renderQuizItem = ({ item, index }: { item: Quiz; index: number }) => (
    <QuizItem
      quiz={item}
      index={index}
      onPress={() => handleQuizPress(item.id)}
    />
  );
  
  const getItemLayout = (data: any, index: number) => ({
    length: 280, // Approximate height of each item
    offset: 280 * index,
    index,
  });
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667EEA" />
      
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#667EEA', '#764BA2'] as const}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView>
          <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
            <View style={styles.headerTop}>
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Quiz Hub</Text>
              <TouchableOpacity style={styles.profileButton}>
                <Ionicons name="person-circle" size={32} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.headerSubtitle}>
              Challenge yourself with our curated quizzes
            </Text>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
      
      {/* Search Container */}
      <ScrollView style={styles.searchContainer}>
        <Animated.View style={[
          styles.searchInputContainer,
          {
            borderColor: searchFocused.interpolate({
              inputRange: [0, 1],
              outputRange: ['#E8E8E8', '#667EEA'],
            }),
            shadowOpacity: searchFocused.interpolate({
              inputRange: [0, 1],
              outputRange: [0.1, 0.2],
            }),
          }
        ]}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search quizzes..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </Animated.View>
        
        {/* Filter Section */}
        <View style={styles.filtersSection}>
          <Text style={styles.filterLabel}>Category</Text>
          {renderFilterChip(categories, selectedCategory, setSelectedCategory, 'category')}
          
          <Text style={styles.filterLabel}>Difficulty</Text>
          {renderFilterChip(difficulties, selectedDifficulty, setSelectedDifficulty, 'difficulty')}
          
          <View style={styles.sortContainer}>
            <Text style={styles.filterLabel}>Sort by</Text>
            <View style={styles.sortChips}>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.sortChip,
                    sortBy === option && styles.selectedSortChip,
                  ]}
                  onPress={() => setSortBy(option)}
                >
                  <Text style={[
                    styles.sortChipText,
                    sortBy === option && styles.selectedSortChipText,
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

  {/* Quiz List */}
      <FlatList
        data={filteredQuizzes}
        renderItem={renderQuizItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        windowSize={10}
        getItemLayout={getItemLayout}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={64} color="#DDD" />
            <Text style={styles.emptyTitle}>No quizzes found</Text>
            <Text style={styles.emptyText}>
              Try adjusting your search or filter criteria
            </Text>
          </View>
        }
      />


        </View>
      </ScrollView>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  headerGradient: {
    paddingTop: hp('6%'),
    paddingBottom: hp('3%'),
    paddingHorizontal: wp('5%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    gap: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '400',
    lineHeight: 22,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    paddingTop: hp('3%'),
    paddingHorizontal: wp('5%'),
    paddingBottom: hp('2%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
  },
  filtersSection: {
    gap: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedChip: {
    backgroundColor: '#667EEA',
    borderColor: '#667EEA',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  selectedChipText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  sortContainer: {
    marginTop: 8,
  },
  sortChips: {
    flexDirection: 'row',
    gap: 8,
  },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedSortChip: {
    backgroundColor: '#764BA2',
    borderColor: '#764BA2',
  },
  sortChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  selectedSortChipText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  listContainer: {
    padding: wp('5%'),
    paddingTop: hp('2%'),
    flexGrow: 1,
  },
  quizCard: {
    marginBottom: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  cardTouchable: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardGradient: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667EEA',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  quizTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
    lineHeight: 26,
  },
  quizDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    fontWeight: '400',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  statText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  cardAction: {
    padding: 20,
    paddingTop: 0,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('10%'),
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default QuizListScreen;