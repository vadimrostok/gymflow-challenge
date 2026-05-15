import { AppThemePreferences } from '@/state/storage/preferences-storage';
import type { UsersStorageSource } from '@/state/users-data/users-data-provider';

export type AppPreferences = {
  theme?: AppThemePreferences;
  isSecureModeEnabled?: boolean;
  showUsersListDeleteButton?: boolean;
  usersStorageSource?: UsersStorageSource;
};
export type AppPreferencesStorage = {
  getPreferences: () => AppPreferences | undefined;
  setPreferences: (preferences: AppPreferences) => void;
};
