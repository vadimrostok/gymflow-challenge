import { MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Pressable, View } from 'react-native';

import { ThemeModeButton } from '@/components/theme-mode-button';
import { useResolvedColorScheme } from '@/state/context/theme-mode';
import { Colors } from '@/constants/theme';

export function HeaderActions() {
  const colorScheme = useResolvedColorScheme();
  const palette = Colors[colorScheme];

  return (
    <View className="flex-row items-center gap-3">
      <Link href="/settings" asChild>
        <Pressable
          accessibilityLabel="Settings"
          accessibilityRole="button"
          className="h-9 w-9 items-center justify-center rounded-full border border-solarized-base1 bg-solarized-base2 active:opacity-70 dark:border-solarized-base01 dark:bg-solarized-base02">
          <MaterialIcons color={palette.text} name="settings" size={19} />
        </Pressable>
      </Link>
      <ThemeModeButton />
    </View>
  );
}
