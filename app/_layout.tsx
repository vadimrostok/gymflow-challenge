import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';

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
          headerLeftContainerStyle: styles.headerLeft,
          headerRight: () => <ThemeModeButton />,
          headerRightContainerStyle: styles.headerRight,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: palette.background },
          headerTitleStyle: styles.headerTitle,
          headerTintColor: palette.text,
        }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="users/index" options={{ title: 'Home' }} />
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

const styles = {
  headerLeft: {
    paddingLeft: 24,
  },
  headerRight: {
    paddingRight: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
};
