import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

export function AppFooter() {
  const year = new Date().getFullYear();

  return (
    <View
      className="w-full px-5 pb-5"
      style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: 860 }}>
      <View className="h-px w-full bg-solarized-base2 dark:bg-solarized-base02" />
      <ThemedText
        lightColor="#586e75"
        darkColor="#93a1a1"
        className="pt-3 text-center text-sm leading-5">
        {year}
      </ThemedText>
    </View>
  );
}
