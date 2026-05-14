/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

export const SolarizedColors = {
  base03: '#002b36',
  base02: '#073642',
  base01: '#586e75',
  base00: '#657b83',
  base0: '#839496',
  base1: '#93a1a1',
  base2: '#eee8d5',
  base3: '#fdf6e3',
  yellow: '#b58900',
  orange: '#cb4b16',
  red: '#dc322f',
  magenta: '#d33682',
  violet: '#6c71c4',
  blue: '#268bd2',
  cyan: '#2aa198',
  green: '#859900',
} as const;

export const SharedColors = {
  black: '#000000',
  dangerHover: '#b91c1c',
  errorDark: '#ff8f8f',
  formBorderDark: '#31565f',
  primaryHover: '#276f4b',
  primaryHoverDark: '#52c98d',
  selectorDark: '#002f3b',
  selectorHoverLight: '#d8d1bd',
  transparent: 'transparent',
  white: '#ffffff',
} as const;

const tintColorLight = '#0a7ea4';
const tintColorDark = SharedColors.white;

export const Colors = {
  light: {
    text: SolarizedColors.base02,
    mutedText: SolarizedColors.base01,
    background: SolarizedColors.base3,
    surface: SolarizedColors.base2,
    border: '#d6cfbd',
    formBorder: SharedColors.white,
    tint: tintColorLight,
    onTint: SharedColors.white,
    primaryButtonBackground: '#2f855a',
    primaryButtonHover: SharedColors.primaryHover,
    primaryButtonText: SharedColors.white,
    accent: SolarizedColors.yellow,
    accentSoft: '#f4e7b5',
    danger: SolarizedColors.red,
    dangerHover: SharedColors.dangerHover,
    errorText: SolarizedColors.red,
    icon: SolarizedColors.base01,
    link: tintColorLight,
    modalBackdrop: SharedColors.black,
    selectorBackground: '#e2dcc9',
    selectorHoverBackground: SharedColors.selectorHoverLight,
    tabIconDefault: SolarizedColors.base01,
    tabIconSelected: tintColorLight,
    todayBackground: '#eadb9f',
    transparentButtonHover: '#e2dcc9',
  },
  dark: {
    text: SolarizedColors.base2,
    mutedText: SolarizedColors.base1,
    background: SolarizedColors.base03,
    surface: SolarizedColors.base02,
    border: SharedColors.formBorderDark,
    formBorder: SharedColors.formBorderDark,
    tint: tintColorDark,
    onTint: SolarizedColors.base03,
    primaryButtonBackground: '#6ee7a8',
    primaryButtonHover: SharedColors.primaryHoverDark,
    primaryButtonText: SolarizedColors.base03,
    accent: SolarizedColors.yellow,
    accentSoft: '#3a3f2c',
    danger: SolarizedColors.red,
    dangerHover: SharedColors.dangerHover,
    errorText: SharedColors.errorDark,
    icon: SolarizedColors.base1,
    link: tintColorDark,
    modalBackdrop: SharedColors.black,
    selectorBackground: SharedColors.selectorDark,
    selectorHoverBackground: '#0b4350',
    tabIconDefault: SolarizedColors.base1,
    tabIconSelected: tintColorDark,
    todayBackground: 'rgba(181, 137, 0, 0.2)',
    transparentButtonHover: '#0b4350',
  },
};

export type AppColorScheme = keyof typeof Colors;
export type ThemePalette = (typeof Colors)[AppColorScheme];

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
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
