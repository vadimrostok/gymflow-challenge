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

  return (
    <View className="flex-row items-center gap-3">
      <Pressable
        accessibilityLabel="Auto theme"
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isAuto }}
        onPress={() => setIsAuto(!isAuto)}
        className="min-h-10 flex-row items-center gap-1.5 active:opacity-70">
        <View
          className={
            isAuto
              ? 'h-[18px] w-[18px] items-center justify-center rounded border border-gymflow-primary bg-gymflow-primary dark:border-gymflow-primaryDark dark:bg-gymflow-primaryDark'
              : 'h-[18px] w-[18px] items-center justify-center rounded border border-solarized-base1 bg-solarized-base2 dark:border-solarized-base01 dark:bg-solarized-base02'
          }>
          {isAuto ? (
            <ThemedText
              type="defaultSemiBold"
              lightColor="#ffffff"
              darkColor="#002b36"
              className="text-sm leading-4 text-white dark:text-solarized-base03">
              ✓
            </ThemedText>
          ) : null}
        </View>
        <ThemedText type="defaultSemiBold" className="text-sm leading-[18px]">
          Auto
        </ThemedText>
      </Pressable>
      <Pressable
        accessibilityLabel={themeModeLabels[resolvedColorScheme]}
        accessibilityRole="button"
        accessibilityState={{ disabled: isAuto }}
        disabled={isAuto}
        onPress={cycleThemeMode}
        className="h-9 w-9 items-center justify-center rounded-full border border-solarized-base1 bg-solarized-base2 active:opacity-70 disabled:opacity-45 dark:border-solarized-base01 dark:bg-solarized-base02">
        <ThemedText type="defaultSemiBold" className="text-[17px] leading-[21px]">
          {themeModeSymbols[resolvedColorScheme]}
        </ThemedText>
      </Pressable>
    </View>
  );
}
