/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#073642',
    mutedText: '#586e75',
    background: '#fdf6e3',
    surface: '#eee8d5',
    border: '#d6cfbd',
    tint: tintColorLight,
    onTint: '#ffffff',
    accent: '#b58900',
    accentSoft: '#f4e7b5',
    danger: '#dc322f',
    icon: '#586e75',
    tabIconDefault: '#586e75',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#eee8d5',
    mutedText: '#93a1a1',
    background: '#002b36',
    surface: '#073642',
    border: '#31565f',
    tint: tintColorDark,
    onTint: '#002b36',
    accent: '#b58900',
    accentSoft: '#3a3f2c',
    danger: '#dc322f',
    icon: '#93a1a1',
    tabIconDefault: '#93a1a1',
    tabIconSelected: tintColorDark,
  },
};

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
