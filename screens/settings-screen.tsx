import { ReactElement, useEffect, useState } from 'react';
import { Platform, Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, SharedColors } from '@/constants/theme';
import { useThemeMode } from '@/state/context/theme-mode';
import { preferencesStorage } from '@/state/storage/preferences-storage';
import { ScreenWithFooter } from '@/components/screen-with-footer';

type SettingsCheckboxProps = {
  testID: string;
  isEnabled: boolean;
  enabledSetStateFn: (changeFn: (currentIsEnabled: boolean) => boolean) => void;
  accessibilityLabel: string;
  label: string;
  description: string;
}
const SettingsCheckbox = (
  { testID, isEnabled, enabledSetStateFn, accessibilityLabel, label, description } : SettingsCheckboxProps
): ReactElement => (
  <Pressable
    testID={testID}
    accessibilityLabel={accessibilityLabel}
    accessibilityRole="checkbox"
    accessibilityState={{ checked: isEnabled }}
    onPress={() => enabledSetStateFn((currentValue) => !currentValue)}
    className="flex-row items-start gap-3 rounded-lg border border-white bg-solarized-base2 p-4 active:opacity-75 dark:bg-solarized-base02"
  >
    <View
      className={
        isEnabled
          ? 'mt-0.5 h-5 w-5 items-center justify-center rounded border border-gymflow-primary bg-gymflow-primary dark:border-gymflow-primaryDark dark:bg-gymflow-primaryDark'
          : 'mt-0.5 h-5 w-5 rounded border border-solarized-base1 bg-solarized-base3 dark:border-solarized-base01 dark:bg-solarized-base03'
      }>
      {isEnabled ? (
        <View style={styles.checkboxCheckmark} />
      ) : null}
    </View>
    <View className="flex-1 gap-1">
      <ThemedText type="defaultSemiBold">{label}</ThemedText>
      <ThemedText
        lightColor={Colors.light.mutedText}
        darkColor={Colors.dark.mutedText}
        className="text-sm leading-5">
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
    const preferences = preferencesStorage.getPreferences() ?? {};
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
      <ScreenWithFooter className="w-full max-w-[860px] self-center gap-6 p-5">
        <View className="gap-2">
          <ThemedText type="title">Settings</ThemedText>
          <ThemedText lightColor={Colors.light.mutedText} darkColor={Colors.dark.mutedText}>
            Local app preferences for this challenge build.
          </ThemedText>
        </View>

        {/* // to bo done in future, maybe: */}
        {/*{Platform.OS !== 'web' && <SettingsCheckbox
          testID="settings-secure-mode-toggle"
          isEnabled={isSecureModeEnabled}
          enabledSetStateFn={setIsSecureModeEnabled}
          accessibilityLabel="Secure mode"
          label="Secure mode"
          description="Toggle for the biometric/app-lock behaviour"
        />}*/}

        <SettingsCheckbox
          testID="users-list-delete-toggle"
          isEnabled={showUsersListDeleteButton}
          enabledSetStateFn={setShowUsersListDeleteButton}
          accessibilityLabel="Show delete button on users list"
          label="Deletable user list items"
          description="Show delete button on users list"
        />
      </ScreenWithFooter>
    </View>
  );
}

const styles = {
  checkboxCheckmark: {
    borderBottomColor: SharedColors.white,
    borderBottomWidth: 3,
    borderRightColor: SharedColors.white,
    borderRightWidth: 3,
    height: 12,
    marginTop: -2,
    transform: [{ rotate: '45deg' }],
    width: 7,
  },
};