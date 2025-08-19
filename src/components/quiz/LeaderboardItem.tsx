import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Image,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { LeaderboardEntry, LeaderboardType } from '../../types';
import { Card } from '../common';

interface LeaderboardItemProps {
  entry: LeaderboardEntry;
  rank: number;
  isCurrentUser?: boolean;
  showRankChange?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  onPress?: () => void;
  style?: ViewStyle;
  testID?: string;
}

const LeaderboardItem: React.FC<LeaderboardItemProps> = ({
  entry,
  rank,
  isCurrentUser = false,
  showRankChange = false,
  variant = 'default',
  onPress,
  style,
  testID,
}) => {
  const getRankStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.rankContainer,
    };

    if (rank <= 3) {
      switch (rank) {
        case 1:
          baseStyle.backgroundColor = Colors.gold;
          break;
        case 2:
          baseStyle.backgroundColor = Colors.silver;
          break;
        case 3:
          baseStyle.backgroundColor = Colors.bronze;
          break;
      }
    } else {
      baseStyle.backgroundColor = Colors.backgroundSecondary;
    }

    return baseStyle;
  };

  const getRankTextStyle = (): TextStyle => {
    return {
      ...styles.rankText,
      color: rank <= 3 ? Colors.textWhite : Colors.textPrimary,
    };
  };

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {};

    if (isCurrentUser) {
      baseStyle.borderWidth = 2;
      baseStyle.borderColor = Colors.primary;
      baseStyle.backgroundColor = Colors.primaryLight;
    }

    return baseStyle;
  };

  const renderAvatar = () => {
    const avatarSize = variant === 'compact' ? wp('10%') : wp('12%');
    
    return (
      <View style={[styles.avatarContainer, { width: avatarSize, height: avatarSize }]}>
        {entry.user.avatar ? (
          <Image
            source={{ uri: entry.user.avatar }}
            style={[styles.avatar, { width: avatarSize, height: avatarSize }]}
          />
        ) : (
          <View style={[styles.avatarPlaceholder, { width: avatarSize, height: avatarSize }]}>
            <Text style={styles.avatarText}>
              {entry.user.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderRankChange = () => {
    if (!showRankChange || !entry.rankChange) {
      return null;
    }

    const isPositive = entry.rankChange > 0;
    const isNegative = entry.rankChange < 0;

    return (
      <View style={styles.rankChangeContainer}>
        <Text
          style={[
            styles.rankChangeText,
            {
              color: isPositive
                ? Colors.success
                : isNegative
                ? Colors.error
                : Colors.textSecondary,
            },
          ]}
        >
          {isPositive ? '+' : ''}{entry.rankChange}
        </Text>
      </View>
    );
  };

  const renderMedal = () => {
    if (rank > 3) return null;

    const medals = ['🥇', '🥈', '🥉'];
    return (
      <Text style={styles.medal}>
        {medals[rank - 1]}
      </Text>
    );
  };

  const renderCompactView = () => {
    return (
      <View style={styles.compactContent}>
        <View style={styles.compactLeft}>
          <View style={getRankStyle()}>
            <Text style={getRankTextStyle()}>{rank}</Text>
          </View>
          {renderAvatar()}
          <View style={styles.compactUserInfo}>
            <Text style={styles.compactUserName} numberOfLines={1}>
              {entry.user.name}
            </Text>
          </View>
        </View>
        
        <View style={styles.compactRight}>
          <Text style={styles.compactScore}>
            {entry.score}
          </Text>
          {renderRankChange()}
        </View>
      </View>
    );
  };

  const renderDefaultView = () => {
    return (
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View style={getRankStyle()}>
            <Text style={getRankTextStyle()}>{rank}</Text>
            {renderMedal()}
          </View>
          
          {renderAvatar()}
          
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {entry.user.name}
            </Text>
            {variant === 'detailed' && (
              <Text style={styles.userStats}>
                Level {entry.user.level || 1} • {entry.user.totalQuizzes || 0} quizzes
            </Text>
            )}
          </View>
        </View>
        
        <View style={styles.rightSection}>
          <Text style={styles.score}>
            {entry.score.toLocaleString()}
          </Text>
          <Text style={styles.scoreLabel}>points</Text>
          {renderRankChange()}
        </View>
      </View>
    );
  };

  const renderDetailedView = () => {
    return (
      <View style={styles.detailedContent}>
        {renderDefaultView()}
        
        <View style={styles.detailedStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{entry.user.stats?.totalQuizzes ?? 0}</Text>
            <Text style={styles.statLabel}>Quizzes</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{entry.user.stats?.averageScore ?? 0}%</Text>
            <Text style={styles.statLabel}>Avg Score</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{entry.user.badges?.length || 0}</Text>
            <Text style={styles.statLabel}>Badges</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    switch (variant) {
      case 'compact':
        return renderCompactView();
      case 'detailed':
        return renderDetailedView();
      default:
        return renderDefaultView();
    }
  };

  return (
    <Card
      onPress={onPress}
      style={{ ...getContainerStyle(), ...(style || {}) }}
      padding={variant === 'compact' ? 'small' : 'medium'}
      testID={testID}
    >
      {renderContent()}
    </Card>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  rankContainer: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('4%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    position: 'relative',
  },
  rankText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.sm,
  },
  medal: {
    position: 'absolute',
    top: -Spacing.xs,
    right: -Spacing.xs,
    fontSize: Typography.fontSize.sm,
  },
  avatarContainer: {
    marginRight: Spacing.md,
  },
  avatar: {
    borderRadius: wp('6%'),
  },
  avatarPlaceholder: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: wp('6%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
  },
  userStats: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  score: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.lg,
    color: Colors.textPrimary,
  },
  scoreLabel: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  rankChangeContainer: {
    marginTop: Spacing.xs,
  },
  rankChangeText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.xs,
    textAlign: 'right',
  },
  // Compact variant styles
  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  compactRight: {
    alignItems: 'flex-end',
  },
  compactUserInfo: {
    flex: 1,
  },
  compactUserName: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.sm,
    color: Colors.textPrimary,
  },
  compactScore: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
  },
  // Detailed variant styles
  detailedContent: {
    gap: Spacing.md,
  },
  detailedStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
  },
  statLabel: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
});

export default LeaderboardItem;