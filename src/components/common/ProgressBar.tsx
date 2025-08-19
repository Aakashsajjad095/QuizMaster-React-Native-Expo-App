import React, { useEffect, useRef } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  ViewStyle,
  Text,
  TextStyle,
} from 'react-native';
import { Colors, Typography, BorderRadius, Spacing } from '../../constants/theme';
import {
  widthPercentageToDP as _wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface ProgressBarProps {
  progress: number; // 0 to 100
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
  borderRadius?: number;
  animated?: boolean;
  animationDuration?: number;
  showPercentage?: boolean;
  showLabel?: boolean;
  label?: string;
  variant?: 'default' | 'gradient' | 'striped';
  style?: ViewStyle;
  labelStyle?: TextStyle;
  testID?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = hp('1%'),
  backgroundColor = Colors.backgroundSecondary,
  progressColor = Colors.primary,
  borderRadius = BorderRadius.sm,
  animated = true,
  animationDuration = 300,
  showPercentage = false,
  showLabel = false,
  label,
  variant = 'default',
  style,
  labelStyle,
  testID,
}) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const clampedProgress = Math.max(0, Math.min(100, progress));

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedWidth, {
        toValue: clampedProgress,
        duration: animationDuration,
        useNativeDriver: false,
      }).start();
    } else {
      animatedWidth.setValue(clampedProgress);
    }
  }, [clampedProgress, animated, animationDuration, animatedWidth]);

  const getProgressStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      height: '100%',
      borderRadius,
    };

    switch (variant) {
      case 'gradient':
        baseStyle.backgroundColor = progressColor;
        // Note: For gradient, you might want to use LinearGradient from expo-linear-gradient
        break;
      case 'striped':
        baseStyle.backgroundColor = progressColor;
        // Note: For striped pattern, you might want to add additional styling
        break;
      default:
        baseStyle.backgroundColor = progressColor;
        break;
    }

    return baseStyle;
  };

  const getLabelStyle = (): TextStyle => {
    return {
      fontFamily: Typography.fontFamily.medium,
      fontSize: Typography.fontSize.sm,
      color: Colors.textSecondary,
      marginBottom: Spacing.xs,
    };
  };

  const getPercentageStyle = (): TextStyle => {
    return {
      fontFamily: Typography.fontFamily.bold,
      fontSize: Typography.fontSize.xs,
      color: Colors.textPrimary,
      marginTop: Spacing.xs,
      textAlign: 'right',
    };
  };

  return (
    <View style={style} testID={testID}>
      {(showLabel && label) && (
        <Text style={[getLabelStyle(), labelStyle]}>
          {label}
        </Text>
      )}
      
      <View
        style={[
          styles.container,
          {
            height,
            backgroundColor,
            borderRadius,
          },
        ]}
      >
        <Animated.View
          style={[
            getProgressStyle(),
            {
              width: animatedWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
                extrapolate: 'clamp',
              }),
            },
          ]}
        />
      </View>
      
      {showPercentage && (
        <Text style={getPercentageStyle()}>
          {Math.round(clampedProgress)}%
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    width: '100%',
  },
});

export default ProgressBar;