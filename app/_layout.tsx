import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { ThemeModeButton } from '@/components/theme-mode-button';
//import { RouteAwareBackButton } from '@/components/navigation/route-aware-back';
import { Colors } from '@/constants/theme';
import { ThemeModeProvider, useResolvedColorScheme } from '@/state/context/theme-mode';
import { StoresProvider } from '@/state/context/users-context';

export const unstable_settings = {
  // Ensure any route can link back to `/users`
  initialRouteName: 'users/index',
};

export default function RootLayout() {
  return (
    <ThemeModeProvider>
      <StoresProvider>
        <RootLayoutContent />
      </StoresProvider>
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
        <Stack.Screen
          name="users/new"
          options={{ headerBackTitle: 'Users', title: 'New User' }}
        />
        <Stack.Screen
          name="users/[id]"
          options={{ headerBackTitle: 'Users', title: 'Edit User' }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}