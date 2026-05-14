import { ReactElement, useEffect, useState } from 'react';
import { Platform, Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeMode } from '@/state/context/theme-mode';
import { preferencesStorage } from '@/state/storage/preferences-storage';

type SettingsCheckboxProps = {
  isEnabled: boolean;
  enabledSetStateFn: (changeFn: (currentIsEnabled: boolean) => boolean) => void;
  accessibilityLabel: string;
  title: string;
  description: string;
}
const SettingsCheckbox = (
  { isEnabled, enabledSetStateFn, accessibilityLabel, title, description } : SettingsCheckboxProps
): ReactElement => (
  <Pressable
    accessibilityLabel={accessibilityLabel}
    accessibilityRole="checkbox"
    accessibilityState={{ checked: isEnabled }}
    onPress={() => enabledSetStateFn((currentValue) => !currentValue)}
    className="flex-row items-center gap-3 rounded-lg border border-white bg-solarized-base2 p-4 active:opacity-75 dark:bg-solarized-base02"
  >
    <View
      className={
        isEnabled
          ? 'h-5 w-5 items-center justify-center rounded border border-gymflow-primary bg-gymflow-primary dark:border-gymflow-primaryDark dark:bg-gymflow-primaryDark'
          : 'h-5 w-5 rounded border border-solarized-base1 bg-solarized-base3 dark:border-solarized-base01 dark:bg-solarized-base03'
      }>
      {isEnabled ? (
        <ThemedText lightColor="#ffffff" darkColor="#002b36" className="text-sm leading-4">
          ✓
        </ThemedText>
      ) : null}
    </View>
    <View className="flex-1 gap-1">
      <ThemedText type="defaultSemiBold">{<title></title>}</ThemedText>
      <ThemedText lightColor="#586e75" darkColor="#93a1a1" className="text-sm leading-5">
        {description}
      </ThemedText>
    </View>
  </Pressable>
);

export function SettingsScreen(): ReactElement {
  const preferences = preferencesStorage.getPreferences();
  const [isSecureModeEnabled, setIsSecureModeEnabled] = useState(preferences?.isSecureModeEnabled ?? false);
  const [showUsersListDeleteButton, setShowUsersListDeleteButton] =
    useState(preferences?.showUsersListDeleteButton ?? false);

  useEffect((): void => {
    const preferences = preferencesStorage.getPreferences();
    if (!preferences) {
      return;
    }
    if (
      isSecureModeEnabled !== preferences.isSecureModeEnabled
      || showUsersListDeleteButton !== preferences.showUsersListDeleteButton
    ) {
      preferencesStorage.setPreferences({
        ...preferences,
        isSecureModeEnabled,
        showUsersListDeleteButton,
      });
    }
  }, [isSecureModeEnabled, showUsersListDeleteButton])

  return (
    <View className="flex-1 bg-solarized-base3 dark:bg-solarized-base03">
      <View className="w-full max-w-[860px] self-center gap-6 p-5">
        <View className="gap-2">
          <ThemedText type="title">Settings</ThemedText>
          <ThemedText lightColor="#586e75" darkColor="#93a1a1">
            Local app preferences for this challenge build.
          </ThemedText>
        </View>

        {Platform.OS !== 'web' && <SettingsCheckbox
          isEnabled={isSecureModeEnabled}
          enabledSetStateFn={setIsSecureModeEnabled}
          accessibilityLabel="Secure mode"
          title="Secure mode"
          description="Toggle for the biometric/app-lock behaviour"
        />}

        <SettingsCheckbox
          isEnabled={showUsersListDeleteButton}
          enabledSetStateFn={setShowUsersListDeleteButton}
          accessibilityLabel="Show delete button on users list"
          title="Secure mode"
          description="Show delete button on users list"
        />
      </View>
    </View>
  );
}