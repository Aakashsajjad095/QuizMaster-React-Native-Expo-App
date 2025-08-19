import { Dimensions } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const { width, height } = Dimensions.get('window');

// Colors from Figma Design
export const Colors = {
  // Primary Colors
  primary: '#6C5CE7',
  primaryLight: '#A29BFE',
  primaryDark: '#5F3DC4',
  
  // Secondary Colors
  secondary: '#00CEC9',
  secondaryLight: '#55EFC4',
  secondaryDark: '#00B894',
  
  // Accent Colors
  accent: '#FDCB6E',
  accentLight: '#FFE066',
  accentDark: '#E17055',
  
  // Background Colors
  background: '#FFFFFF',
  backgroundPrimary: '#FFFFFF',
  backgroundSecondary: '#F8F9FA',
  backgroundTertiary: '#E9ECEF',
  
  // Text Colors
  textPrimary: '#2D3436',
  textSecondary: '#636E72',
  textTertiary: '#B2BEC3',
  textWhite: '#FFFFFF',
  
  // Status Colors
  success: '#28A745',
  successLight: '#D4EDDA',
  warning: '#FFC107',
  error: '#DC3545',
  errorLight: '#F8D7DA',
  info: '#17A2B8',
  white: '#FFFFFF',
  border: '#E0E0E0',
  
  // Card Colors
  cardBackground: '#FFFFFF',
  cardBorder: '#E9ECEF',
  cardShadow: 'rgba(0, 0, 0, 0.1)',
  
  // Button Colors
  buttonPrimary: '#6C5CE7',
  buttonSecondary: '#DDD6FE',
  buttonDisabled: '#B2BEC3',
  
  // Quiz Colors
  correct: '#00B894',
  incorrect: '#E17055',
  unanswered: '#B2BEC3',
  
  // Gradient Colors
  gradientStart: '#6C5CE7',
  gradientEnd: '#A29BFE',
  
  // Transparent Colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  transparent: 'transparent',

  // Leaderboard Colors
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
};

// Typography
export const Typography = {
  // Font Families
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },
  
  // Font Sizes (Responsive)
  fontSize: {
    xs: wp('3%'),
    sm: wp('3.5%'),
    base: wp('4%'),
    lg: wp('4.5%'),
    xl: wp('5%'),
    '2xl': wp('6%'),
    '3xl': wp('7%'),
    '4xl': wp('8%'),
    '5xl': wp('10%'),
  },
  
  // Line Height
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    base: 1.5,
    relaxed: 1.6,
    loose: 1.8,
  },
  
  // Font Weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800',
  },
};

// Spacing (Responsive)
export const Spacing = {
  xs: wp('1%'),
  sm: wp('2%'),
  md: wp('4%'),
  lg: wp('6%'),
  xl: wp('8%'),
  xxl: wp('10%'),
  '2xl': wp('10%'),
  '3xl': wp('12%'),
  '4xl': wp('16%'),
  '5xl': wp('20%'),
};

// Border Radius
export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
};

// Shadows
export const Shadows = {
  small: {
    shadowColor: Colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  medium: {
    shadowColor: Colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6.27,
    elevation: 8,
  },
  large: {
    shadowColor: Colors.cardShadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10.32,
    elevation: 12,
  },
};

// Layout
export const Layout = {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  headerHeight: hp('12%'),
  tabBarHeight: hp('10%'),
  buttonHeight: hp('6%'),
  inputHeight: hp('6%'),
};

// Animation Durations
export const AnimationDuration = {
  fast: 200,
  normal: 300,
  slow: 500,
};

// Z-Index
export const ZIndex = {
  modal: 1000,
  overlay: 999,
  dropdown: 998,
  header: 997,
  fab: 996,
};

export default {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  Layout,
  AnimationDuration,
  ZIndex,
};