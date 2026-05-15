import { ReactElement } from 'react';
import { Pressable, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Colors, SharedColors } from '@/constants/theme';

export type SettingsCheckboxProps = {
  testID: string;
  isEnabled: boolean;
  enabledSetStateFn: (changeFn: (currentIsEnabled: boolean) => boolean) => void;
  accessibilityLabel: string;
  label: string;
  description: string;
}

export const SettingsCheckbox = (
  {testID, isEnabled, enabledSetStateFn, accessibilityLabel, label, description}: SettingsCheckboxProps
): ReactElement => (
  <Pressable
    testID={testID}
    accessibilityLabel={accessibilityLabel}
    accessibilityRole="checkbox"
    accessibilityState={{checked: isEnabled}}
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
        <View style={styles.checkboxCheckmark}/>
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