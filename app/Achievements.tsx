import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../src/redux/store';
import { useAchievements } from '../src/hooks/useAchievements';
import AchievementCard from '../src/components/AchievementCard';
import { useTheme } from '../src/contexts/ThemeContext';
import { Colors } from '../constants/Colors';

const AchievementsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { effectiveTheme } = useTheme();
  const colors = Colors[effectiveTheme];
  const { quizResults } = useAppSelector((state) => state.game);
  const {
    userAchievements,
    streakData,
    getAchievementProgress,
    checkAchievements,
  } = useAchievements();
  
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  useEffect(() => {
    // Check for new achievements when screen loads
    checkAchievements(quizResults);
  }, [quizResults]);

  const filteredAchievements = userAchievements.achievements.filter(achievement => {
    switch (filter) {
      case 'unlocked':
        return achievement.isUnlocked;
      case 'locked':
        return !achievement.isUnlocked;
      default:
        return true;
    }
  });

  const handleAchievementPress = (achievement: any) => {
    const progress = getAchievementProgress(achievement, quizResults);
    Alert.alert(
      achievement.title,
      `${achievement.description}\n\nProgress: ${progress.current}/${progress.target}\nRarity: ${achievement.rarity}`,
      [{ text: 'OK' }]
    );
  };

  const renderFilterButton = (filterType: 'all' | 'unlocked' | 'locked', label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        {
          backgroundColor: filter === filterType ? colors.primary : colors.surface,
          borderColor: colors.border,
        },
      ]}
      onPress={() => setFilter(filterType)}
    >
      <Text
        style={[
          styles.filterButtonText,
          {
            color: filter === filterType ? 'white' : colors.text,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={effectiveTheme === 'dark' ? ['#1a1a2e', '#16213e'] : ['#667eea', '#764ba2']}
        style={styles.gradientBackground}
      >
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle={effectiveTheme === 'dark' ? 'light-content' : 'light-content'} />
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <AntDesign name="arrowleft" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Achievements</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Stats Summary */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userAchievements.totalUnlocked}</Text>
              <Text style={styles.statLabel}>Unlocked</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userAchievements.achievements.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{streakData.currentStreak}</Text>
              <Text style={styles.statLabel}>Current Streak</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{streakData.bestStreak}</Text>
              <Text style={styles.statLabel}>Best Streak</Text>
            </View>
          </View>

          {/* Filter Buttons */}
          <View style={styles.filterContainer}>
            {renderFilterButton('all', 'All')}
            {renderFilterButton('unlocked', 'Unlocked')}
            {renderFilterButton('locked', 'Locked')}
          </View>

          {/* Achievements List */}
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {filteredAchievements.length > 0 ? (
              filteredAchievements.map((achievement, index) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  progress={getAchievementProgress(achievement, quizResults)}
                  onPress={() => handleAchievementPress(achievement)}
                  animationDelay={index * 100}
                />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No achievements found for this filter.
                </Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSpacer: {
    width: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 10,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    borderWidth: 1,
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AchievementsScreen;