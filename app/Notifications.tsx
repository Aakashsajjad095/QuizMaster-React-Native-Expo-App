import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  FlatList,
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

interface Notification {
  id: string;
  type: 'quiz_completed' | 'new_quiz' | 'achievement' | 'reminder' | 'leaderboard';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  icon: string;
  color: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'achievement',
    title: 'New Achievement Unlocked!',
    message: 'You\'ve completed 10 quizzes this week. Keep it up!',
    timestamp: '2 minutes ago',
    isRead: false,
    icon: 'trophy',
    color: '#FFD700',
  },
  {
    id: '2',
    type: 'new_quiz',
    title: 'New Quiz Available',
    message: 'Advanced Mathematics quiz is now available. Test your skills!',
    timestamp: '1 hour ago',
    isRead: false,
    icon: 'book',
    color: '#667eea',
  },
  {
    id: '3',
    type: 'quiz_completed',
    title: 'Quiz Results',
    message: 'You scored 85% in Science Fundamentals quiz!',
    timestamp: '3 hours ago',
    isRead: true,
    icon: 'checkmark-circle',
    color: '#4CAF50',
  },
  {
    id: '4',
    type: 'leaderboard',
    title: 'Leaderboard Update',
    message: 'You\'re now ranked #5 in the weekly leaderboard!',
    timestamp: '1 day ago',
    isRead: true,
    icon: 'podium',
    color: '#FF6B6B',
  },
  {
    id: '5',
    type: 'reminder',
    title: 'Daily Challenge',
    message: 'Don\'t forget to complete today\'s daily challenge!',
    timestamp: '2 days ago',
    isRead: true,
    icon: 'alarm',
    color: '#FF9800',
  },
];

const Notifications: React.FC = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.9));

  useEffect(() => {
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
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const NotificationItem: React.FC<{ item: Notification; index: number }> = ({ item, index }) => {
    const itemFadeAnim = new Animated.Value(0);
    const itemSlideAnim = new Animated.Value(30);

    React.useEffect(() => {
      Animated.parallel([
        Animated.timing(itemFadeAnim, {
          toValue: 1,
          duration: 600,
          delay: index * 100,
          useNativeDriver: true,
        }),
        Animated.timing(itemSlideAnim, {
          toValue: 0,
          duration: 600,
          delay: index * 100,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    return (
      <Animated.View
        style={[
          styles.notificationItem,
          {
            opacity: itemFadeAnim,
            transform: [{ translateY: itemSlideAnim }],
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.notificationContent,
            !item.isRead && styles.unreadNotification,
          ]}
          onPress={() => markAsRead(item.id)}
        >
          <View style={styles.notificationLeft}>
            <View style={[styles.notificationIcon, { backgroundColor: item.color }]}>
              <Ionicons name={item.icon as any} size={wp('6%')} color="#ffffff" />
            </View>
            <View style={styles.notificationText}>
              <Text style={styles.notificationTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.notificationMessage} numberOfLines={2}>
                {item.message}
              </Text>
              <Text style={styles.notificationTime}>{item.timestamp}</Text>
            </View>
          </View>
          <View style={styles.notificationActions}>
            {!item.isRead && <View style={styles.unreadDot} />}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteNotification(item.id)}
            >
              <Ionicons name="close" size={wp('4%')} color="#999" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <Animated.View
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
              },
            ]}
          >
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Notifications</Text>
              {unreadCount > 0 && (
                <View style={styles.headerBadge}>
                  <Text style={styles.headerBadgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
            {unreadCount > 0 && (
              <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
                <Text style={styles.markAllText}>Mark all</Text>
              </TouchableOpacity>
            )}
          </Animated.View>

          {/* Content */}
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {notifications.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="notifications-off" size={wp('20%')} color="#ccc" />
                <Text style={styles.emptyStateTitle}>No Notifications</Text>
                <Text style={styles.emptyStateText}>
                  You're all caught up! Check back later for new updates.
                </Text>
              </View>
            ) : (
              <FlatList
                data={notifications}
                renderItem={({ item, index }) => <NotificationItem item={item} index={index} />}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
              />
            )}
          </Animated.View>
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
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    marginBottom: hp('2%'),
  },
  backButton: {
    padding: wp('2%'),
    borderRadius: wp('3%'),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp('2%'),
  },
  headerTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: wp('6%'),
    color: '#ffffff',
    fontWeight: '700',
  },
  headerBadge: {
    backgroundColor: '#FF6B6B',
    borderRadius: wp('3%'),
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.5%'),
    minWidth: wp('6%'),
    alignItems: 'center',
  },
  headerBadgeText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: wp('3%'),
    color: '#ffffff',
    fontWeight: '700',
  },
  markAllButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
    borderRadius: wp('4%'),
  },
  markAllText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: wp('3.5%'),
    color: '#ffffff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: wp('8%'),
    borderTopRightRadius: wp('8%'),
    paddingTop: hp('3%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  listContent: {
    paddingHorizontal: wp('5%'),
    paddingBottom: hp('10%'),
  },
  notificationItem: {
    marginBottom: hp('1.5%'),
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: wp('4%'),
    padding: wp('4%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.05)',
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
    backgroundColor: 'rgba(102, 126, 234, 0.02)',
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationIcon: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('4%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: wp('4.2%'),
    color: '#1a1a1a',
    marginBottom: hp('0.5%'),
    fontWeight: '700',
  },
  notificationMessage: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: wp('3.5%'),
    color: '#666666',
    lineHeight: wp('5%'),
    marginBottom: hp('0.5%'),
  },
  notificationTime: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: wp('3%'),
    color: '#999999',
    fontWeight: '500',
  },
  notificationActions: {
    alignItems: 'center',
    gap: hp('1%'),
  },
  unreadDot: {
    width: wp('2.5%'),
    height: wp('2.5%'),
    borderRadius: wp('1.25%'),
    backgroundColor: '#667eea',
  },
  deleteButton: {
    padding: wp('2%'),
    borderRadius: wp('2%'),
    backgroundColor: 'rgba(153, 153, 153, 0.1)',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('10%'),
  },
  emptyStateTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: wp('6%'),
    color: '#1a1a1a',
    marginTop: hp('3%'),
    marginBottom: hp('1%'),
    fontWeight: '700',
  },
  emptyStateText: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: wp('4%'),
    color: '#666666',
    textAlign: 'center',
    lineHeight: wp('6%'),
  },
});

export default Notifications;