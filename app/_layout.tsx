import { MaterialIcons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, Text, View } from 'react-native';
import 'react-native-reanimated';
import '../global.css';

import { AppFooter } from '@/components/app-footer';
import { HeaderActions } from '@/components/header-actions';
import { AppProviders } from '@/components/app-providers';
import { FontFamily } from '@/constants/fonts';
import { Colors } from '@/constants/theme';
import { useResolvedColorScheme } from '@/state/context/theme-mode';

export const unstable_settings = {
  initialRouteName: 'users/index',
};

export default function RootLayout() {
  return (
    <AppProviders>
      <RootLayoutContent />
    </AppProviders>
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
      <View style={{ backgroundColor: palette.background, flex: 1, ...webColorTransition }}>
        <View style={{ flexGrow: 1, flexShrink: 0 }}>
          <Stack
            screenOptions={{
              contentStyle: { backgroundColor: palette.background, ...webColorTransition },
              headerLeft: ({ canGoBack }) =>
                canGoBack ? (
                  <Pressable
                    accessibilityLabel="Back"
                    accessibilityRole="button"
                    onPress={() => router.back()}
                    style={({ pressed }) => [
                      styles.headerLeftButton,
                      { opacity: pressed ? 0.7 : 1 },
                    ]}>
                    <MaterialIcons style={{ marginLeft: 4 }} color={palette.text} name="arrow-back" size={28} />
                  </Pressable>
                ) : null,
              headerRight: () => (
                <View style={styles.headerRight}>
                  <HeaderActions />
                </View>
              ),
              headerShadowVisible: false,
              headerStyle: {
                backgroundColor: palette.background,
                ...webColorTransition,
              },
              headerTitle: ({ children, tintColor }) => (
                <Text
                  style={[
                    styles.headerTitle,
                    { color: tintColor ?? palette.text },
                    webColorTransition
                  ]}>
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
            <Stack.Screen
              name="settings"
              options={{
                headerBackTitle: 'Users',
                headerRight: () => (
                  <View style={styles.headerRight}>
                    <HeaderActions hideSettings />
                  </View>
                ),
                title: 'Settings',
              }}
            />
          </Stack>
        </View>
        <AppFooter />
      </View>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = {
  headerLeftButton: {
    backgroundColor: 'transparent',
    height: 44,
    marginLeft: 8,
    width: 44,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  headerRight: {
    paddingRight: 0,
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    fontWeight: '700' as const,
    marginLeft: 0,
  },
};