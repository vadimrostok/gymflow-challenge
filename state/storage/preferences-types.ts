import { AppThemePreferences } from '@/state/storage/preferences-storage';

export type AppPreferences = {
  theme?: AppThemePreferences;
};
export type AppPreferencesStorage = {
  getPreferences: () => AppPreferences | undefined;
  setPreferences: (preferences: AppPreferences) => void;
};