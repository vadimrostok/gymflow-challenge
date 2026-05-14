import { useFonts } from 'expo-font';
import type { PropsWithChildren } from 'react';

import { fontAssets } from '@/constants/fonts';
import { ThemeModeProvider } from '@/state/context/theme-mode';
import { StoresProvider } from '@/state/context/users-context';

export function AppProviders({ children }: PropsWithChildren) {
  const [areFontsLoaded] = useFonts(fontAssets);

  if (!areFontsLoaded) {
    return null;
  }

  return (
    <ThemeModeProvider>
      <StoresProvider>{children}</StoresProvider>
    </ThemeModeProvider>
  );
}
