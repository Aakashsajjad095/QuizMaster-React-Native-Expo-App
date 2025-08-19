import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColor } from '../../hooks/useThemeColor';
import { useAppSelector } from '../redux/store';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface AnalyticsCardProps {
  type: 'performance' | 'category' | 'difficulty' | 'time';
  style?: any;
}

const { width } = Dimensions.get('window');

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ type, style }) => {
  const textColor = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const cardBackground = useThemeColor({}, 'card');
  const { quizResults } = useAppSelector((state) => state.game);

  const getAnalyticsData = () => {
    if (!quizResults || quizResults.length === 0) {
      return null;
    }

    switch (type) {
      case 'performance':
        const recentResults = quizResults.slice(-10);
        const trend = recentResults.length > 1 
          ? recentResults[recentResults.length - 1].percentage - recentResults[0].percentage
          : 0;
        return {
          title: 'Performance Trend',
          value: `${trend > 0 ? '+' : ''}${Math.floor(trend)}%`,
          subtitle: 'Last 10 quizzes',
          icon: trend > 0 ? 'trending-up' : trend < 0 ? 'trending-down' : 'remove',
          color: trend > 0 ? ['#4CAF50', '#8BC34A', '#66BB6A'] : trend < 0 ? ['#F44336', '#FF5722', '#E57373'] : ['#9E9E9E', '#757575', '#BDBDBD'],
        };

      case 'category':
        const categoryStats = quizResults.reduce((acc, result) => {
          const category = result.quizId.split('_')[0] || 'general';
          if (!acc[category]) {
            acc[category] = { total: 0, sum: 0 };
          }
          acc[category].total++;
          acc[category].sum += result.percentage;
          return acc;
        }, {} as Record<string, { total: number; sum: number }>);
        
        const bestCategory = Object.entries(categoryStats)
          .map(([cat, stats]) => ({ category: cat, avg: stats.sum / stats.total }))
          .sort((a, b) => b.avg - a.avg)[0];
        
        return {
          title: 'Best Category',
          value: bestCategory?.category.charAt(0).toUpperCase() + bestCategory?.category.slice(1) || 'N/A',
          subtitle: `${Math.floor(bestCategory?.avg || 0)}% average`,
          icon: 'trophy',
          color: ['#FFD700', '#FFA000', '#FF8F00'],
        };

      case 'difficulty':
        const avgScore = quizResults.reduce((sum, result) => sum + result.percentage, 0) / quizResults.length;
        const difficulty = avgScore >= 80 ? 'Expert' : avgScore >= 60 ? 'Intermediate' : 'Beginner';
        return {
          title: 'Skill Level',
          value: difficulty,
          subtitle: `${Math.floor(avgScore)}% overall`,
          icon: avgScore >= 80 ? 'star' : avgScore >= 60 ? 'medal' : 'school',
          color: avgScore >= 80 ? ['#9C27B0', '#673AB7', '#7B1FA2'] : avgScore >= 60 ? ['#2196F3', '#3F51B5', '#1976D2'] : ['#FF9800', '#F57C00', '#E65100'],
        };

      case 'time':
        const avgTime = quizResults.reduce((sum, result) => sum + (result.timeSpent || 0), 0) / quizResults.length;
        const timeMinutes = Math.floor(avgTime / 60);
        const timeSeconds = Math.floor(avgTime % 60);
        return {
          title: 'Avg. Time',
          value: `${timeMinutes}:${timeSeconds.toString().padStart(2, '0')}`,
          subtitle: 'per quiz',
          icon: 'time',
          color: ['#00BCD4', '#009688', '#00ACC1'],
        };

      default:
        return null;
    }
  };

  const data = getAnalyticsData();

  if (!data) {
    return (
      <View style={[styles.card, { backgroundColor: cardBackground }]}>
        <Text style={[styles.noDataText, { color: textSecondary }]}>No data available</Text>
      </View>
    );
  }

  return (
    <View style={[styles.cardWrapper, style]}>
      <LinearGradient
        colors={data.color as [string, string, string]}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.cardOverlay} />
        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <Ionicons name={data.icon as any} size={28} color="white" style={styles.icon} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={2}>{data.title}</Text>
            <Text style={styles.value} numberOfLines={1}>{data.value}</Text>
            <Text style={styles.subtitle} numberOfLines={1}>{data.subtitle}</Text>
          </View>
        </View>
        <View style={styles.decorativeElement} />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: wp('22%'),
    height: hp('16%'),
    marginHorizontal: wp('0.5%'),
  },
  card: {
    flex: 1,
    borderRadius: wp('4%'),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 15,
    position: 'relative',
    overflow: 'hidden',
  },
  cardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: wp('4%'),
  },
  cardContent: {
    flex: 1,
    padding: wp('3%'),
    justifyContent: 'space-between',
    zIndex: 2,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  icon: {
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  textContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: wp('2.5%'),
    fontWeight: '700',
    opacity: 0.95,
    textAlign: 'center',
    marginBottom: hp('0.5%'),
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  value: {
    color: 'white',
    fontSize: wp('5%'),
    fontWeight: '900',
    textAlign: 'center',
    marginVertical: hp('0.3%'),
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    color: 'white',
    fontSize: wp('2%'),
    opacity: 0.9,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  decorativeElement: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 1,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: wp('3.5%'),
    fontStyle: 'italic',
  },
});

export default AnalyticsCard;