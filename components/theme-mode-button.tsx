import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
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
  const palette = Colors[resolvedColorScheme];

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityLabel="Auto theme"
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isAuto }}
        onPress={() => setIsAuto(!isAuto)}
        style={({ pressed }) => [styles.autoControl, { opacity: pressed ? 0.72 : 1 }]}>
        <View
          style={[
            styles.checkbox,
            {
              backgroundColor: isAuto ? palette.primaryButtonBackground : palette.surface,
              borderColor: isAuto ? palette.primaryButtonBackground : palette.border,
            },
          ]}>
          {isAuto ? (
            <ThemedText type="defaultSemiBold" style={[styles.checkmark, { color: palette.primaryButtonText }]}>
              ✓
            </ThemedText>
          ) : null}
        </View>
        <ThemedText type="defaultSemiBold" style={styles.autoLabel}>
          Auto
        </ThemedText>
      </Pressable>
      <Pressable
        accessibilityLabel={themeModeLabels[resolvedColorScheme]}
        accessibilityRole="button"
        accessibilityState={{ disabled: isAuto }}
        disabled={isAuto}
        onPress={cycleThemeMode}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: palette.surface,
            borderColor: palette.border,
            opacity: isAuto ? 0.46 : pressed ? 0.72 : 1,
          },
        ]}>
        <ThemedText type="defaultSemiBold" style={styles.label}>
          {themeModeSymbols[resolvedColorScheme]}
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  autoControl: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    minHeight: 40,
  },
  autoLabel: {
    fontSize: 14,
    lineHeight: 18,
  },
  button: {
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  checkbox: {
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    height: 18,
    justifyContent: 'center',
    width: 18,
  },
  checkmark: {
    fontSize: 14,
    lineHeight: 16,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 17,
    lineHeight: 21,
  },
});
