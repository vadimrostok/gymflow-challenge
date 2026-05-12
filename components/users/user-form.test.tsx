import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import { UserForm } from '@/components/users/user-form';
import { renderWithTheme } from '@/test-utils/render-with-theme';

describe('UserForm', () => {
  it('submits valid create values', async () => {
    const onSubmit = jest.fn();

    renderWithTheme(
      <UserForm mode="create" onCancel={jest.fn()} onSubmit={onSubmit} />
    );

    fireEvent.changeText(screen.getByLabelText('Full Name'), 'Maya Angelou');
    fireEvent.press(screen.getByLabelText('Staff'));
    fireEvent.changeText(screen.getByLabelText('Date of Birthday'), '1928-04-04');
    fireEvent.press(screen.getByText('Create User'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        {
          fullName: 'Maya Angelou',
          role: 'STAFF',
          dateOfBirth: '1928-04-04',
        },
        undefined
      );
    });
  });

  it('shows validation errors and only renders Remove User in edit mode', async () => {
    renderWithTheme(<UserForm mode="create" onCancel={jest.fn()} onSubmit={jest.fn()} />);

    expect(screen.queryByText('Remove User')).toBeNull();

    fireEvent.press(screen.getByText('Create User'));

    expect(await screen.findByText('Full name must be at least 3 characters.')).toBeTruthy();
  });

  it('renders form-level removal for existing users', () => {
    renderWithTheme(
      <UserForm
        initialUser={{
          id: 'user-1',
          fullName: 'Existing User',
          role: 'MEMBER',
          dateOfBirth: '',
          updatedAt: '2026-05-13T00:00:00.000Z',
        }}
        mode="edit"
        onCancel={jest.fn()}
        onDelete={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    expect(screen.getByText('Remove User')).toBeTruthy();
  });
});
