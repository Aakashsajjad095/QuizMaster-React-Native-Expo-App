import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Achievement } from '../types/achievements';
import { useTheme } from '../contexts/ThemeContext';
import { Colors } from '../../constants/Colors';

interface AchievementCardProps {
  achievement: Achievement;
  progress?: {
    current: number;
    target: number;
    percentage: number;
  };
  onPress?: () => void;
  animationDelay?: number;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  progress,
  onPress,
  animationDelay = 0,
}) => {
  const { effectiveTheme } = useTheme();
  const colors = Colors[effectiveTheme];
  
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: animationDelay,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: animationDelay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [animationDelay]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return ['#6c757d', '#495057'];
      case 'rare':
        return ['#007bff', '#0056b3'];
      case 'epic':
        return ['#6f42c1', '#5a2d91'];
      case 'legendary':
        return ['#fd7e14', '#e8590c'];
      default:
        return ['#6c757d', '#495057'];
    }
  };

  const getRarityGlow = (rarity: string) => {
    if (!achievement.isUnlocked) return 'transparent';
    switch (rarity) {
      case 'common':
        return 'rgba(108, 117, 125, 0.3)';
      case 'rare':
        return 'rgba(0, 123, 255, 0.3)';
      case 'epic':
        return 'rgba(111, 66, 193, 0.3)';
      case 'legendary':
        return 'rgba(253, 126, 20, 0.3)';
      default:
        return 'transparent';
    }
  };

  const getIconName = (iconName: string): keyof typeof Ionicons.glyphMap => {
    const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
      'play-circle': 'play-circle',
      'trophy': 'trophy',
      'star': 'star',
      'crown': 'diamond',
      'checkmark-circle': 'checkmark-circle',
      'flame': 'flame',
      'bonfire': 'flame',
      'flask': 'flask',
      'library': 'library',
      'calculator': 'calculator',
      'globe': 'globe',
      'football': 'football',
      'laptop': 'laptop',
      'medal': 'medal',
    };
    return iconMap[iconName] || 'star';
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
          shadowColor: getRarityGlow(achievement.rarity),
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: achievement.isUnlocked ? getRarityColor(achievement.rarity)[0] : colors.border,
            opacity: achievement.isUnlocked ? 1 : 0.6,
          },
        ]}
        onPress={onPress}
        disabled={!onPress}
      >
        <LinearGradient
          colors={achievement.isUnlocked ? getRarityColor(achievement.rarity) as [string, string] : ['#6c757d', '#495057']}
          style={styles.iconContainer}
        >
          <Ionicons
            name={getIconName(achievement.icon)}
            size={32}
            color="white"
          />
        </LinearGradient>

        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>
            {achievement.title}
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {achievement.description}
          </Text>

          {progress && !achievement.isUnlocked && (
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${progress.percentage}%`,
                      backgroundColor: getRarityColor(achievement.rarity)[0],
                    },
                  ]}
                />
              </View>
              <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                {progress.current}/{progress.target}
              </Text>
            </View>
          )}

          {achievement.isUnlocked && achievement.unlockedAt && (
            <Text style={[styles.unlockedDate, { color: colors.textTertiary }]}>
              Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
            </Text>
          )}
        </View>

        <View style={styles.rarityIndicator}>
          <Text style={[styles.rarityText, { color: getRarityColor(achievement.rarity)[0] }]}>
            {achievement.rarity.toUpperCase()}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  card: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    textAlign: 'right',
  },
  unlockedDate: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
  rarityIndicator: {
    alignItems: 'center',
  },
  rarityText: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default AchievementCard;