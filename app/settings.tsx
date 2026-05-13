import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

export default function SettingsScreen() {
  const [isSecureModeEnabled, setIsSecureModeEnabled] = useState(false);

  return (
    <View className="flex-1 bg-solarized-base3 dark:bg-solarized-base03">
      <View className="w-full max-w-[860px] self-center gap-6 p-5">
        <View className="gap-2">
          <ThemedText type="title">Settings</ThemedText>
          <ThemedText lightColor="#586e75" darkColor="#93a1a1">
            Local app preferences for this challenge build.
          </ThemedText>
        </View>

        <Pressable
          accessibilityLabel="Secure mode"
          accessibilityRole="checkbox"
          accessibilityState={{ checked: isSecureModeEnabled }}
          onPress={() => setIsSecureModeEnabled((currentValue) => !currentValue)}
          className="flex-row items-center gap-3 rounded-lg border border-white bg-solarized-base2 p-4 active:opacity-75 dark:bg-solarized-base02">
          <View
            className={
              isSecureModeEnabled
                ? 'h-5 w-5 items-center justify-center rounded border border-gymflow-primary bg-gymflow-primary dark:border-gymflow-primaryDark dark:bg-gymflow-primaryDark'
                : 'h-5 w-5 rounded border border-solarized-base1 bg-solarized-base3 dark:border-solarized-base01 dark:bg-solarized-base03'
            }>
            {isSecureModeEnabled ? (
              <ThemedText lightColor="#ffffff" darkColor="#002b36" className="text-sm leading-4">
                ✓
              </ThemedText>
            ) : null}
          </View>
          <View className="flex-1 gap-1">
            <ThemedText type="defaultSemiBold">Secure mode</ThemedText>
            <ThemedText lightColor="#586e75" darkColor="#93a1a1" className="text-sm leading-5">
              Placeholder toggle for the biometric/app-lock iteration.
            </ThemedText>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
