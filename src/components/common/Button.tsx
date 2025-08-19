import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { Colors, Typography, BorderRadius, Shadows, Spacing } from '../../constants/theme';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
  testID,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: BorderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.paddingHorizontal = Spacing.md;
        baseStyle.paddingVertical = Spacing.sm;
        baseStyle.minHeight = hp('4%');
        break;
      case 'large':
        baseStyle.paddingHorizontal = Spacing.xl;
        baseStyle.paddingVertical = Spacing.lg;
        baseStyle.minHeight = hp('7%');
        break;
      default: // medium
        baseStyle.paddingHorizontal = Spacing.lg;
        baseStyle.paddingVertical = Spacing.md;
        baseStyle.minHeight = hp('6%');
        break;
    }

    // Variant styles
    switch (variant) {
      case 'primary':
        baseStyle.backgroundColor = disabled ? Colors.buttonDisabled : Colors.buttonPrimary;
        if (!disabled) {
          Object.assign(baseStyle, Shadows.small);
        }
        break;
      case 'secondary':
        baseStyle.backgroundColor = disabled ? Colors.buttonDisabled : Colors.buttonSecondary;
        break;
      case 'outline':
        baseStyle.backgroundColor = Colors.transparent;
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = disabled ? Colors.buttonDisabled : Colors.buttonPrimary;
        break;
      case 'ghost':
        baseStyle.backgroundColor = Colors.transparent;
        break;
      case 'danger':
        baseStyle.backgroundColor = disabled ? Colors.buttonDisabled : Colors.error;
        if (!disabled) {
          Object.assign(baseStyle, Shadows.small);
        }
        break;
    }

    // Full width
    if (fullWidth) {
      baseStyle.width = '100%';
    }

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      fontFamily: Typography.fontFamily.medium,
      textAlign: 'center',
    };

    // Size styles
    switch (size) {
      case 'small':
        baseTextStyle.fontSize = Typography.fontSize.sm;
        break;
      case 'large':
        baseTextStyle.fontSize = Typography.fontSize.lg;
        break;
      default: // medium
        baseTextStyle.fontSize = Typography.fontSize.base;
        break;
    }

    // Variant styles
    switch (variant) {
      case 'primary':
      case 'danger':
        baseTextStyle.color = disabled ? Colors.textTertiary : Colors.textWhite;
        break;
      case 'secondary':
        baseTextStyle.color = disabled ? Colors.textTertiary : Colors.textPrimary;
        break;
      case 'outline':
      case 'ghost':
        baseTextStyle.color = disabled ? Colors.textTertiary : Colors.buttonPrimary;
        break;
    }

    return baseTextStyle;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="small"
            color={variant === 'primary' || variant === 'danger' ? Colors.textWhite : Colors.buttonPrimary}
          />
          <Text style={[getTextStyle(), textStyle, { marginLeft: Spacing.sm }]}>
            Loading...
          </Text>
        </View>
      );
    }

    const textElement = (
      <Text style={[getTextStyle(), textStyle]} numberOfLines={1}>
        {title}
      </Text>
    );

    if (!icon) {
      return textElement;
    }

    return (
      <View style={styles.contentContainer}>
        {iconPosition === 'left' && (
          <View style={[styles.iconContainer, { marginRight: Spacing.sm }]}>
            {icon}
          </View>
        )}
        {textElement}
        {iconPosition === 'right' && (
          <View style={[styles.iconContainer, { marginLeft: Spacing.sm }]}>
            {icon}
          </View>
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      testID={testID}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Button;