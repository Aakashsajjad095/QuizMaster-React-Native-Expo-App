import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated,
} from 'react-native';
import { Colors, Typography, BorderRadius, Spacing } from '../../constants/theme';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as _hp,
} from 'react-native-responsive-screen';

interface TimerProps {
  duration: number; // in seconds
  isRunning: boolean;
  onTimeUp?: () => void;
  onTick?: (remainingTime: number) => void;
  variant?: 'default' | 'circular' | 'minimal';
  size?: 'small' | 'medium' | 'large';
  showProgress?: boolean;
  warningThreshold?: number; // seconds when to show warning color
  dangerThreshold?: number; // seconds when to show danger color
  format?: 'mm:ss' | 'ss' | 'mm:ss:ms';
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

const Timer: React.FC<TimerProps> = ({
  duration,
  isRunning,
  onTimeUp,
  onTick,
  variant = 'default',
  size = 'medium',
  showProgress = false,
  warningThreshold = 30,
  dangerThreshold = 10,
  format = 'mm:ss',
  style,
  textStyle,
  testID,
}) => {
  const [remainingTime, setRemainingTime] = useState(duration);
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    setRemainingTime(duration);
  }, [duration]);

  useEffect(() => {
    type Timeout = ReturnType<typeof setInterval>;
    let interval: Timeout;

    if (isRunning && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((prev) => {
          const newTime = prev - 1;
          onTick?.(newTime);
          
          if (newTime <= 0) {
            onTimeUp?.();
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, remainingTime, onTick, onTimeUp]);

  useEffect(() => {
    if (remainingTime <= dangerThreshold && remainingTime > 0) {
      // Pulse animation for danger state
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [remainingTime, dangerThreshold, pulseAnim]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const ms = Math.floor((seconds % 1) * 100);

    switch (format) {
      case 'ss':
        return secs.toString().padStart(2, '0');
      case 'mm:ss:ms':
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
      default: // 'mm:ss'
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  };

  const getTimerColor = (): string => {
    if (remainingTime <= dangerThreshold) {
      return Colors.error;
    } else if (remainingTime <= warningThreshold) {
      return Colors.warning;
    }
    return Colors.textPrimary;
  };

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      alignItems: 'center',
      justifyContent: 'center',
    };

    switch (variant) {
      case 'circular':
        const circularSize = size === 'small' ? wp('15%') : size === 'large' ? wp('25%') : wp('20%');
        baseStyle.width = circularSize;
        baseStyle.height = circularSize;
        baseStyle.borderRadius = circularSize / 2;
        baseStyle.backgroundColor = Colors.cardBackground;
        baseStyle.borderWidth = 2;
        baseStyle.borderColor = getTimerColor();
        break;
      case 'minimal':
        baseStyle.paddingHorizontal = Spacing.sm;
        baseStyle.paddingVertical = Spacing.xs;
        break;
      default: // 'default'
        baseStyle.paddingHorizontal = Spacing.md;
        baseStyle.paddingVertical = Spacing.sm;
        baseStyle.backgroundColor = Colors.cardBackground;
        baseStyle.borderRadius = BorderRadius.md;
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = getTimerColor();
        break;
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontFamily: Typography.fontFamily.bold,
      color: getTimerColor(),
      textAlign: 'center',
    };

    switch (size) {
      case 'small':
        baseStyle.fontSize = Typography.fontSize.sm;
        break;
      case 'large':
        baseStyle.fontSize = Typography.fontSize.xl;
        break;
      default: // 'medium'
        baseStyle.fontSize = Typography.fontSize.xl;
        break;
    }

    return baseStyle;
  };

  const progress = duration > 0 ? (remainingTime / duration) * 100 : 0;

  return (
    <Animated.View
      style={[
        getContainerStyle(),
        style,
        { transform: [{ scale: pulseAnim }] },
      ]}
      testID={testID}
    >
      {showProgress && variant === 'circular' && (
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${progress}%`,
                backgroundColor: getTimerColor(),
              },
            ]}
          />
        </View>
      )}
      
      <Text style={[getTextStyle(), textStyle]}>
        {formatTime(remainingTime)}
      </Text>
      
      {showProgress && variant !== 'circular' && (
        <View style={styles.linearProgressContainer}>
          <View
            style={[
              styles.linearProgressBar,
              {
                width: `${progress}%`,
                backgroundColor: getTimerColor(),
              },
            ]}
          />
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    position: 'absolute',
    bottom: Spacing.xs,
    left: Spacing.xs,
    right: Spacing.xs,
    height: 4,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  linearProgressContainer: {
    marginTop: Spacing.xs,
    width: '100%',
    height: 4,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 2,
    overflow: 'hidden',
  },
  linearProgressBar: {
    height: '100%',
    borderRadius: 2,
  },
});

export default Timer;