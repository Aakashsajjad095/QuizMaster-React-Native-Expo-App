import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColor } from '../../hooks/useThemeColor';
import { useAchievements } from '../hooks/useAchievements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const { width } = Dimensions.get('window');

interface ProfileStreakCounterProps {
  style?: any;
}

export const ProfileStreakCounter: React.FC<ProfileStreakCounterProps> = ({ style }) => {
  const { streakData } = useAchievements();
  const textColor = useThemeColor({}, 'text');
  
  // Animation refs
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Entry animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous animations
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    );

    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    );

    const sparkleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();
    rotateAnimation.start();
    glowAnimation.start();
    sparkleAnimation.start();

    return () => {
      pulseAnimation.stop();
      rotateAnimation.stop();
      glowAnimation.stop();
      sparkleAnimation.stop();
    };
  }, []);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const sparkleOpacity = sparkleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0],
  });

  const getStreakMessage = () => {
    const streak = streakData.currentStreak;
    if (streak === 0) return "Start your journey!";
    if (streak < 7) return "Building momentum!";
    if (streak < 30) return "On fire! 🔥";
    if (streak < 100) return "Streak master! ⚡";
    return "Legendary! 👑";
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        style,
        {
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      {/* Background glow effect */}
      <Animated.View 
        style={[
          styles.glowBackground,
          {
            opacity: glowOpacity,
          }
        ]}
      />
      
      {/* Main card */}
      <LinearGradient
        colors={['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientCard}
      >
        {/* Rotating border */}
        <Animated.View 
          style={[
            styles.rotatingBorder,
            {
              transform: [{ rotate: rotateInterpolate }]
            }
          ]}
        >
          <LinearGradient
            colors={['#FFD700', '#FF6B6B', '#4ECDC4', '#FFD700']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.borderGradient}
          />
        </Animated.View>
        
        {/* Content */}
        <View style={styles.content}>
          {/* Left section - Fire icon and streak */}
          <View style={styles.leftSection}>
            <Animated.View 
              style={[
                styles.iconContainer,
                {
                  transform: [{ scale: pulseAnim }]
                }
              ]}
            >
              <MaterialCommunityIcons 
                name="fire" 
                size={wp('8%')} 
                color="#FFD700" 
              />
              {/* Sparkle effects */}
              <Animated.View 
                style={[
                  styles.sparkle,
                  styles.sparkle1,
                  { opacity: sparkleOpacity }
                ]}
              >
                <Ionicons name="sparkles" size={12} color="#FFD700" />
              </Animated.View>
              <Animated.View 
                style={[
                  styles.sparkle,
                  styles.sparkle2,
                  { opacity: sparkleOpacity }
                ]}
              >
                <Ionicons name="sparkles" size={8} color="#FFF" />
              </Animated.View>
            </Animated.View>
            
            <View style={styles.streakInfo}>
              <Text style={styles.streakNumber}>{streakData.currentStreak}</Text>
              <Text style={styles.streakLabel}>Day Streak</Text>
            </View>
          </View>
          
          {/* Right section - Message and best streak */}
          <View style={styles.rightSection}>
            <Text style={styles.streakMessage}>{getStreakMessage()}</Text>
            <View style={styles.bestStreakContainer}>
              <Ionicons name="trophy" size={16} color="#FFD700" />
              <Text style={styles.bestStreakText}>Best: {streakData.bestStreak}</Text>
            </View>
          </View>
        </View>
        
        {/* Floating particles */}
        <Animated.View 
          style={[
            styles.particle,
            styles.particle1,
            { opacity: sparkleOpacity }
          ]}
        >
          <View style={styles.particleDot} />
        </Animated.View>
        <Animated.View 
          style={[
            styles.particle,
            styles.particle2,
            { opacity: sparkleOpacity }
          ]}
        >
          <View style={styles.particleDot} />
        </Animated.View>
        <Animated.View 
          style={[
            styles.particle,
            styles.particle3,
            { opacity: sparkleOpacity }
          ]}
        >
          <View style={styles.particleDot} />
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: wp('4%'),
    marginVertical: hp('2%'),
    position: 'relative',
  },
  glowBackground: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    backgroundColor: '#4ECDC4',
    borderRadius: 25,
    shadowColor: '#4ECDC4',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  gradientCard: {
    height: hp('12%'),
    borderRadius: 20,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
  },
  rotatingBorder: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 22,
  },
  borderGradient: {
    flex: 1,
    borderRadius: 22,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: 2,
    borderRadius: 18,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    position: 'relative',
    marginRight: wp('3%'),
  },
  sparkle: {
    position: 'absolute',
  },
  sparkle1: {
    top: -8,
    right: -5,
  },
  sparkle2: {
    bottom: -5,
    left: -8,
  },
  streakInfo: {
    alignItems: 'flex-start',
  },
  streakNumber: {
    fontSize: wp('7%'),
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  streakLabel: {
    fontSize: wp('3%'),
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: -2,
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  streakMessage: {
    fontSize: wp('3.5%'),
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'right',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  bestStreakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.5%'),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.3%'),
    borderRadius: 12,
  },
  bestStreakText: {
    fontSize: wp('3%'),
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: wp('1%'),
  },
  particle: {
    position: 'absolute',
  },
  particle1: {
    top: '20%',
    right: '15%',
  },
  particle2: {
    top: '70%',
    left: '20%',
  },
  particle3: {
    top: '40%',
    right: '25%',
  },
  particleDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default ProfileStreakCounter;