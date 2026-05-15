import { fireEvent, screen, waitFor } from '@testing-library/react-native';
import { Platform } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

import type { AppPreferences } from '@/state/storage/preferences-types';
import { SettingsScreen } from '@/screens/settings-screen';
import { preferencesStorage } from '@/state/storage/preferences-storage';
import { renderWithTheme } from '@/test-utils/render-with-theme';

jest.mock('expo-local-authentication', () => ({
  authenticateAsync: jest.fn(),
}));

let mockPreferences: AppPreferences | undefined;
const mockSetStorageSource = jest.fn();

jest.mock('@/state/storage/preferences-storage', () => ({
  createMemoryPreferencesStorage: (initialPreferences?: AppPreferences) => {
    let preferences = initialPreferences;

    return {
      getPreferences: () => preferences,
      setPreferences: (nextPreferences: AppPreferences) => {
        preferences = nextPreferences;
      },
    };
  },
  preferencesStorage: {
    getPreferences: () => mockPreferences,
    setPreferences: (nextPreferences: AppPreferences) => {
      mockPreferences = nextPreferences;
    },
  },
}));

jest.mock('@/state/context/users-context', () => ({
  useUsersStore: () => ({
    setStorageSource: mockSetStorageSource,
  }),
}));

const authenticateAsync = LocalAuthentication.authenticateAsync as jest.Mock;

describe('SettingsScreen', () => {
  const originalPlatformOS = Platform.OS;

  beforeEach(() => {
    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      value: 'ios',
    });
    authenticateAsync.mockReset();
    mockSetStorageSource.mockReset();
    mockPreferences = {};
  });

  afterAll(() => {
    Object.defineProperty(Platform, 'OS', {
      configurable: true,
      value: originalPlatformOS,
    });
  });

  it('persists the user-list delete preference without losing theme preferences', () => {
    preferencesStorage.setPreferences({
      theme: { isAuto: true, mode: 'dark' },
      showUsersListDeleteButton: false,
    });

    renderWithTheme(<SettingsScreen />);

    fireEvent.press(screen.getByTestId('users-list-delete-toggle'));

    expect(preferencesStorage.getPreferences()).toEqual({
      theme: { isAuto: true, mode: 'dark' },
      showUsersListDeleteButton: true,
    });
  });

  it('enables secure mode only after successful local authentication', async () => {
    preferencesStorage.setPreferences({
      theme: { isAuto: false, mode: 'light' },
      isSecureModeEnabled: false,
    });
    authenticateAsync.mockResolvedValue({ success: true });

    renderWithTheme(<SettingsScreen />);

    fireEvent.press(screen.getByTestId('settings-secure-mode-toggle'));

    await waitFor(() => {
      expect(preferencesStorage.getPreferences()).toEqual({
        theme: { isAuto: false, mode: 'light' },
        isSecureModeEnabled: true,
      });
    });
  });

  it('keeps secure mode disabled and shows a message when local authentication is cancelled', async () => {
    authenticateAsync.mockResolvedValue({ success: false, error: 'user_cancel' });

    renderWithTheme(<SettingsScreen />);

    fireEvent.press(screen.getByTestId('settings-secure-mode-toggle'));

    await waitFor(() => {
      expect(screen.getByText('Cancelled')).toBeTruthy();
      expect(preferencesStorage.getPreferences()).toEqual({ isSecureModeEnabled: false });
    });
  });

  it('persists the selected users storage source and asks the store to switch providers', async () => {
    preferencesStorage.setPreferences({
      theme: { isAuto: false, mode: 'dark' },
      usersStorageSource: 'supabase',
    });

    renderWithTheme(<SettingsScreen />);

    fireEvent(screen.getByTestId('users-storage-source-picker'), 'onValueChange', 'sqlite');

    await waitFor(() => {
      expect(preferencesStorage.getPreferences()).toEqual({
        theme: { isAuto: false, mode: 'dark' },
        usersStorageSource: 'sqlite',
      });
      expect(mockSetStorageSource).toHaveBeenCalledWith('sqlite');
    });
  });
});
