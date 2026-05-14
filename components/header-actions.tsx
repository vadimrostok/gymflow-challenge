import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';

import { ThemeModeButton } from '@/components/theme-mode-button';
import { Colors } from '@/constants/theme';
import { useAppNavigation } from '@/navigation/use-app-navigation';
import { useResolvedColorScheme } from '@/state/context/theme-mode';

export function HeaderActions() {
  const navigation = useAppNavigation();
  const colorScheme = useResolvedColorScheme();
  const palette = Colors[colorScheme];

  return (
    <View className="flex-row items-center gap-3">
      <Pressable
        accessibilityLabel="Settings"
        accessibilityRole="button"
        onPress={navigation.toSettings}
        className="h-9 w-9 items-center justify-center rounded-full border border-solarized-base1 bg-solarized-base2 hover:bg-[#e2dcc9] active:opacity-70 dark:border-solarized-base01 dark:bg-solarized-base02 dark:hover:bg-[#0b4350]">
        <MaterialIcons color={palette.text} name="settings" size={19} />
      </Pressable>
      <ThemeModeButton />
    </View>
  );
}
