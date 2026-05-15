import { createUsersStore } from '@/state/stores/users-store';
import type { User } from '@/state/schemas/user-schema';
import type { UsersDataProvider, UsersStorageSource } from '@/state/users-data/users-data-provider';

const serverUser: User = {
  id: '1',
  createdAt: '2026-05-14T09:00:00.000Z',
  updatedAt: '2026-05-14T09:30:00.000Z',
  fullName: 'Ada Lovelace',
  role: 'STAFF',
  dateOfBirth: '1815-12-10',
};

const sqliteUser: User = {
  id: 'sqlite-1',
  createdAt: '2026-05-14T10:00:00.000Z',
  updatedAt: '2026-05-14T10:30:00.000Z',
  fullName: 'Local User',
  role: 'MEMBER',
  dateOfBirth: '',
};

const flushPromises = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

function createProviderMock({
  createUser,
  deleteUser,
  loadUsers = [],
  updateUser,
}: {
  createUser?: UsersDataProvider['createUser'];
  deleteUser?: UsersDataProvider['deleteUser'];
  loadUsers?: User[];
  updateUser?: UsersDataProvider['updateUser'];
} = {}) {
  return {
    createUser: jest.fn(createUser ?? (async (user) => user)),
    deleteUser: jest.fn(deleteUser ?? (async () => undefined)),
    loadUsers: jest.fn(async () => loadUsers),
    updateUser: jest.fn(updateUser ?? (async (user) => user)),
  } satisfies UsersDataProvider;
}

function createProviders(overrides: Partial<Record<UsersStorageSource, UsersDataProvider>> = {}) {
  return {
    sqlite: overrides.sqlite ?? createProviderMock(),
    supabase: overrides.supabase ?? createProviderMock(),
  };
}

function createDeferred<T>() {
  let resolve: (value: T) => void = () => undefined;
  const promise = new Promise<T>((promiseResolve) => {
    resolve = promiseResolve;
  });

  return { promise, resolve };
}

describe('UsersStore', () => {
  it('creates, updates, and deletes users through the active provider', async () => {
    const provider = createProviderMock();
    const usersStore = createUsersStore({ providers: createProviders({ supabase: provider }) });

    await flushPromises();

    const createdUser = await usersStore.createUser({
      fullName: 'Margaret Hamilton',
      role: 'STAFF',
      dateOfBirth: '1936-08-17',
    });

    expect(provider.createUser).toHaveBeenCalledWith(expect.objectContaining({ fullName: 'Margaret Hamilton' }));
    expect(usersStore.findUser(createdUser.id)?.fullName).toBe('Margaret Hamilton');

    await usersStore.updateUser(createdUser.id, {
      fullName: 'Margaret H.',
      role: 'MEMBER',
      dateOfBirth: '',
    });

    expect(provider.updateUser).toHaveBeenCalledWith(expect.objectContaining({ fullName: 'Margaret H.' }));
    expect(usersStore.findUser(createdUser.id)).toMatchObject({
      fullName: 'Margaret H.',
      role: 'MEMBER',
    });

    await usersStore.deleteUser(createdUser.id);

    expect(provider.deleteUser).toHaveBeenCalledWith(createdUser.id);
    expect(usersStore.findUser(createdUser.id)).toBeUndefined();
  });

  it('loads users from the active provider and keeps the spinner for at least half a second', async () => {
    jest.useFakeTimers();

    const provider = createProviderMock({ loadUsers: [serverUser] });
    const usersStore = createUsersStore({ providers: createProviders({ supabase: provider }) });

    expect(usersStore.isLoadingUsers).toBe(true);

    await flushPromises();

    expect(usersStore.users).toEqual([serverUser]);
    expect(usersStore.isLoadingUsers).toBe(true);

    jest.advanceTimersByTime(499);

    expect(usersStore.isLoadingUsers).toBe(true);

    jest.advanceTimersByTime(1);

    expect(usersStore.isLoadingUsers).toBe(false);

    jest.useRealTimers();
  });

  it('creates users optimistically and then mirrors the provider response', async () => {
    const syncedUser: User = {
      id: '42',
      createdAt: '2026-05-14T10:00:00.000Z',
      updatedAt: '2026-05-14T10:00:00.000Z',
      fullName: 'Grace Hopper',
      role: 'MEMBER',
      dateOfBirth: '1906-12-09',
    };
    const provider = createProviderMock({
      createUser: async () => syncedUser,
    });
    const usersStore = createUsersStore({ providers: createProviders({ supabase: provider }) });

    await flushPromises();

    const createUserPromise = usersStore.createUser({
      fullName: 'Grace Hopper Local',
      role: 'STAFF',
      dateOfBirth: '',
    });
    const createdUserId = usersStore.users.at(-1)?.id ?? '';

    expect(usersStore.findUser(createdUserId)).toMatchObject({
      fullName: 'Grace Hopper Local',
      role: 'STAFF',
    });

    await createUserPromise;

    expect(usersStore.findUser(createdUserId)).toBeUndefined();
    expect(usersStore.findUser('42')).toEqual(syncedUser);
  });

  it('keeps optimistic updates when the active provider fails and clears the temporary error', async () => {
    const provider = createProviderMock({
      loadUsers: [serverUser],
      updateUser: async () => {
        throw new Error('Network offline');
      },
    });
    const usersStore = createUsersStore({ providers: createProviders({ supabase: provider }) });

    await flushPromises();

    jest.useFakeTimers();

    await usersStore.updateUser('1', {
      fullName: 'Ada Byron',
      role: 'MEMBER',
      dateOfBirth: '1815-12-10',
    });

    expect(usersStore.findUser('1')).toMatchObject({
      fullName: 'Ada Byron',
      role: 'MEMBER',
    });
    expect(usersStore.syncErrorMessage).toContain('Network offline');

    jest.advanceTimersByTime(4000);

    expect(usersStore.syncErrorMessage).toBe('');

    jest.useRealTimers();
  });

  it('waits for provider delete before the delete promise resolves', async () => {
    const deleteDeferred = createDeferred<void>();
    const provider = createProviderMock({
      deleteUser: () => deleteDeferred.promise,
      loadUsers: [serverUser],
    });
    const usersStore = createUsersStore({ providers: createProviders({ supabase: provider }) });

    await flushPromises();

    let didResolveDelete = false;
    const deleteUserPromise = usersStore.deleteUser('1').then(() => {
      didResolveDelete = true;
    });

    expect(usersStore.findUser('1')).toBeUndefined();
    expect(didResolveDelete).toBe(false);

    deleteDeferred.resolve();
    await deleteUserPromise;

    expect(usersStore.findUser('1')).toBeUndefined();
    expect(didResolveDelete).toBe(true);
  });

  it('clears users and refetches when the storage source changes', async () => {
    const supabaseProvider = createProviderMock({ loadUsers: [serverUser] });
    const sqliteProvider = createProviderMock({ loadUsers: [sqliteUser] });
    const usersStore = createUsersStore({
      providers: createProviders({ sqlite: sqliteProvider, supabase: supabaseProvider }),
    });

    await flushPromises();

    expect(usersStore.storageSource).toBe('supabase');
    expect(usersStore.users).toEqual([serverUser]);

    const switchPromise = usersStore.setStorageSource('sqlite');

    expect(usersStore.storageSource).toBe('sqlite');
    expect(usersStore.users).toEqual([]);

    await switchPromise;

    expect(sqliteProvider.loadUsers).toHaveBeenCalled();
    expect(usersStore.users).toEqual([sqliteUser]);
  });
});
