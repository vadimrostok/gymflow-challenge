import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, Text, View } from 'react-native';

import { HeaderActions } from '@/components/header-actions';
import { FontFamily } from '@/constants/fonts';
import { Colors } from '@/constants/theme';
import { useAppNavigation } from '@/navigation/use-app-navigation';
import { useResolvedColorScheme } from '@/state/context/theme-mode';

type AppHeaderProps = {
  canGoBack?: boolean;
  title: string;
};

export function AppHeader({ canGoBack = false, title }: AppHeaderProps) {
  const navigation = useAppNavigation();
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
    <View
      className="min-h-[64px] flex-row items-center justify-between bg-solarized-base3 dark:bg-solarized-base03"
      style={[styles.headerContainer, webColorTransition]}>
      <View className="min-w-0 flex-row items-center">
        {canGoBack ? (
          <Pressable
            accessibilityLabel="Back"
            accessibilityRole="button"
            onPress={navigation.back}
            style={styles.headerLeftButton}>
            <MaterialIcons color={palette.text} name="arrow-back" size={28} />
          </Pressable>
        ) : null}
        <Text
          style={[
            styles.headerTitle,
            { color: palette.text, marginLeft: canGoBack ? 0 : 32 },
            webColorTransition,
          ]}>
          {title}
        </Text>
      </View>
      <View style={styles.headerRight}>
        <HeaderActions />
      </View>
    </View>
  );
}

export const headerStyles = {
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
  headerContainer: {
    position: Platform.OS === 'web' ? ('sticky' as const) : ('relative' as const),
    top: 0,
    zIndex: 10,
  },
  headerTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    fontWeight: '700' as const,
    marginLeft: 16,
  },
};

const styles = headerStyles;
