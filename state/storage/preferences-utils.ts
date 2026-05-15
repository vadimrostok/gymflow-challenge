import type { AppPreferences } from '@/state/storage/preferences-types';
import { AppThemePreferences } from '@/state/storage/preferences-storage';
import { isUsersStorageSource } from '@/state/users-data/users-data-provider';

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
    const parsedUsersStorageSource = isUsersStorageSource(parsedValue.usersStorageSource)
      ? parsedValue.usersStorageSource
      : undefined;
    return {
      ...parsedValue,
      theme: parsedTheme,
      usersStorageSource: parsedUsersStorageSource,
    };
  } catch {
    return undefined;
  }
}
