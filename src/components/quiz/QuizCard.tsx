import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Colors, Typography, BorderRadius, Spacing, Shadows } from '../../constants/theme';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Quiz } from '../../types';
import { Card, Button } from '../common';

interface QuizCardProps {
  quiz: Quiz;
  onPress: () => void;
  onStartQuiz?: () => void;
  variant?: 'default' | 'featured' | 'live' | 'compact';
  showStartButton?: boolean;
  style?: ViewStyle;
  testID?: string;
}

const QuizCard: React.FC<QuizCardProps> = ({
  quiz,
  onPress,
  onStartQuiz,
  variant = 'default',
  showStartButton = false,
  style,
  testID,
}) => {
  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return Colors.success;
      case 'medium':
        return Colors.warning;
      case 'hard':
        return Colors.error;
      default:
        return Colors.textSecondary;
    }
  };

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {};

    switch (variant) {
      case 'featured':
        baseStyle.backgroundColor = Colors.gradientStart;
        break;
      case 'live':
        baseStyle.borderWidth = 2;
        baseStyle.borderColor = Colors.accent;
        break;
      case 'compact':
        baseStyle.padding = Spacing.md;
        break;
      default:
        break;
    }

    return baseStyle;
  };

  const renderHeader = () => {
    if (variant === 'compact') {
      return (
        <View style={styles.compactHeader}>
          <Text style={styles.compactTitle} numberOfLines={1}>
            {quiz.title}
          </Text>
          <View style={styles.compactStats}>
            <Text style={styles.compactStatText}>
              {quiz.questions.length}Q
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.header}>
        {quiz.imageUrl && (
          <Image source={{ uri: quiz.imageUrl }} style={styles.quizImage} />
        )}
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.title,
                variant === 'featured' && styles.featuredTitle,
              ]}
              numberOfLines={2}
            >
              {quiz.title}
            </Text>
            {variant === 'live' && (
              <View style={styles.liveBadge}>
                <Text style={styles.liveBadgeText}>LIVE</Text>
              </View>
            )}
          </View>
          
          {quiz.description && (
            <Text
              style={[
                styles.description,
                variant === 'featured' && styles.featuredDescription,
              ]}
              numberOfLines={2}
            >
              {quiz.description}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const renderStats = () => {
    if (variant === 'compact') {
      return null;
    }

    return (
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Questions</Text>
          <Text style={styles.statValue}>{quiz.questions.length}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Duration</Text>
          <Text style={styles.statValue}>{quiz.duration}m</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Difficulty</Text>
          <Text
            style={[
              styles.statValue,
              { color: getDifficultyColor(quiz.difficulty) },
            ]}
          >
            {quiz.difficulty}
          </Text>
        </View>
        
        {quiz.participants && (
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Players</Text>
            <Text style={styles.statValue}>{quiz.participants}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderFooter = () => {
    if (variant === 'compact') {
      return null;
    }

    return (
      <View style={styles.footer}>
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>{quiz.category}</Text>
        </View>
        
        {showStartButton && onStartQuiz && (
          <Button
            title="Start Quiz"
            onPress={onStartQuiz}
            size="small"
            variant={variant === 'featured' ? 'secondary' : 'primary'}
          />
        )}
      </View>
    );
  };

  return (
    <Card
      onPress={onPress}
      variant={variant === 'featured' ? 'elevated' : 'default'}
      style={Object.assign({}, getCardStyle(), style)}
      testID={testID}
    >
      {renderHeader()}
      {renderStats()}
      {renderFooter()}
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: Spacing.md,
  },
  quizImage: {
    width: '100%',
    height: hp('12%'),
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  headerContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  title: {
    flex: 1,
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.lg,
    color: Colors.textPrimary,
    marginRight: Spacing.sm,
  },
  featuredTitle: {
    color: Colors.textWhite,
  },
  description: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeight.normal,
  },
  featuredDescription: {
    color: Colors.textWhite,
    opacity: 0.9,
  },
  liveBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  liveBadgeText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.xs,
    color: Colors.textWhite,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.fontSize.xs,
    color: Colors.textTertiary,
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.sm,
    color: Colors.textPrimary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryContainer: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  category: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  // Compact variant styles
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactTitle: {
    flex: 1,
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.base,
    color: Colors.textPrimary,
    marginRight: Spacing.sm,
  },
  compactStats: {
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  compactStatText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
});

export default QuizCard;