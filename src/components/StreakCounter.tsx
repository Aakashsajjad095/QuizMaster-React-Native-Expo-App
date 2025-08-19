import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColor } from '../../hooks/useThemeColor';
import { useAchievements } from '../hooks/useAchievements';

interface StreakCounterProps {
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({
  size = 'medium',
  showLabel = true,
}) => {
  const { streakData } = useAchievements();
  const textColor = useThemeColor({}, 'text');
  const cardBackground = useThemeColor({}, 'card');
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  const sizeConfig = {
    small: {
      containerSize: 70,
      iconSize: 22,
      fontSize: 16,
      labelSize: 11,
    },
    medium: {
      containerSize: 90,
      iconSize: 28,
      fontSize: 20,
      labelSize: 13,
    },
    large: {
      containerSize: 110,
      iconSize: 36,
      fontSize: 26,
      labelSize: 15,
    },
  };

  const config = sizeConfig[size];
  const currentStreak = streakData?.currentStreak || 0;
  
  useEffect(() => {
    // Pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    
    // Rotation animation for high streaks
    const rotateAnimation = currentStreak >= 10 ? Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ) : null;
    
    // Glow animation
    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    );
    
    pulseAnimation.start();
    if (rotateAnimation) rotateAnimation.start();
    glowAnimation.start();
    
    return () => {
      pulseAnimation.stop();
      if (rotateAnimation) rotateAnimation.stop();
      glowAnimation.stop();
    };
  }, [currentStreak]);
  
  const getStreakColor = () => {
    if (currentStreak >= 30) return ['#FF6B6B', '#FF8E53', '#FFD93D'];
    if (currentStreak >= 20) return ['#4ECDC4', '#44A08D', '#96E6A1'];
    if (currentStreak >= 10) return ['#45B7D1', '#96C93D', '#A8E6CF'];
    if (currentStreak >= 5) return ['#FFA726', '#FB8C00', '#FFE082'];
    return ['#9C27B0', '#673AB7', '#BA68C8'];
  };
  
  const getGlowColor = () => {
    if (currentStreak >= 30) return '#FF6B6B';
    if (currentStreak >= 20) return '#4ECDC4';
    if (currentStreak >= 10) return '#45B7D1';
    if (currentStreak >= 5) return '#FFA726';
    return '#9C27B0';
  };

  const getStreakIcon = () => {
    if (currentStreak >= 30) return 'flame';
    if (currentStreak >= 20) return 'diamond';
    if (currentStreak >= 10) return 'star';
    if (currentStreak >= 5) return 'flash';
    return 'checkmark-circle';
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });
  
  return (
    <View style={styles.container}>
      {/* Outer glow effect */}
      <Animated.View
        style={[
          styles.glowContainer,
          {
            width: config.containerSize + 20,
            height: config.containerSize + 20,
            borderRadius: (config.containerSize + 20) / 2,
            backgroundColor: getGlowColor(),
            opacity: glowOpacity,
          },
        ]}
      />
      
      {/* Main streak container */}
      <Animated.View
        style={[
          styles.animatedContainer,
          {
            transform: [
              { scale: pulseAnim },
              { rotate: currentStreak >= 10 ? spin : '0deg' },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={getStreakColor() as [string, string, string]}
          style={[
            styles.streakContainer,
            {
              width: config.containerSize,
              height: config.containerSize,
              borderRadius: config.containerSize / 2,
            },
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Particle effects for high streaks */}
          {currentStreak >= 20 && (
            <View style={styles.particleContainer}>
              <View style={[styles.particle, styles.particle1]} />
              <View style={[styles.particle, styles.particle2]} />
              <View style={[styles.particle, styles.particle3]} />
            </View>
          )}
          
          <Ionicons
            name={getStreakIcon() as any}
            size={config.iconSize}
            color="white"
            style={styles.icon}
          />
          <Text style={[styles.streakNumber, { fontSize: config.fontSize }]}>
            {currentStreak}
          </Text>
        </LinearGradient>
      </Animated.View>
      
      {showLabel && (
        <Text style={[styles.label, { color: textColor, fontSize: config.labelSize }]}>
          🔥 Day Streak
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ scale: 1 }],
  },
  glowContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  animatedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 12,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    position: 'relative',
    overflow: 'hidden',
  },
  particleContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 2,
  },
  particle1: {
    top: '20%',
    left: '20%',
  },
  particle2: {
    top: '30%',
    right: '25%',
  },
  particle3: {
    bottom: '25%',
    left: '30%',
  },
  icon: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  streakNumber: {
    color: 'white',
    fontWeight: '900',
    marginTop: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  label: {
    marginTop: 12,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

export default StreakCounter;