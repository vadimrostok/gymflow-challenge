import { act, screen, waitFor } from '@testing-library/react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { AppState } from 'react-native';

import { AppLock } from '@/components/app-lock';
import { ThemedText } from '@/components/themed-text';
import type { AppPreferences } from '@/state/storage/preferences-types';
import { preferencesStorage } from '@/state/storage/preferences-storage';
import { renderWithTheme } from '@/test-utils/render-with-theme';

jest.mock('expo-local-authentication', () => ({
  authenticateAsync: jest.fn(),
}));

let mockPreferences: AppPreferences | undefined;

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

const authenticateAsync = LocalAuthentication.authenticateAsync as jest.Mock;

describe('AppLock', () => {
  beforeEach(() => {
    authenticateAsync.mockReset();
    mockPreferences = {};
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders children without authentication when secure mode is disabled', async () => {
    preferencesStorage.setPreferences({ isSecureModeEnabled: false });

    renderWithTheme(
      <AppLock>
        <ThemedText>Unlocked content</ThemedText>
      </AppLock>
    );

    await waitFor(() => {
      expect(screen.getByText('Unlocked content')).toBeTruthy();
    });
    expect(authenticateAsync).not.toHaveBeenCalled();
  });

  it('renders children after successful authentication when secure mode is enabled', async () => {
    preferencesStorage.setPreferences({ isSecureModeEnabled: true });
    authenticateAsync.mockResolvedValue({ success: true });

    renderWithTheme(
      <AppLock>
        <ThemedText>Private content</ThemedText>
      </AppLock>
    );

    await waitFor(() => {
      expect(screen.getByText('Private content')).toBeTruthy();
    });
    expect(authenticateAsync).toHaveBeenCalledTimes(1);
  });

  it('shows retry UI after failed authentication', async () => {
    preferencesStorage.setPreferences({ isSecureModeEnabled: true });
    authenticateAsync.mockResolvedValue({ success: false, error: 'authentication_failed' });

    renderWithTheme(
      <AppLock>
        <ThemedText>Hidden content</ThemedText>
      </AppLock>
    );

    await waitFor(() => {
      expect(screen.getByText('Nope, you are not allowed')).toBeTruthy();
    });
    expect(screen.queryByText('Hidden content')).toBeNull();
  });

  it('authenticates again after the app returns from the background', async () => {
    let appStateListener: ((state: string) => void) | undefined;
    const addEventListenerSpy = jest
      .spyOn(AppState, 'addEventListener')
      .mockImplementation((_eventName, listener) => {
        appStateListener = listener as (state: string) => void;

        return { remove: jest.fn() };
      });

    preferencesStorage.setPreferences({ isSecureModeEnabled: true });
    authenticateAsync.mockResolvedValue({ success: true });

    renderWithTheme(
      <AppLock>
        <ThemedText>Private content</ThemedText>
      </AppLock>
    );

    await waitFor(() => {
      expect(authenticateAsync).toHaveBeenCalledTimes(1);
    });

    await act(async () => {
      appStateListener?.('background');
      appStateListener?.('active');
    });

    await waitFor(() => {
      expect(authenticateAsync).toHaveBeenCalledTimes(2);
    });

    addEventListenerSpy.mockRestore();
  });
});
