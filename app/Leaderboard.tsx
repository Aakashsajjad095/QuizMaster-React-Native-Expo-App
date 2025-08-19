import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../src/constants/theme';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { useAppSelector, RootState } from '../src/redux/store';
import { useLeaderboard } from '../src/hooks/useLeaderboard';
import { Header, Button, Input, Modal } from '../src/components/common';
import { LeaderboardItem } from '../src/components/quiz';
import { LeaderboardType } from '../src/types';
import { LeaderboardScreenNavigationProp } from '../src/types/navigation';
import { UseLeaderboardResult } from '../src/types/hooks';

const LeaderboardScreen: React.FC = () => {
  const navigation = useNavigation<LeaderboardScreenNavigationProp>();
  
  const { user } = useAppSelector((state: RootState) => state.auth);
  
  const {
    leaderboard,
    currentType,
    error,
    refreshing,
    searchQuery,
    userPosition,
    fetchLeaderboard,
    switchLeaderboardType,
    refreshLeaderboard,
    searchUsers,
    getTopUsers,
  } = useLeaderboard();
  
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  useEffect(() => {
    fetchLeaderboard(currentType);
  }, [currentType, fetchLeaderboard]);
  
  const handleRefresh = async () => {
    await refreshLeaderboard();
  };
  
  const handleTypeChange = (type: LeaderboardType) => {
    switchLeaderboardType(type);
    setShowFilterModal(false);
  };
  
  const getTypeTitle = (type: LeaderboardType): string => {
    switch (type) {
      case LeaderboardType.Global:
        return 'Global Leaderboard';
      case LeaderboardType.Local:
        return 'Local Leaderboard';
      case LeaderboardType.Weekly:
        return 'Weekly Leaderboard';
      case LeaderboardType.Monthly:
        return 'Monthly Leaderboard';
      default:
        return 'Leaderboard';
    }
  };
  
  const getTypeDescription = (type: LeaderboardType): string => {
    switch (type) {
      case LeaderboardType.Global:
        return 'Top players worldwide';
      case LeaderboardType.Local:
        return 'Top players in your area';
      case LeaderboardType.Weekly:
        return "This week's top performers";
      case LeaderboardType.Monthly:
        return "This month's champions";
      default:
        return '';
    }
  };
  
  const topUsers = getTopUsers(3);
  
  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      onClose={() => setShowFilterModal(false)}
      variant="bottom"
    >
      <View style={styles.filterModal}>
        <Text style={styles.filterTitle}>Select Leaderboard</Text>
        
        {[LeaderboardType.Global, LeaderboardType.Local, LeaderboardType.Weekly, LeaderboardType.Monthly].map((type: LeaderboardType) => (
          <Button
            key={type}
            title={getTypeTitle(type)}
            variant={currentType === type ? 'primary' : 'ghost'}
            onPress={() => handleTypeChange(type)}
            style={styles.filterOption}
          />
        ))}
      </View>
    </Modal>
  );
  
  const renderNewTopThree = () => {
    if (topUsers.length === 0) return null;
    
    return (
      <View style={styles.podiumContainer}>
        <View style={styles.podiumRow}>
          {/* Second Place */}
          {topUsers[1] && (
            <View style={styles.podiumItem}>
              <View style={styles.podiumAvatar}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>
                    {topUsers[1].user.name.charAt(0).toUpperCase()}
                  </Text>
                  <View style={styles.flagBadge}>
                    <Text style={styles.flagText}>🇫🇷</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>
                {topUsers[1].user.name}
              </Text>
              <Text style={styles.podiumScore}>
                {topUsers[1].score} QP
              </Text>
              <View style={[styles.podiumBase, styles.secondPodium]}>
                <Text style={styles.podiumNumber}>2</Text>
              </View>
            </View>
          )}
          
          {/* First Place */}
          {topUsers[0] && (
            <View style={styles.podiumItem}>
              <View style={styles.crownContainer}>
                <Text style={styles.crown}>👑</Text>
              </View>
              <View style={styles.podiumAvatar}>
                <View style={[styles.avatarContainer, styles.winnerAvatar]}>
                  <Text style={styles.avatarText}>
                    {topUsers[0].user.name.charAt(0).toUpperCase()}
                  </Text>
                  <View style={styles.flagBadge}>
                    <Text style={styles.flagText}>🇺🇸</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>
                {topUsers[0].user.name}
              </Text>
              <Text style={styles.podiumScore}>
                {topUsers[0].score} QP
              </Text>
              <View style={[styles.podiumBase, styles.firstPodium]}>
                <Text style={styles.podiumNumber}>1</Text>
              </View>
            </View>
          )}
          
          {/* Third Place */}
          {topUsers[2] && (
            <View style={styles.podiumItem}>
              <View style={styles.podiumAvatar}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>
                    {topUsers[2].user.name.charAt(0).toUpperCase()}
                  </Text>
                  <View style={styles.flagBadge}>
                    <Text style={styles.flagText}>🇨🇦</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>
                {topUsers[2].user.name}
              </Text>
              <Text style={styles.podiumScore}>
                {topUsers[2].score} QP
              </Text>
              <View style={[styles.podiumBase, styles.thirdPodium]}>
                <Text style={styles.podiumNumber}>3</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };
  
  const renderRankingCard = (item: any, rank: number) => {
    return (
      <View key={item.user.id} style={styles.rankingCard}>
        <View style={styles.rankingLeft}>
          <Text style={styles.rankNumber}>{rank}</Text>
          <View style={styles.rankingAvatar}>
            <Text style={styles.rankingAvatarText}>
              {item.user.name.charAt(0).toUpperCase()}
            </Text>
            <View style={styles.rankingFlag}>
              <Text style={styles.rankingFlagText}>🇮🇳</Text>
            </View>
          </View>
          <View style={styles.rankingInfo}>
            <Text style={styles.rankingName}>{item.user.name}</Text>
            <Text style={styles.rankingPoints}>{item.score} points</Text>
          </View>
        </View>
      </View>
    );
  };
  
  const renderUserPosition = () => {
    if (!userPosition.entry) return null;
    
    return (
      <View style={styles.userPositionContainer}>
        <Text style={styles.sectionTitle}>Your Position</Text>
        <LeaderboardItem
          entry={userPosition.entry}
          rank={userPosition.rank}
          variant="detailed"
          isCurrentUser
        />
      </View>
    );
  };
  
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title="Leaderboard"
          leftIcon={<Text style={styles.backIcon}>←</Text>}
          onLeftPress={() => navigation.goBack()}
        />
        
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load leaderboard</Text>
          <Button
            title="Retry"
            onPress={() => fetchLeaderboard(currentType)}
            style={styles.retryButton}
          />
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <LinearGradient
        colors={['#8B5CF6', '#A855F7', '#C084FC']}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Custom Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Leaderboard</Text>
              <Text style={styles.headerSubtitle}>🏆 Top Performers</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setShowFilterModal(true)}
            >
              <Text style={styles.filterIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>
          
          {/* Time Badge */}
          <View style={styles.timeBadge}>
            <Text style={styles.timeText}>⏰ 06d 23h 00m</Text>
          </View>
          
          {/* Top 3 Podium */}
          {!searchQuery && renderNewTopThree()}
        </SafeAreaView>
      </LinearGradient>
      
      {/* Bottom Section with Rankings */}
      <View style={styles.bottomSection}>
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.primary]}
              tintColor={Colors.primary}
            />
          }
        >
          {/* Search */}
          <View style={styles.searchContainer}>
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChangeText={searchUsers}
              variant="outlined"
              leftIcon={<Text style={styles.searchIcon}>🔍</Text>}
              style={styles.searchInput}
            />
          </View>
          
          {/* Rankings List */}
          <View style={styles.rankingsContainer}>
            {leaderboard.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {searchQuery ? 'No users found' : 'No data available'}
                </Text>
              </View>
            ) : (
              leaderboard.slice(3).map((item, index) => (
                renderRankingCard(item, index + 4)
              ))
            )}
          </View>
        </ScrollView>
      </View>
      
      {renderFilterModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
  },
  gradientBackground: {
    flex: 0.6,
    paddingTop: hp('2%'),
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backButton: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: Typography.fontSize.xl,
    color: Colors.white,
    fontWeight: 'bold',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  filterButton: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: {
    fontSize: Typography.fontSize.lg,
    color: Colors.white,
  },
  timeBadge: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xl,
    marginTop: Spacing.md,
  },
  timeText: {
    color: Colors.white,
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
  },
  
  // Search
  // Podium Styles
  podiumContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  podiumRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: Spacing.md,
  },
  podiumItem: {
    alignItems: 'center',
    flex: 1,
  },
  crownContainer: {
    position: 'absolute',
    top: -hp('3%'),
    zIndex: 1,
  },
  crown: {
    fontSize: wp('8%'),
  },
  podiumAvatar: {
    marginBottom: Spacing.sm,
  },
  avatarContainer: {
    width: wp('16%'),
    height: wp('16%'),
    borderRadius: wp('8%'),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    ...Shadows.medium,
  },
  winnerAvatar: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('10%'),
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  avatarText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  flagBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: wp('6%'),
    height: wp('6%'),
    borderRadius: wp('3%'),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  flagText: {
    fontSize: wp('3%'),
  },
  podiumName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 4,
  },
  podiumScore: {
    fontSize: Typography.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: Spacing.md,
  },
  podiumBase: {
    width: wp('20%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: BorderRadius.md,
    borderTopRightRadius: BorderRadius.md,
  },
  firstPodium: {
    height: hp('8%'),
    backgroundColor: '#8B5CF6',
  },
  secondPodium: {
    height: hp('6%'),
    backgroundColor: '#A855F7',
  },
  thirdPodium: {
    height: hp('4%'),
    backgroundColor: '#C084FC',
  },
  podiumNumber: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: 'bold',
    color: Colors.white,
  },
  
  // Bottom Section Styles
  bottomSection: {
    flex: 0.4,
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
    marginTop: -BorderRadius['2xl'],
  },
  scrollContainer: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  searchInput: {
    marginBottom: 0,
  },
  searchIcon: {
    fontSize: Typography.fontSize.base,
  },
  
  // Rankings Styles
  rankingsContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  rankingCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.small,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rankingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: Typography.fontSize.lg,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    width: wp('8%'),
    textAlign: 'center',
  },
  rankingAvatar: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: Spacing.md,
    position: 'relative',
  },
  rankingAvatarText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  rankingFlag: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: wp('4%'),
    height: wp('4%'),
    borderRadius: wp('2%'),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rankingFlagText: {
    fontSize: wp('2.5%'),
  },
  rankingInfo: {
    flex: 1,
  },
  rankingName: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  rankingPoints: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
  
  // Section Title
  sectionTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.lg,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  
  // Top Three
  topThreeContainer: {
    marginBottom: Spacing.xl,
  },
  topThreeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  topThreeItem: {
    alignItems: 'center',
    flex: 1,
    maxWidth: wp('25%'),
  },
  firstPlace: {
    marginBottom: hp('2%'),
  },
  secondPlace: {
    marginBottom: hp('1%'),
  },
  thirdPlace: {
    marginBottom: 0,
  },
  topThreeRank: {
    width: wp('6%'),
    height: wp('6%'),
    borderRadius: wp('3%'),
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  topThreeRankText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.sm,
    color: Colors.white,
  },
  topThreeAvatar: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
    backgroundColor: Colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  firstPlaceAvatar: {
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('7.5%'),
    borderWidth: 3,
    borderColor: Colors.warning,
  },
  topThreeAvatarText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
  },
  topThreeName: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.sm,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  topThreeScore: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.sm,
    color: Colors.primary,
  },
  
  // User Position
  userPositionContainer: {
    marginBottom: Spacing.xl,
  },
  
  // Leaderboard
  leaderboardContainer: {
    marginBottom: Spacing.xl,
  },
  leaderboardItem: {
    marginBottom: Spacing.sm,
  },
  
  // Empty State
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
  },
  
  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  errorText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.lg,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  retryButton: {
    minWidth: wp('30%'),
  },
  
  // Filter Modal
  filterModal: {
    padding: Spacing.lg,
  },
  filterTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.lg,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  filterOption: {
    marginBottom: Spacing.sm,
  },
});

export default LeaderboardScreen;