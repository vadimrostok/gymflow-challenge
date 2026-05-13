import { render, type RenderOptions } from '@testing-library/react-native';
import type { PropsWithChildren, ReactElement } from 'react';

import { ThemeModeProvider } from '@/state/context/theme-mode';

function TestThemeProvider({ children }: PropsWithChildren) {
  return <ThemeModeProvider>{children}</ThemeModeProvider>;
}

export function renderWithTheme(component: ReactElement, options?: RenderOptions) {
  return render(component, { wrapper: TestThemeProvider, ...options });
}