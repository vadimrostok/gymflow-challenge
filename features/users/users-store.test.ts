import { createUsersStore } from '@/features/users/users-store';

describe('UsersStore', () => {
  it('creates, updates, and deletes users', () => {
    const usersStore = createUsersStore();
    const createdUser = usersStore.createUser({
      fullName: 'Margaret Hamilton',
      role: 'STAFF',
      dateOfBirth: '1936-08-17',
    });

    expect(usersStore.findUser(createdUser.id)?.fullName).toBe('Margaret Hamilton');

    usersStore.updateUser(createdUser.id, {
      fullName: 'Margaret H.',
      role: 'MEMBER',
      dateOfBirth: '',
    });

    expect(usersStore.findUser(createdUser.id)).toMatchObject({
      fullName: 'Margaret H.',
      role: 'MEMBER',
    });

    usersStore.deleteUser(createdUser.id);

    expect(usersStore.findUser(createdUser.id)).toBeUndefined();
  });
});

