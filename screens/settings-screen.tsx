import { ReactElement, useCallback, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { Platform, View } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { LocalAuthenticationResult } from 'expo-local-authentication';

import { ThemedText } from '@/components/themed-text';
import { Colors, SharedColors } from '@/constants/theme';
import { preferencesStorage } from '@/state/storage/preferences-storage';
import { ScreenWithFooter } from '@/components/screen-with-footer';
import { AppPreferences } from '@/state/storage/preferences-types';
import { SettingsCheckbox } from '@/components/settings-checkbox';
import { useUsersStore } from '@/state/context/users-context';
import { useResolvedColorScheme } from '@/state/context/theme-mode';
import {
  defaultUsersStorageSource,
  isUsersStorageSource,
  usersStorageSourceOptions,
  type UsersStorageSource,
} from '@/state/users-data/users-data-provider';

function updatePreferences(keyValue: Partial<Omit<AppPreferences, 'theme'>>) {
  const preferences = preferencesStorage.getPreferences() ?? {};
  preferencesStorage.setPreferences({
    ...preferences,
     ...keyValue,
  });
}

export function SettingsScreen(): ReactElement {
  const colorScheme = useResolvedColorScheme();
  const palette = Colors[colorScheme];
  const formBorderColor = colorScheme === 'dark' ? '#31565f' : SharedColors.white;
  const storageSourcePickerContainerStyle = {
    backgroundColor: palette.surface,
    borderColor: formBorderColor,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 48,
    overflow: 'hidden' as const,
    width: '100%' as const,
  };
  const storageSourcePickerStyle = {
    backgroundColor: SharedColors.transparent,
    color: palette.text,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: Platform.OS === 'web' ? 14 : 8,
    width: '100%' as const,
  };
  const usersStore = useUsersStore();
  const preferences = preferencesStorage.getPreferences();
  const [isSecureModeEnabled, setIsSecureModeEnabled] = useState(preferences?.isSecureModeEnabled ?? false);
  const [showUsersListDeleteButton, setShowUsersListDeleteButton] =
    useState(preferences?.showUsersListDeleteButton ?? false);
  const [usersStorageSource, setUsersStorageSource] = useState<UsersStorageSource>(
    preferences?.usersStorageSource ?? defaultUsersStorageSource
  );
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
  const handleUsersStorageSourceChange = useCallback((selectedValue: unknown) => {
    if (!isUsersStorageSource(selectedValue)) {
      return;
    }

    setUsersStorageSource(selectedValue);
    updatePreferences({ usersStorageSource: selectedValue });
    void usersStore.setStorageSource(selectedValue);
  }, [usersStore]);

  return (
    <View className="flex-1 bg-solarized-base3 dark:bg-solarized-base03">
      <ScreenWithFooter className="w-full max-w-[860px] self-center gap-6 p-5">
        <View className="gap-2">
          <ThemedText type="title">Settings</ThemedText>
          <ThemedText lightColor={Colors.light.mutedText} darkColor={Colors.dark.mutedText}>
            Local app preferences for this challenge build.
          </ThemedText>
        </View>

        <View className="gap-2">
          <ThemedText type="defaultSemiBold">Remote data storage source</ThemedText>
          <View style={storageSourcePickerContainerStyle}>
            <Picker
              dropdownIconColor={palette.mutedText}
              itemStyle={{ color: palette.text, fontSize: 16 }}
              mode="dropdown"
              onValueChange={handleUsersStorageSourceChange}
              selectedValue={usersStorageSource}
              selectionColor={palette.primaryButtonBackground}
              style={storageSourcePickerStyle}
              testID="users-storage-source-picker">
              {usersStorageSourceOptions.map((option) => (
                <Picker.Item
                  color={palette.text}
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
          </View>
          <ThemedText lightColor={Colors.light.mutedText} darkColor={Colors.dark.mutedText} className="text-sm leading-5">
            Choose where user profiles are saved between app launches.
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
