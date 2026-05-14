import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeMode } from '@/state/context/theme-mode';

const themeModeLabels = {
  light: 'Light theme',
  dark: 'Dark theme',
};

const themeModeSymbols = {
  light: '☀️',
  dark: '🌙',
};

export function ThemeModeButton() {
  const { isAuto, resolvedColorScheme, setIsAuto, cycleThemeMode } = useThemeMode();
  const [isThemeButtonHovered, setIsThemeButtonHovered] = useState(false);
  const previewColorScheme =
    isThemeButtonHovered && !isAuto
      ? resolvedColorScheme === 'light'
        ? 'dark'
        : 'light'
      : resolvedColorScheme;
  const previewTextColor = previewColorScheme === 'dark' ? '#eee8d5' : '#002b36';

  return (
    <View className="flex-row items-center gap-3">
      <Pressable
        testID="theme-auto-toggle"
        accessibilityLabel="Auto theme"
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isAuto }}
        onPress={() => setIsAuto(!isAuto)}
        className="min-h-10 flex-row items-center gap-1.5 rounded-md px-1 transition-colors duration-500 hover:bg-solarized-base2 active:opacity-70 dark:hover:bg-solarized-base02"
      >
        <View
          className={
            isAuto
              ? 'h-[18px] w-[18px] items-center justify-center rounded border border-gymflow-primary bg-gymflow-primary transition-colors duration-500 dark:border-gymflow-primaryDark dark:bg-gymflow-primaryDark'
              : 'h-[18px] w-[18px] items-center justify-center rounded border border-solarized-base1 bg-solarized-base2 transition-colors duration-500 dark:border-solarized-base01 dark:bg-solarized-base02'
          }>
          {isAuto ? (
            <View style={styles.checkboxCheckmark} />
            /*<ThemedText
              type="defaultSemiBold"
              lightColor="#ffffff"
              darkColor="#002b36"
              className="text-sm leading-4 text-white dark:text-solarized-base03">
              ✓
            </ThemedText>*/
          ) : null}
        </View>
        <ThemedText type="defaultSemiBold" className="text-sm leading-[18px]">
          Auto
        </ThemedText>
      </Pressable>
      <Pressable
        testID="theme-mode-toggle"
        accessibilityLabel={themeModeLabels[resolvedColorScheme]}
        accessibilityRole="button"
        accessibilityState={{ disabled: isAuto }}
        disabled={isAuto}
        onHoverIn={() => setIsThemeButtonHovered(true)}
        onHoverOut={() => setIsThemeButtonHovered(false)}
        onPress={cycleThemeMode}
        style={{ opacity: isAuto ? 0.45 : 1 }}
        className={
          previewColorScheme === 'dark'
            ? 'h-9 w-9 items-center justify-center rounded-full border border-solarized-base01 bg-solarized-base02 transition-colors duration-500 active:opacity-70'
            : 'h-9 w-9 items-center justify-center rounded-full border border-solarized-base1 bg-solarized-base2 transition-colors duration-500 active:opacity-70'
        }>
        <ThemedText
          type="defaultSemiBold"
          lightColor={previewTextColor}
          darkColor={previewTextColor}
          className="text-[17px] leading-[21px]">
          {themeModeSymbols[previewColorScheme]}
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = {
  checkboxCheckmark: {
    borderBottomColor: '#ffffff',
    borderBottomWidth: 3,
    borderRightColor: '#ffffff',
    borderRightWidth: 3,
    height: 12,
    marginTop: -2,
    transform: [{ rotate: '45deg' }],
    width: 7,
  },
};