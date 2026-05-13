import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import 'react-native-reanimated';
import '../global.css';

import { HeaderActions } from '@/components/header-actions';
//import { RouteAwareBackButton } from '@/components/navigation/route-aware-back';
import { FontFamily, fontAssets } from '@/constants/fonts';
import { Colors } from '@/constants/theme';
import { ThemeModeProvider, useResolvedColorScheme } from '@/state/context/theme-mode';
import { StoresProvider } from '@/state/context/users-context';

export const unstable_settings = {
  // Ensure any route can link back to `/users`
  initialRouteName: 'users/index',
};

export default function RootLayout() {
  const [areFontsLoaded] = useFonts(fontAssets);

  if (!areFontsLoaded) {
    return null;
  }

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
          headerRight: () => (
            <View style={styles.headerRight}>
              <HeaderActions />
            </View>
          ),
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
        <Stack.Screen name="settings" options={{ headerBackTitle: 'Users', title: 'Settings' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = {
  headerRight: {
    paddingRight: 16,
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    fontWeight: '700' as const,
  },
};
