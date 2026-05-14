import { fireEvent, render, screen } from '@testing-library/react-native';

import { ThemeModeButton } from '@/components/theme-mode-button';
import { ThemeModeProvider } from '@/state/context/theme-mode';
import { createMemoryPreferencesStorage } from '@/state/storage/preferences-storage';

describe('ThemeModeButton', () => {
  it('previews the opposite theme icon on hover without applying the theme', () => {
    const storage = createMemoryPreferencesStorage({
      theme: { isAuto: false, mode: 'light' },
    });

    render(
      <ThemeModeProvider storage={storage}>
        <ThemeModeButton />
      </ThemeModeProvider>
    );

    const themeButton = screen.getByLabelText('Light theme');

    expect(screen.getByText('☀️')).toBeTruthy();

    fireEvent(themeButton, 'onHoverIn');

    expect(screen.getByText('🌙')).toBeTruthy();
    expect(storage.getPreferences()).toEqual({ theme: { isAuto: false, mode: 'light' } });

    fireEvent(themeButton, 'onHoverOut');

    expect(screen.getByText('☀️')).toBeTruthy();
  });
});
