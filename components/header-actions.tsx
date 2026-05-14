import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';

import { ThemeModeButton } from '@/components/theme-mode-button';
import { Colors } from '@/constants/theme';
import { useAppNavigation } from '@/navigation/use-app-navigation';
import { useResolvedColorScheme } from '@/state/context/theme-mode';

type HeaderActionsProps = {
  hideSettings?: boolean;
};

export function HeaderActions({ hideSettings = false }: HeaderActionsProps) {
  const navigation = useAppNavigation();
  const colorScheme = useResolvedColorScheme();
  const palette = Colors[colorScheme];

  return (
    <View className="flex-row items-center gap-3">
      {hideSettings ? null : (
        <Pressable
          testID="settings-button"
          accessibilityLabel="Settings"
          accessibilityRole="button"
          onPress={navigation.toSettings}
          className="h-9 w-9 items-center justify-center rounded-full border border-solarized-base1 bg-solarized-base2 hover:bg-gymflow-mutedHover active:opacity-70 dark:border-solarized-base01 dark:bg-solarized-base02 dark:hover:bg-gymflow-mutedHoverDark"
        >
          <MaterialIcons color={palette.text} name="settings" size={19} />
        </Pressable>
      )}
      <ThemeModeButton />
    </View>
  );
}
