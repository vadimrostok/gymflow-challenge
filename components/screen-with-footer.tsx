import { PropsWithChildren } from 'react';
import { ScrollView, View } from 'react-native';
import { AppFooter } from '@/components/app-footer';

export function ScreenWithFooter({ children, className }: PropsWithChildren & { className?: string }) {
  return (
    <ScrollView
      className={className}
      contentContainerStyle={{
        flexGrow: 1,
      }}
      keyboardShouldPersistTaps="always"
      showsVerticalScrollIndicator={false}
    >
      <View style={{ flex: 1 }}>
        {children}
      </View>
      <AppFooter />
    </ScrollView>
  );
}