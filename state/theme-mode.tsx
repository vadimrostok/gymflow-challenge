import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type ResolvedColorScheme = 'light' | 'dark';

type ThemeModeContextValue = {
  mode: ThemeMode;
  resolvedColorScheme: ResolvedColorScheme;
  cycleThemeMode: () => void;
};

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

const themeModeCycle: ThemeMode[] = ['auto', 'light', 'dark'];

export function ThemeModeProvider({ children }: PropsWithChildren) {
  const systemColorScheme = useNativeColorScheme();
  const [mode, setMode] = useState<ThemeMode>('auto');

  const resolvedColorScheme: ResolvedColorScheme =
    mode === 'auto' ? systemColorScheme ?? 'light' : mode;

  const value = useMemo(
    () => ({
      mode,
      resolvedColorScheme,
      cycleThemeMode: () => {
        setMode((currentMode) => {
          const currentModeIndex = themeModeCycle.indexOf(currentMode);
          return themeModeCycle[(currentModeIndex + 1) % themeModeCycle.length];
        });
      },
    }),
    [mode, resolvedColorScheme]
  );

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
}

export function useThemeMode() {
  const themeMode = useContext(ThemeModeContext);

  if (!themeMode) {
    throw new Error('useThemeMode must be used inside ThemeModeProvider.');
  }

  return themeMode;
}

export function useResolvedColorScheme() {
  return useThemeMode().resolvedColorScheme;
}

