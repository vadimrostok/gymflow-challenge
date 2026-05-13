import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';

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

export function ThemeModeProvider({ children }: PropsWithChildren) {
  const systemColorScheme = useNativeColorScheme();
  const [isAuto, setIsAuto] = useState<ThemeAutoModeOn>(false);
  const [mode, setMode] = useState<ThemeMode>(themeModeCycle[0]);
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
