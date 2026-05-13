import type { AppPreferences, AppPreferencesStorage } from '@/state/storage/preferences-storage';

export function createPreferencesStorage(): AppPreferencesStorage {
  let preferences: AppPreferences | undefined;

  return {
    getPreferences: () => preferences,
    setPreferences: (nextPreferences) => {
      preferences = nextPreferences;
    },
  };
}
