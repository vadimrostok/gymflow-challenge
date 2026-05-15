import { ReactElement, useCallback, useState } from 'react';
import { Platform, View } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { LocalAuthenticationResult } from 'expo-local-authentication';

import { ThemedText } from '@/components/themed-text';
import { Colors, SharedColors } from '@/constants/theme';
import { preferencesStorage } from '@/state/storage/preferences-storage';
import { ScreenWithFooter } from '@/components/screen-with-footer';
import { AppPreferences } from '@/state/storage/preferences-types';
import { SettingsCheckbox } from '@/components/settings-checkbox';

function updatePreferences(keyValue: { [K in keyof Omit<AppPreferences, 'theme'>]: boolean }) {
  const preferences = preferencesStorage.getPreferences() ?? {};
  preferencesStorage.setPreferences({
    ...preferences,
     ...keyValue,
  });
}

export function SettingsScreen(): ReactElement {
  const preferences = preferencesStorage.getPreferences();
  const [isSecureModeEnabled, setIsSecureModeEnabled] = useState(preferences?.isSecureModeEnabled ?? false);
  const [showUsersListDeleteButton, setShowUsersListDeleteButton] =
    useState(preferences?.showUsersListDeleteButton ?? false);
  const [localAuthErrorMessage, setLocalAuthErrorMessage] = useState<string | null>(null);

  const handleShowUsersListDeleteButtonToggle = useCallback(() => {
    setShowUsersListDeleteButton((currentValue) => {
      updatePreferences({ showUsersListDeleteButton: !currentValue });
      return !currentValue;
    });
  }, []);
  const handleSecureModeToggle = useCallback(async () => {
    let isAuthorisedPreference = false;
    if (isSecureModeEnabled) {
      setIsSecureModeEnabled(false);
    } else {
      const authResult: LocalAuthenticationResult = await LocalAuthentication.authenticateAsync()
      const { success } = authResult;
      if (success) {
        setIsSecureModeEnabled(true);
        isAuthorisedPreference = true;
      } else {
        const { error } = authResult;
        setLocalAuthErrorMessage(error === 'user_cancel' ? 'Cancelled' : 'Failed to authenticate');
      }
    }

    updatePreferences({ isSecureModeEnabled: isAuthorisedPreference });
  }, [isSecureModeEnabled])

  return (
    <View className="flex-1 bg-solarized-base3 dark:bg-solarized-base03">
      <ScreenWithFooter className="w-full max-w-[860px] self-center gap-6 p-5">
        <View className="gap-2">
          <ThemedText type="title">Settings</ThemedText>
          <ThemedText lightColor={Colors.light.mutedText} darkColor={Colors.dark.mutedText}>
            Local app preferences for this challenge build.
          </ThemedText>
        </View>

        {Platform.OS !== 'web' && (
          <>
            <SettingsCheckbox
              testID="settings-secure-mode-toggle"
              isEnabled={isSecureModeEnabled}
              enabledSetStateFn={handleSecureModeToggle}
              accessibilityLabel="Secure mode"
              label="Secure mode"
              description="Toggle for the biometric/app-lock behaviour"
            />
            {localAuthErrorMessage ? (
              <View
                className="rounded-lg border border-solarized-red/40 bg-solarized-red/10 px-3 py-2">
                <ThemedText
                  lightColor={Colors.light.errorText}
                  darkColor={Colors.dark.errorText}
                  className="text-sm leading-5"
                >
                  {localAuthErrorMessage}
                </ThemedText>
              </View>
            ) : null}
          </>
        )}

        <SettingsCheckbox
          testID="users-list-delete-toggle"
          isEnabled={showUsersListDeleteButton}
          enabledSetStateFn={handleShowUsersListDeleteButtonToggle}
          accessibilityLabel="Show delete button on users list"
          label="Deletable user list items"
          description="Show delete button on users list"
        />
      </ScreenWithFooter>
    </View>
  );
}