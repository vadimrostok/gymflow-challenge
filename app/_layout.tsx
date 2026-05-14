import { MaterialIcons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, Text, View } from 'react-native';
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
  const router = useRouter();
  const colorScheme = useResolvedColorScheme();
  const palette = Colors[colorScheme];
  const webColorTransition =
    Platform.OS === 'web'
      ? {
          transitionDuration: '500ms',
          transitionProperty: 'background-color, border-color, color',
          transitionTimingFunction: 'ease',
        }
      : {};

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: palette.background, ...webColorTransition },
          headerLeft: ({ canGoBack }) =>
            canGoBack ? (
              <Pressable
                accessibilityLabel="Back"
                accessibilityRole="button"
                onPress={() => router.back()}
                style={styles.headerLeftButton}>
                <MaterialIcons color={palette.text} name="arrow-back" size={28} />
              </Pressable>
            ) : null,
          headerRight: () => (
            <View style={styles.headerRight}>
              <HeaderActions />
            </View>
          ),
          headerShadowVisible: false,
          headerStyle: { backgroundColor: palette.background, ...webColorTransition },
          headerTitle: ({ children, tintColor }) => (
            <Text style={[styles.headerTitle, { color: tintColor ?? palette.text }, webColorTransition]}>
              {children}
            </Text>
          ),
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
  headerLeftButton: {
    marginLeft: 16,
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  headerRight: {
    paddingRight: 32,
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    fontWeight: '700' as const,
    marginLeft: 16,
  },
};
