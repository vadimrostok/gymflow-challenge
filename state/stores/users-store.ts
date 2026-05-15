import { makeAutoObservable, runInAction } from 'mobx';

import {
  createLocalUserId,
  createTimestamp,
  type User,
  type UserFormValues,
} from '@/state/schemas/user-schema';
import { createSupabaseUsersProvider } from '@/state/users-data/supabase-users-provider';
import { createSQLiteUsersProvider } from '@/state/users-data/sqlite-users-provider';
import {
  defaultUsersStorageSource,
  type UsersDataProvider,
  type UsersStorageSource,
} from '@/state/users-data/users-data-provider';

const initialUsers: User[] = [
  /*
  {
    id: 'demo-ada-lovelace',
    fullName: 'Ada Lovelace',
    role: 'STAFF',
    dateOfBirth: '1815-12-10',
    updatedAt: createTimestamp(),
    createdAt: createTimestamp(),
  },
  {
    id: 'demo-katherine-johnson',
    fullName: 'Katherine Johnson',
    role: 'MEMBER',
    dateOfBirth: '1918-08-26',
    updatedAt: createTimestamp(),
    createdAt: createTimestamp(),
  },
  */
];

type UsersDataProviders = Record<UsersStorageSource, UsersDataProvider>;

type UsersStoreOptions = {
  initialStorageSource?: UsersStorageSource;
  providers?: UsersDataProviders;
};

function createDefaultUsersDataProviders(): UsersDataProviders {
  return {
    sqlite: createSQLiteUsersProvider(),
    supabase: createSupabaseUsersProvider(),
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Storage request failed.';
}

export class UsersStore {
  private providers: UsersDataProviders;
  private syncErrorTimeout: ReturnType<typeof setTimeout> | undefined;
  private usersLoadingTimeout: ReturnType<typeof setTimeout> | undefined;
  private usersLoadRequestId = 0;

  storageSource: UsersStorageSource;
  users: User[] = initialUsers;
  isLoadingUsers = false;
  syncErrorMessage = '';

  constructor({
    initialStorageSource = defaultUsersStorageSource,
    providers = createDefaultUsersDataProviders(),
  }: UsersStoreOptions = {}) {
    this.providers = providers;
    this.storageSource = initialStorageSource;
    makeAutoObservable(this, {}, { autoBind: true });
    void this.loadUsers();
  }

  private get provider() {
    return this.providers[this.storageSource];
  }

  get sortedUsers() {
    return [...this.users].sort((firstUser, secondUser) =>
      firstUser.fullName.localeCompare(secondUser.fullName)
    );
  }

  findUser(userId: string) {
    return this.users.find((user) => user.id === userId);
  }

  async loadUsers() {
    const requestId = this.startUsersLoading();
    const startedAt = Date.now();

    try {
      const users = await this.provider.loadUsers();

      if (requestId !== this.usersLoadRequestId) {
        return;
      }

      runInAction(() => {
        this.users = users;
      });
    } catch (error) {
      this.showSyncError(`Could not load users: ${getErrorMessage(error)}`);
    } finally {
      this.finishUsersLoading(requestId, startedAt);
    }
  }

  async setStorageSource(storageSource: UsersStorageSource) {
    if (storageSource === this.storageSource) {
      return;
    }

    runInAction(() => {
      this.storageSource = storageSource;
      this.users = [];
    });

    await this.loadUsers();
  }

  async createUser(values: UserFormValues) {
    const newUser: User = {
      ...values,
      id: createLocalUserId(),
      updatedAt: createTimestamp(),
      createdAt: createTimestamp(),
    };

    this.users.push(newUser);
    const syncedUser = await this.createProviderUser(newUser);

    if (syncedUser) {
      this.replaceUser(newUser.id, syncedUser);
    }

    return syncedUser ?? newUser;
  }

  async updateUser(userId: string, values: UserFormValues) {
    const userIndex = this.users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      return undefined;
    }

    const updatedUser = {
      ...this.users[userIndex],
      ...values,
      updatedAt: createTimestamp(),
    };

    this.users[userIndex] = updatedUser;
    const syncedUser = await this.updateProviderUser(updatedUser);

    if (syncedUser) {
      this.replaceUser(updatedUser.id, syncedUser);
    }

    return syncedUser ?? updatedUser;
  }

  async deleteUser(userId: string) {
    runInAction(() => {
      this.users = this.users.filter((user) => user.id !== userId);
    });

    await this.deleteProviderUser(userId);

    runInAction(() => {
      this.users = this.users.filter((user) => user.id !== userId);
    });
  }

  private async createProviderUser(user: User) {
    try {
      return await this.provider.createUser(user);
    } catch (error) {
      this.showSyncError(`Could not sync created user: ${getErrorMessage(error)}`);
      return undefined;
    }
  }

  private async updateProviderUser(user: User) {
    try {
      return await this.provider.updateUser(user);
    } catch (error) {
      this.showSyncError(`Could not sync updated user: ${getErrorMessage(error)}`);
      return undefined;
    }
  }

  private async deleteProviderUser(userId: string) {
    try {
      await this.provider.deleteUser(userId);
    } catch (error) {
      this.showSyncError(`Could not sync deleted user: ${getErrorMessage(error)}`);
    }
  }

  private replaceUser(previousUserId: string, syncedUser: User) {
    runInAction(() => {
      const userIndex = this.users.findIndex((user) => user.id === previousUserId);

      if (userIndex === -1) {
        this.users.push(syncedUser);
        return;
      }

      this.users[userIndex] = syncedUser;
    });
  }

  private showSyncError(message: string) {
    runInAction(() => {
      this.syncErrorMessage = message;
    });

    if (this.syncErrorTimeout) {
      clearTimeout(this.syncErrorTimeout);
    }

    this.syncErrorTimeout = setTimeout(() => {
      runInAction(() => {
        this.syncErrorMessage = '';
      });
    }, 4000);
  }

  private startUsersLoading() {
    const requestId = this.usersLoadRequestId + 1;

    this.usersLoadRequestId = requestId;

    if (this.usersLoadingTimeout) {
      clearTimeout(this.usersLoadingTimeout);
      this.usersLoadingTimeout = undefined;
    }

    runInAction(() => {
      this.isLoadingUsers = true;
    });

    return requestId;
  }

  private finishUsersLoading(requestId: number, startedAt: number) {
    const remainingLoadingTime = Math.max(0, 500 - (Date.now() - startedAt));

    this.usersLoadingTimeout = setTimeout(() => {
      runInAction(() => {
        if (requestId === this.usersLoadRequestId) {
          this.isLoadingUsers = false;
        }
      });
    }, remainingLoadingTime);
  }
}

export function createUsersStore(options?: UsersStoreOptions) {
  return new UsersStore(options);
}