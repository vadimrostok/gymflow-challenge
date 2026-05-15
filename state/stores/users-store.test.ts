import { createUsersStore, type UsersSupabaseClient } from '@/state/stores/users-store';

type SupabaseUserRow = {
  id: number | string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  role: string;
  dateOfBirth: string | null;
};

const serverUser: SupabaseUserRow = {
  id: 1,
  createdAt: '2026-05-14T09:00:00.000Z',
  updatedAt: '2026-05-14T09:30:00.000Z',
  fullName: 'Ada Lovelace',
  role: 'STAFF',
  dateOfBirth: '1815-12-10',
};

const flushPromises = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

function createSupabaseClientMock({
  loadData = [],
  deleteResult,
  insertResult,
  updateResult,
}: {
  loadData?: SupabaseUserRow[];
  deleteResult?: (id: number) => Promise<{ data?: null; error?: { message: string } | null }>;
  insertResult?: (row: SupabaseUserRow) => Promise<{ data?: SupabaseUserRow | null; error?: { message: string } | null }>;
  updateResult?: (
    row: Partial<SupabaseUserRow>,
    id: number
  ) => Promise<{ data?: SupabaseUserRow | null; error?: { message: string } | null }>;
} = {}) {
  const insert = jest.fn((row: SupabaseUserRow) => ({
    select: () => ({
      single: () => insertResult?.(row) ?? Promise.resolve({ data: row, error: null }),
    }),
  }));
  const update = jest.fn((row: Partial<SupabaseUserRow>) => ({
    eq: (_column: 'id', id: number) => ({
      select: () => ({
        single: () => updateResult?.(row, id) ?? Promise.resolve({ data: { ...serverUser, ...row }, error: null }),
      }),
    }),
  }));

  return {
    insert,
    update,
    client: {
      from: jest.fn(() => ({
        delete: () => ({
          eq: (_column: 'id', id: number) => deleteResult?.(id) ?? Promise.resolve({ data: null, error: null }),
        }),
        insert,
        select: () => ({
          order: () => Promise.resolve({ data: loadData, error: null }),
        }),
        update,
      })),
    } satisfies UsersSupabaseClient,
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
  it('creates, updates, and deletes users', async () => {
    const usersStore = createUsersStore(null);
    const createdUser = await usersStore.createUser({
      fullName: 'Margaret Hamilton',
      role: 'STAFF',
      dateOfBirth: '1936-08-17',
    });

    expect(usersStore.findUser(createdUser.id)?.fullName).toBe('Margaret Hamilton');

    await usersStore.updateUser(createdUser.id, {
      fullName: 'Margaret H.',
      role: 'MEMBER',
      dateOfBirth: '',
    });

    expect(usersStore.findUser(createdUser.id)).toMatchObject({
      fullName: 'Margaret H.',
      role: 'MEMBER',
    });

    await usersStore.deleteUser(createdUser.id);

    expect(usersStore.findUser(createdUser.id)).toBeUndefined();
  });

  it('loads users from Supabase and mirrors the returned data', async () => {
    jest.useFakeTimers();

    const { client } = createSupabaseClientMock({ loadData: [serverUser] });
    const usersStore = createUsersStore(client);

    expect(usersStore.isLoadingUsers).toBe(true);

    await flushPromises();

    expect(usersStore.users).toEqual([
      {
        id: '1',
        createdAt: serverUser.createdAt,
        updatedAt: serverUser.updatedAt,
        fullName: serverUser.fullName,
        role: serverUser.role,
        dateOfBirth: serverUser.dateOfBirth,
      },
    ]);
    expect(usersStore.isLoadingUsers).toBe(true);

    jest.advanceTimersByTime(499);

    expect(usersStore.isLoadingUsers).toBe(true);

    jest.advanceTimersByTime(1);

    expect(usersStore.isLoadingUsers).toBe(false);

    jest.useRealTimers();
  });

  it('creates users optimistically and then mirrors the Supabase response', async () => {
    const syncedUser: SupabaseUserRow = {
      id: 42,
      createdAt: '2026-05-14T10:00:00.000Z',
      updatedAt: '2026-05-14T10:00:00.000Z',
      fullName: 'Grace Hopper',
      role: 'MEMBER',
      dateOfBirth: '1906-12-09',
    };
    const { client, insert } = createSupabaseClientMock({
      insertResult: () => Promise.resolve({ data: syncedUser, error: null }),
    });
    const usersStore = createUsersStore(client);

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
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({ fullName: 'Grace Hopper Local' }));

    await createUserPromise;

    expect(usersStore.findUser(createdUserId)).toBeUndefined();
    expect(usersStore.findUser('42')).toEqual({
      id: '42',
      createdAt: syncedUser.createdAt,
      updatedAt: syncedUser.updatedAt,
      fullName: syncedUser.fullName,
      role: syncedUser.role,
      dateOfBirth: syncedUser.dateOfBirth,
    });
  });

  it('keeps optimistic updates when Supabase fails and clears the temporary error', async () => {
    const { client } = createSupabaseClientMock({
      loadData: [serverUser],
      updateResult: () => Promise.resolve({ data: null, error: { message: 'Network offline' } }),
    });
    const usersStore = createUsersStore(client);

    await flushPromises();

    jest.useFakeTimers();

    const updateUserPromise = usersStore.updateUser('1', {
      fullName: 'Ada Byron',
      role: 'MEMBER',
      dateOfBirth: '1815-12-10',
    });

    expect(usersStore.findUser('1')).toMatchObject({
      fullName: 'Ada Byron',
      role: 'MEMBER',
    });

    await updateUserPromise;

    expect(usersStore.findUser('1')).toMatchObject({
      fullName: 'Ada Byron',
      role: 'MEMBER',
    });
    expect(usersStore.syncErrorMessage).toContain('Network offline');

    jest.advanceTimersByTime(4000);

    expect(usersStore.syncErrorMessage).toBe('');

    jest.useRealTimers();
  });

  it('waits for Supabase delete before the delete promise resolves', async () => {
    const loadData = [serverUser];
    const deleteDeferred = createDeferred<{ data: null; error: null }>();
    const { client } = createSupabaseClientMock({
      loadData,
      deleteResult: () => deleteDeferred.promise,
    });
    const usersStore = createUsersStore(client);

    await flushPromises();

    let didResolveDelete = false;
    const deleteUserPromise = usersStore.deleteUser('1').then(() => {
      didResolveDelete = true;
    });

    expect(usersStore.findUser('1')).toBeUndefined();
    expect(didResolveDelete).toBe(false);

    deleteDeferred.resolve({ data: null, error: null });
    await deleteUserPromise;
    loadData.length = 0;

    await usersStore.loadUsers();

    expect(usersStore.findUser('1')).toBeUndefined();
    expect(didResolveDelete).toBe(true);
  });

  it('does not let stale Supabase loads overwrite newer load results', async () => {
    jest.useFakeTimers();

    const staleLoad = createDeferred<{ data: SupabaseUserRow[]; error: null }>();
    const freshLoad = createDeferred<{ data: SupabaseUserRow[]; error: null }>();
    const freshUser: SupabaseUserRow = {
      id: 2,
      createdAt: '2026-05-14T11:00:00.000Z',
      updatedAt: '2026-05-14T11:00:00.000Z',
      fullName: 'Katherine Johnson',
      role: 'MEMBER',
      dateOfBirth: '1918-08-26',
    };
    const loadResults = [staleLoad.promise, freshLoad.promise];
    const client: UsersSupabaseClient = {
      from: jest.fn(() => ({
        delete: () => ({
          eq: () => Promise.resolve({ data: null, error: null }),
        }),
        insert: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: null }),
          }),
        }),
        select: () => ({
          order: () => loadResults.shift() ?? Promise.resolve({ data: [], error: null }),
        }),
        update: () => ({
          eq: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: null, error: null }),
            }),
          }),
        }),
      })),
    };
    const usersStore = createUsersStore(client);
    const freshLoadPromise = usersStore.loadUsers();

    freshLoad.resolve({ data: [freshUser], error: null });
    await freshLoadPromise;

    expect(usersStore.users).toEqual([
      expect.objectContaining({ id: '2', fullName: 'Katherine Johnson' }),
    ]);

    staleLoad.resolve({ data: [serverUser], error: null });
    await flushPromises();

    expect(usersStore.users).toEqual([
      expect.objectContaining({ id: '2', fullName: 'Katherine Johnson' }),
    ]);

    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
});
