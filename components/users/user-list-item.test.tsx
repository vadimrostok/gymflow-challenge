import { fireEvent, screen } from '@testing-library/react-native';

import { UserListItem } from '@/components/users/user-list-item';
import type { User } from '@/state/schemas/user-schema';
import { renderWithTheme } from '@/test-utils/render-with-theme';

const mockToEditUser = jest.fn();

jest.mock('@/navigation/use-app-navigation', () => ({
  useAppNavigation: () => ({
    back: jest.fn(),
    canGoBack: jest.fn(),
    toEditUser: mockToEditUser,
    toNewUser: jest.fn(),
    toSettings: jest.fn(),
    toUsers: jest.fn(),
  }),
}));

const user: User = {
  id: 'user-123',
  createdAt: '2026-05-14T00:00:00.000Z',
  updatedAt: '2026-05-14T00:00:00.000Z',
  fullName: 'Ada Lovelace',
  role: 'STAFF',
  dateOfBirth: '1815-12-10',
};

describe('UserListItem', () => {
  beforeEach(() => {
    mockToEditUser.mockClear();
  });

  it('opens the user edit route when the row is pressed', () => {
    renderWithTheme(
      <UserListItem
        onDelete={jest.fn()}
        showDeleteButton={false}
        user={user}
      />
    );

    fireEvent.press(screen.getByTestId('user-list-row-user-123'));

    expect(mockToEditUser).toHaveBeenCalledWith('user-123');
  });
});
