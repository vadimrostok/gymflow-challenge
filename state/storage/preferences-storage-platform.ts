import type { AppPreferences, AppPreferencesStorage } from '@/state/storage/preferences-types';

export function createPreferencesStorage(): AppPreferencesStorage {
  let preferences: AppPreferences | undefined;

  return {
    getPreferences: () => preferences,
    setPreferences: (nextPreferences) => {
      preferences = nextPreferences;
    },
  };
}