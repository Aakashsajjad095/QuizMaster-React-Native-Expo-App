import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { Colors, Typography, BorderRadius, Spacing } from '../../constants/theme';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface InputProps extends TextInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  disabled?: boolean;
  variant?: 'default' | 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  testID?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  disabled = false,
  variant = 'default',
  size = 'medium',
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  testID,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: BorderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
    };

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.paddingHorizontal = Spacing.sm;
        baseStyle.paddingVertical = Spacing.xs;
        baseStyle.minHeight = hp('4.5%');
        break;
      case 'large':
        baseStyle.paddingHorizontal = Spacing.lg;
        baseStyle.paddingVertical = Spacing.md;
        baseStyle.minHeight = hp('6.5%');
        break;
      default: // medium
        baseStyle.paddingHorizontal = Spacing.md;
        baseStyle.paddingVertical = Spacing.sm;
        baseStyle.minHeight = hp('5.5%');
        break;
    }

    // Variant styles
    switch (variant) {
      case 'outlined':
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = error
          ? Colors.error
          : isFocused
          ? Colors.primary
          : Colors.border;
        baseStyle.backgroundColor = Colors.background;
        break;
      case 'filled':
        baseStyle.backgroundColor = Colors.backgroundSecondary;
        baseStyle.borderWidth = 0;
        break;
      default: // default
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = error
          ? Colors.error
          : isFocused
          ? Colors.primary
          : Colors.border;
        baseStyle.backgroundColor = Colors.background;
        break;
    }

    // Disabled state
    if (disabled) {
      baseStyle.backgroundColor = Colors.background;
      baseStyle.borderColor = Colors.border;
    }

    return baseStyle;
  };

  const getInputStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      flex: 1,
      fontFamily: Typography.fontFamily.regular,
      color: disabled ? Colors.textTertiary : Colors.textPrimary,
    };

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.fontSize = Typography.fontSize.sm;
        break;
      case 'large':
        baseStyle.fontSize = Typography.fontSize.lg;
        break;
      default: // medium
        baseStyle.fontSize = Typography.fontSize.base;
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

  const getErrorStyle = (): TextStyle => {
    return {
      fontFamily: Typography.fontFamily.regular,
      fontSize: Typography.fontSize.xs,
      color: Colors.error,
      marginTop: Spacing.xs,
    };
  };

  return (
    <View style={containerStyle}>
      {label && (
        <Text style={[getLabelStyle(), labelStyle]}>
          {label}
        </Text>
      )}
      
      <View style={getContainerStyle()}>
        {leftIcon && (
          <View style={styles.iconContainer}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={[getInputStyle(), inputStyle]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textTertiary}
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          testID={testID}
          {...textInputProps}
        />
        
        {rightIcon && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={[getErrorStyle(), errorStyle]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    paddingHorizontal: Spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Input;