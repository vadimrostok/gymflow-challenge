import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { ThemeModeButton } from '@/components/theme-mode-button';
import { Colors } from '@/constants/theme';
import { ThemeModeProvider, useResolvedColorScheme } from '@/state/theme-mode';
import { UsersStoreProvider } from '@/state/users-context';

export default function RootLayout() {
  return (
    <ThemeModeProvider>
      <UsersStoreProvider>
        <RootLayoutContent />
      </UsersStoreProvider>
    </ThemeModeProvider>
  );
}

function RootLayoutContent() {
  const colorScheme = useResolvedColorScheme();
  const palette = Colors[colorScheme];

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: palette.background },
          headerRight: () => <ThemeModeButton />,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: palette.background },
          headerTintColor: palette.text,
        }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="users/index" options={{ title: 'Users' }} />
        <Stack.Screen name="users/new" options={{ title: 'New User' }} />
        <Stack.Screen name="users/[id]" options={{ title: 'Edit User' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
