/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    // Additional theme colors
    primary: '#667eea',
    secondary: '#764ba2',
    surface: '#f8f9fa',
    card: '#ffffff',
    border: '#e1e8ed',
    notification: '#ff3b30',
    success: '#34c759',
    warning: '#ff9500',
    error: '#ff3b30',
    textSecondary: '#8e8e93',
    textTertiary: '#c7c7cc',
    shadow: '#000000',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    // Additional theme colors
    primary: '#667eea',
    secondary: '#764ba2',
    surface: '#1c1c1e',
    card: '#2c2c2e',
    border: '#38383a',
    notification: '#ff453a',
    success: '#30d158',
    warning: '#ff9f0a',
    error: '#ff453a',
    textSecondary: '#8e8e93',
    textTertiary: '#48484a',
    shadow: '#000000',
  },
};
