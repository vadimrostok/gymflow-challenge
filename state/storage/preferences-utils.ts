import type { AppPreferences } from '@/state/storage/preferences-types';
import { AppThemePreferences } from '@/state/storage/preferences-storage';

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
    };
  } catch {
    return undefined;
  }
}