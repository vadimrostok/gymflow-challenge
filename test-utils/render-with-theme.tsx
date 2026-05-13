import { render, type RenderOptions } from '@testing-library/react-native';
import type { PropsWithChildren, ReactElement } from 'react';

import { ThemeModeProvider } from '@/state/context/theme-mode';
import { createMemoryPreferencesStorage } from '@/state/storage/preferences-storage';

const testPreferencesStorage = createMemoryPreferencesStorage();

function TestThemeProvider({ children }: PropsWithChildren) {
  return (
    <ThemeModeProvider storage={testPreferencesStorage}>
      {children}
    </ThemeModeProvider>
  );
}

export function renderWithTheme(component: ReactElement, options?: RenderOptions) {
  return render(component, { wrapper: TestThemeProvider, ...options });
}
