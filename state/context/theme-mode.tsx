import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';

import {
  preferencesStorage,
} from '@/state/storage/preferences-storage';
import type { AppPreferences, AppPreferencesStorage } from '@/state/storage/preferences-types';

export type ThemeAutoModeOn = boolean;
export type ThemeMode = 'light' | 'dark';

type ThemeModeContextValue = {
  isAuto: ThemeAutoModeOn;
  setIsAuto: (isAuto: ThemeAutoModeOn) => void;
  resolvedColorScheme: ThemeMode;
  cycleThemeMode: () => void;
};

const themeModeCycle: ThemeMode[] = ['light', 'dark'] as const;
const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

function readStoredPreferences(storage: AppPreferencesStorage): AppPreferences | undefined {
  try {
    return storage.getPreferences();
  } catch {
    return undefined;
  }
}

type ThemeModeProviderProps = PropsWithChildren<{
  storage?: AppPreferencesStorage;
}>;

export function ThemeModeProvider({
  children,
  storage = preferencesStorage,
}: ThemeModeProviderProps) {
  const storedPreferences = useMemo(() => readStoredPreferences(storage), [storage]);
  const storedThemePreferences = storedPreferences?.theme;
  const systemColorScheme = useNativeColorScheme();
  const { setColorScheme } = useNativeWindColorScheme();
  const [isAuto, setIsAuto] = useState<ThemeAutoModeOn>(storedThemePreferences?.isAuto ?? false);
  const [mode, setMode] = useState<ThemeMode>(storedThemePreferences?.mode ?? themeModeCycle[0]);
  const resolvedColorScheme: ThemeMode = useMemo<ThemeMode>(
    (): ThemeMode => isAuto ? (systemColorScheme ?? themeModeCycle[0]) : mode,
    [isAuto, mode, systemColorScheme]
  );

  const themeContext = useMemo(
    () => ({
      isAuto,
      resolvedColorScheme,
      setIsAuto,
      cycleThemeMode: (): void => {
        setMode(
          (currentMode: ThemeMode): ThemeMode =>
            themeModeCycle[themeModeCycle.indexOf(currentMode) + 1]
            ?? themeModeCycle[0]
        )
      },
    }),
    [isAuto, resolvedColorScheme]
  );

  useEffect(() => {
    try {
      setColorScheme(resolvedColorScheme);
    } catch {
      // NativeWind's generated dark-mode flag is unavailable in the Jest renderer.
    }
  }, [resolvedColorScheme, setColorScheme]);

  useEffect(() => {
    try {
      storage.setPreferences({ theme: { isAuto, mode } });
    } catch {
      // Preferences are nice-to-have; theme switching itself should still work if storage fails.
    }
  }, [isAuto, mode, storage]);

  return <ThemeModeContext.Provider value={themeContext}>{children}</ThemeModeContext.Provider>;
}

export function useThemeMode() {
  const themeMode = useContext(ThemeModeContext);

  if (!themeMode) {
    throw new Error('useThemeMode must be used inside ThemeModeProvider.');
  }

  return themeMode;
}

export function useResolvedColorScheme(): ThemeMode {
  return useThemeMode().resolvedColorScheme;
}