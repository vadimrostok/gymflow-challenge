import type { ThemeMode } from '@/state/context/theme-mode';
import { createPreferencesStorage } from '@/state/storage/preferences-storage-platform';

export type AppThemePreferences = {
  isAuto: boolean;
  mode: ThemeMode;
};

export type AppPreferences = {
  theme?: AppThemePreferences;
};

export type AppPreferencesStorage = {
  getPreferences: () => AppPreferences | undefined;
  setPreferences: (preferences: AppPreferences) => void;
};

export const preferencesKey = 'gymflow.preferences';

function isThemePreferences(value: Partial<AppThemePreferences> | null | undefined): value is AppThemePreferences {
  return (
    value !== undefined
    && value !== null
    && typeof value.isAuto === 'boolean'
    && (value.mode === 'light' || value.mode === 'dark')
  );
}

export function parsePreferences(value: string | null): AppPreferences | undefined {
  if (!value) {
    return undefined;
  }

  try {
    const parsedValue = JSON.parse(value) as Partial<AppPreferences>;

    const parsedTheme = isThemePreferences(parsedValue.theme)
      ? parsedValue.theme
      : undefined;
    return {
      ...parsedValue,
      theme: parsedTheme,
    }
  } catch {
    return undefined;
  }
}

export function createMemoryPreferencesStorage(
  initialPreferences?: AppPreferences
): AppPreferencesStorage {
  let preferences = initialPreferences;

  return {
    getPreferences: () => preferences,
    setPreferences: (nextPreferences) => {
      preferences = nextPreferences;
    },
  };
}

export const preferencesStorage = createPreferencesStorage();