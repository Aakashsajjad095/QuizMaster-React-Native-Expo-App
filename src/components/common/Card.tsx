import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { Colors, BorderRadius, Shadows, Spacing } from '../../constants/theme';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'flat';
  padding?: 'none' | 'small' | 'medium' | 'large';
  margin?: 'none' | 'small' | 'medium' | 'large';
  backgroundColor?: string;
  borderRadius?: number;
  onPress?: () => void;
  style?: ViewStyle;
  testID?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  margin = 'none',
  backgroundColor,
  borderRadius,
  onPress,
  style,
  testID,
  ...touchableProps
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: borderRadius ?? BorderRadius.lg,
      backgroundColor: backgroundColor ?? Colors.cardBackground,
    };

    // Variant styles
    switch (variant) {
      case 'elevated':
        Object.assign(baseStyle, Shadows.medium);
        break;
      case 'outlined':
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = Colors.border;
        break;
      case 'flat':
        baseStyle.backgroundColor = Colors.transparent;
        break;
      default: // default
        Object.assign(baseStyle, Shadows.small);
        break;
    }

    // Padding styles
    switch (padding) {
      case 'none':
        break;
      case 'small':
        baseStyle.padding = Spacing.sm;
        break;
      case 'large':
        baseStyle.padding = Spacing.xl;
        break;
      default: // medium
        baseStyle.padding = Spacing.lg;
        break;
    }

    // Margin styles
    switch (margin) {
      case 'small':
        baseStyle.margin = Spacing.sm;
        break;
      case 'medium':
        baseStyle.margin = Spacing.md;
        break;
      case 'large':
        baseStyle.margin = Spacing.lg;
        break;
      default: // none
        break;
    }

    return baseStyle;
  };

  const cardStyle = [getCardStyle(), style];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.8}
        testID={testID}
        {...touchableProps}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle} testID={testID}>
      {children}
    </View>
  );
};

export default Card;