import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Pressable } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemeModeProvider, useThemeMode } from '@/state/context/theme-mode';
import { createMemoryPreferencesStorage } from '@/state/storage/preferences-storage';

function ThemeModeProbe() {
  const { cycleThemeMode, isAuto, resolvedColorScheme, setIsAuto } = useThemeMode();

  return (
    <>
      <ThemedText>{resolvedColorScheme}</ThemedText>
      <Pressable accessibilityRole="button" onPress={cycleThemeMode}>
        <ThemedText>cycle</ThemedText>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={() => setIsAuto(!isAuto)}>
        <ThemedText>auto</ThemedText>
      </Pressable>
    </>
  );
}

describe('ThemeModeProvider', () => {
  it('hydrates and persists theme fields through the preferences adapter', async () => {
    const storage = createMemoryPreferencesStorage({
      theme: { isAuto: false, mode: 'dark' },
    });

    render(
      <ThemeModeProvider storage={storage}>
        <ThemeModeProbe />
      </ThemeModeProvider>
    );

    expect(screen.getByText('dark')).toBeTruthy();

    fireEvent.press(screen.getByText('cycle'));

    await waitFor(() => {
      expect(storage.getPreferences()).toEqual({ theme: { isAuto: false, mode: 'light' } });
    });

    fireEvent.press(screen.getByText('auto'));

    await waitFor(() => {
      expect(storage.getPreferences()).toEqual({ theme: { isAuto: true, mode: 'light' } });
    });
  });
});
