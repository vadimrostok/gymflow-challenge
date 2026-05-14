import { screen } from '@testing-library/react-native';
import { Image, Text } from 'react-native';

import { UserFormPageShell } from '@/components/users/user-form-page-shell.native';
import { renderWithTheme } from '@/test-utils/render-with-theme';

jest.mock('@/constants/paintings', () => ({
  getNextPainting: () => ({
    height: 200,
    uri: 'http://localhost:8081/assets/paintings/test.jpg',
    width: 100,
  }),
}));

describe('UserFormPageShell native', () => {
  beforeEach(() => {
    jest.spyOn(Image, 'getSize').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('keeps decorative parallax image layers out of native hit testing', () => {
    renderWithTheme(
      <UserFormPageShell motionKey="test-shell" title="Edit User">
        <Text>Form body</Text>
      </UserFormPageShell>
    );

    expect(screen.getByTestId('parallax-image-hitbox').props.pointerEvents).toBe('none');
    expect(screen.getByTestId('parallax-image-layer').props.pointerEvents).toBe('none');
    expect(screen.getByTestId('parallax-image-overlay').props.pointerEvents).toBe('none');
  });
});
