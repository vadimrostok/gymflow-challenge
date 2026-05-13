import { AppPreferencesStorage } from '@/state/storage/preferences-types';
import { parsePreferences, preferencesKey } from '@/state/storage/preferences-utils';

export function createPreferencesStorage(): AppPreferencesStorage {
  return {
    /**
     * For simplicity, we're getting and setting all preferences at once.
     */
    getPreferences() {
      return parsePreferences(globalThis.localStorage?.getItem(preferencesKey) ?? null);
    },
    setPreferences(preferences) {
      globalThis.localStorage?.setItem(preferencesKey, JSON.stringify(preferences));
    },
  };
}