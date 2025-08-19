import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Layout } from '../../constants/theme';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  backgroundColor?: string;
  variant?: 'default' | 'transparent' | 'gradient';
  showBackButton?: boolean;
  centerTitle?: boolean;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  testID?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  backgroundColor,
  variant = 'default',
  showBackButton = false,
  centerTitle = true,
  style,
  titleStyle,
  subtitleStyle,
  testID,
}) => {
  const insets = useSafeAreaInsets();

  const getHeaderStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      paddingTop: insets.top,
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: Layout.headerHeight + insets.top,
    };

    switch (variant) {
      case 'transparent':
        baseStyle.backgroundColor = Colors.transparent;
        break;
      case 'gradient':
        baseStyle.backgroundColor = backgroundColor || Colors.gradientStart;
        break;
      default:
        baseStyle.backgroundColor = backgroundColor || Colors.backgroundPrimary;
        break;
    }

    return baseStyle;
  };

  const getTitleStyle = (): TextStyle => {
    return {
      fontFamily: Typography.fontFamily.bold,
      fontSize: Typography.fontSize.xl,
      color: variant === 'transparent' ? Colors.textWhite : Colors.textPrimary,
      textAlign: centerTitle ? 'center' : 'left',
    };
  };

  const getSubtitleStyle = (): TextStyle => {
    return {
      fontFamily: Typography.fontFamily.regular,
      fontSize: Typography.fontSize.sm,
      color: variant === 'transparent' ? Colors.textWhite : Colors.textSecondary,
      textAlign: centerTitle ? 'center' : 'left',
      marginTop: Spacing.xs,
    };
  };

  const renderLeftSection = () => {
    if (leftIcon || showBackButton) {
      return (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onLeftPress}
          disabled={!onLeftPress}
        >
          {leftIcon || (
            <Text style={styles.backButton}>←</Text>
          )}
        </TouchableOpacity>
      );
    }
    return <View style={styles.iconButton} />;
  };

  const renderRightSection = () => {
    if (rightIcon) {
      return (
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onRightPress}
          disabled={!onRightPress}
        >
          {rightIcon}
        </TouchableOpacity>
      );
    }
    return <View style={styles.iconButton} />;
  };

  const renderTitle = () => {
    if (!title && !subtitle) return null;

    return (
      <View style={[styles.titleContainer, centerTitle && styles.centerTitle]}>
        {title && (
          <Text style={[getTitleStyle(), titleStyle]} numberOfLines={1}>
            {title}
          </Text>
        )}
        {subtitle && (
          <Text style={[getSubtitleStyle(), subtitleStyle]} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
    );
  };

  return (
    <>
      <StatusBar
        barStyle={variant === 'transparent' ? 'light-content' : 'dark-content'}
        backgroundColor={variant === 'transparent' ? Colors.transparent : Colors.backgroundPrimary}
        translucent={variant === 'transparent'}
      />
      <View style={[getHeaderStyle(), style]} testID={testID}>
        {renderLeftSection()}
        {renderTitle()}
        {renderRightSection()}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    width: wp('12%'),
    height: wp('12%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    fontSize: Typography.fontSize.xl,
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.medium,
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  centerTitle: {
    alignItems: 'center',
  },
});

export default Header;