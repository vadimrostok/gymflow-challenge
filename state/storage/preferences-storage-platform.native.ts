import { SQLiteStorage } from 'expo-sqlite/kv-store';

import { AppPreferencesStorage } from '@/state/storage/preferences-types';
import { parsePreferences, preferencesKey } from '@/state/storage/preferences-utils';

const sqlitePreferencesStorage = new SQLiteStorage('gymflow-preferences.db');

export function createPreferencesStorage(): AppPreferencesStorage {
  return {
    /**
     * For simplicity, we're getting and setting all preferences at once.
     */
    getPreferences() {
      return parsePreferences(sqlitePreferencesStorage.getItemSync(preferencesKey));
    },
    setPreferences(preferences) {
      sqlitePreferencesStorage.setItemSync(preferencesKey, JSON.stringify(preferences));
    },
  };
}