import type { ThemeMode } from '@/state/context/theme-mode';
import { createPreferencesStorage } from '@/state/storage/preferences-storage-platform';
import type { AppPreferences, AppPreferencesStorage } from '@/state/storage/preferences-types';

export type AppThemePreferences = {
  isAuto: boolean;
  mode: ThemeMode;
};

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