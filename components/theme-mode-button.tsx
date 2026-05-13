import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useThemeMode } from '@/state/context/theme-mode';

const themeModeLabels = {
  auto: 'Auto theme',
  light: 'Light theme',
  dark: 'Dark theme',
};

const themeModeSymbols = {
  auto: 'A',
  light: 'L',
  dark: 'D',
};

export function ThemeModeButton() {
  const { resolvedColorScheme, cycleThemeMode } = useThemeMode();
  const palette = Colors[resolvedColorScheme];

  return (
    <Pressable
      accessibilityLabel={themeModeLabels[resolvedColorScheme]}
      accessibilityRole="button"
      onPress={cycleThemeMode}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: palette.surface,
          borderColor: palette.border,
          opacity: pressed ? 0.72 : 1,
        },
      ]}>
      <ThemedText type="defaultSemiBold" style={[styles.label, { color: palette.tint }]}>
        {themeModeSymbols[resolvedColorScheme]}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    marginRight: 12,
    width: 36,
  },
  label: {
    fontSize: 14,
    lineHeight: 18,
  },
});