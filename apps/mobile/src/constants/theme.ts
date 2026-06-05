/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#101114',
    background: '#F7F7F5',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#ECEDEA',
    textSecondary: '#6F747A',
    // Semantic
    primary: '#0A84FF',
    primaryForeground: '#FFFFFF',
    destructive: '#D92D20',
    destructiveForeground: '#FFFFFF',
    success: '#1F9D55',
    successForeground: '#FFFFFF',
    warning: '#C77800',
    warningForeground: '#FFFFFF',
    border: '#E2E3DF',
    inputBackground: '#FFFFFF',
    overlay: 'rgba(16, 17, 20, 0.36)',
  },
  dark: {
    text: '#F5F5F2',
    background: '#0C0D0F',
    backgroundElement: '#17191C',
    backgroundSelected: '#25282D',
    textSecondary: '#A5ABB3',
    // Semantic
    primary: '#64A8FF',
    primaryForeground: '#FFFFFF',
    destructive: '#FF6157',
    destructiveForeground: '#FFFFFF',
    success: '#4BD47F',
    successForeground: '#FFFFFF',
    warning: '#FFB340',
    warningForeground: '#FFFFFF',
    border: '#2D3035',
    inputBackground: '#14161A',
    overlay: 'rgba(0, 0, 0, 0.56)',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 24,
  six: 40,
} as const;

export const Typography = {
  xs: { fontSize: 12, lineHeight: 16 },
  sm: { fontSize: 13, lineHeight: 18 },
  base: { fontSize: 15, lineHeight: 22 },
  lg: { fontSize: 17, lineHeight: 24 },
  xl: { fontSize: 20, lineHeight: 26 },
  '2xl': { fontSize: 24, lineHeight: 30 },
  '3xl': { fontSize: 30, lineHeight: 36 },
} as const;

export const Radii = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const Shadows = {
  sm: { boxShadow: '0 1px 2px rgba(16, 17, 20, 0.06)' },
  md: { boxShadow: '0 8px 24px rgba(16, 17, 20, 0.08)' },
  lg: { boxShadow: '0 18px 42px rgba(16, 17, 20, 0.12)' },
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
