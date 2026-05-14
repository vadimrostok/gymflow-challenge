import { AppThemePreferences } from '@/state/storage/preferences-storage';

export type AppPreferences = {
  theme?: AppThemePreferences;
  isSecureModeEnabled?: boolean;
  showUsersListDeleteButton?: boolean;
};
export type AppPreferencesStorage = {
  getPreferences: () => AppPreferences | undefined;
  setPreferences: (preferences: AppPreferences) => void;
};