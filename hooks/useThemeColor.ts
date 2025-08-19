/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/Colors';
import { useTheme } from '../src/contexts/ThemeContext';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const { effectiveTheme } = useTheme();
  const colorFromProps = props[effectiveTheme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[effectiveTheme][colorName];
  }
}
