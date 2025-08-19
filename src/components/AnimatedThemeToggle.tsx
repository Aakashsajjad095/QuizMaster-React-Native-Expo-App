import React, { useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useThemeColor } from '../../hooks/useThemeColor';

interface AnimatedThemeToggleProps {
  size?: number;
  style?: any;
}

const { width } = Dimensions.get('window');

export const AnimatedThemeToggle: React.FC<AnimatedThemeToggleProps> = ({
  size = 50,
  style,
}) => {
  const { theme, toggleTheme } = useTheme();
  const backgroundColor = useThemeColor({}, 'card');
  const iconColor = useThemeColor({}, 'text');
  
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Rotation animation
    Animated.timing(rotateAnim, {
      toValue: theme === 'dark' ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Glow animation for dark mode
    if (theme === 'dark') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      glowAnim.setValue(0);
    }
  }, [theme]);

  const handlePress = () => {
    // Scale animation on press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    toggleTheme();
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const getIcon = () => {
    return theme === 'dark' ? 'moon' : 'sunny';
  };

  const getGradientColors = () => {
    return theme === 'dark' 
      ? ['#1a1a2e', '#16213e', '#0f3460']
      : ['#FFD700', '#FFA500', '#FF6347'];
  };

  return (
    <View style={[styles.container, style]}>
      {/* Glow effect for dark mode */}
      {theme === 'dark' && (
        <Animated.View
          style={[
            styles.glowContainer,
            {
              width: size + 20,
              height: size + 20,
              borderRadius: (size + 20) / 2,
              opacity: glowOpacity,
            },
          ]}
        />
      )}
      
      <TouchableOpacity
        onPress={handlePress}
        style={[
          styles.toggleButton,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: theme === 'dark' ? '#2c2c54' : '#FFF8DC',
          },
        ]}
        activeOpacity={0.8}
      >
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [
                { rotate: rotation },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          <Ionicons
            name={getIcon() as any}
            size={size * 0.6}
            color={theme === 'dark' ? '#FFD700' : '#FF6347'}
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowContainer: {
    position: 'absolute',
    backgroundColor: '#4169E1',
    shadowColor: '#4169E1',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  toggleButton: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AnimatedThemeToggle;