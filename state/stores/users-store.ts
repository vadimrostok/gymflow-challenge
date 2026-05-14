import { makeAutoObservable, observable, runInAction } from 'mobx';

import { supabase } from '@/state/supabase-utils';
import {
  createLocalUserId,
  createTimestamp,
  userRoles,
  type User,
  type UserFormValues,
  type UserRole,
} from '@/state/schemas/user-schema';

type SupabaseUserRow = {
  id: number | string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  role: string;
  dateOfBirth: string | null;
};

type SupabaseMutationResult = {
  data?: SupabaseUserRow | SupabaseUserRow[] | null;
  error?: { message?: string } | null;
};

type SupabaseQueryResult = {
  data?: SupabaseUserRow[] | null;
  error?: { message?: string } | null;
};

type SupabaseUsersTable = {
  delete: () => {
    eq: (column: 'id', value: number) => Promise<SupabaseMutationResult>;
  };
  insert: (row: SupabaseUserRow) => {
    select: () => {
      single: () => Promise<SupabaseMutationResult>;
    };
  };
  select: () => {
    order: (column: 'fullName', options: { ascending: boolean }) => Promise<SupabaseQueryResult>;
  };
  update: (row: Partial<SupabaseUserRow>) => {
    eq: (column: 'id', value: number) => {
      select: () => {
        single: () => Promise<SupabaseMutationResult>;
      };
    };
  };
};

export type UsersSupabaseClient = {
  from: (tableName: 'users') => SupabaseUsersTable;
};

const initialUsers: User[] = [
  /*{
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
  },*/
];

function toUser(row: SupabaseUserRow): User {
  return {
    id: String(row.id),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    fullName: row.fullName,
    role: userRoles.includes(row.role as UserRole) ? (row.role as UserRole) : 'MEMBER',
    dateOfBirth: row.dateOfBirth ?? '',
  };
}

function toSupabaseId(userId: string) {
  const numericId = Number(userId);

  return Number.isSafeInteger(numericId) ? numericId : undefined;
}

function toSupabaseRow(user: User): SupabaseUserRow | undefined {
  const id = toSupabaseId(user.id);

  if (id === undefined) {
    return undefined;
  }

  return {
    id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    fullName: user.fullName,
    role: user.role,
    dateOfBirth: user.dateOfBirth || null,
  };
}

function toSupabaseUpdate(user: User): Partial<SupabaseUserRow> {
  return {
    updatedAt: user.updatedAt,
    fullName: user.fullName,
    role: user.role,
    dateOfBirth: user.dateOfBirth || null,
  };
}

export class UsersStore {
  private supabaseClient: UsersSupabaseClient | null;
  private syncErrorTimeout: ReturnType<typeof setTimeout> | undefined;

  users: User[] = observable(initialUsers);
  syncErrorMessage = '';

  constructor(supabaseClient: UsersSupabaseClient | null = supabase as UsersSupabaseClient | null) {
    this.supabaseClient = supabaseClient;
    makeAutoObservable(this, {}, { autoBind: true });
    void this.loadUsers();
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
    if (!this.supabaseClient) {
      return;
    }

    const { data, error } = await this.supabaseClient
      .from('users')
      .select()
      .order('fullName', { ascending: true });

    if (error) {
      this.showSyncError(`Could not load users: ${error.message ?? 'Supabase request failed.'}`);
      return;
    }

    runInAction(() => {
      this.users = (data ?? []).map(toUser);
    });
  }

  async createUser(values: UserFormValues) {
    const newUser: User = {
      ...values,
      id: createLocalUserId(),
      updatedAt: createTimestamp(),
      createdAt: createTimestamp(),
    };

    this.users.push(newUser);
    await this.createSupabaseUser(newUser);

    return newUser;
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
    await this.updateSupabaseUser(updatedUser);

    return updatedUser;
  }

  async deleteUser(userId: string) {
    runInAction(() => {
      this.users = this.users.filter((user) => user.id !== userId);
    });

    await this.deleteSupabaseUser(userId);

    runInAction(() => {
      this.users = this.users.filter((user) => user.id !== userId);
    });
  }

  private async createSupabaseUser(user: User) {
    if (!this.supabaseClient) {
      return;
    }

    const row = toSupabaseRow(user);

    if (!row) {
      this.showSyncError('Could not sync user: local ID is not compatible with Supabase.');
      return;
    }

    const { data, error } = await this.supabaseClient.from('users').insert(row).select().single();

    if (error) {
      this.showSyncError(`Could not sync created user: ${error.message ?? 'Supabase request failed.'}`);
      return;
    }

    if (data && !Array.isArray(data)) {
      this.replaceUser(user.id, toUser(data));
    }
  }

  private async updateSupabaseUser(user: User) {
    if (!this.supabaseClient) {
      return;
    }

    const id = toSupabaseId(user.id);

    if (id === undefined) {
      this.showSyncError('Could not sync user: local ID is not compatible with Supabase.');
      return;
    }

    const { data, error } = await this.supabaseClient
      .from('users')
      .update(toSupabaseUpdate(user))
      .eq('id', id)
      .select()
      .single();

    if (error) {
      this.showSyncError(`Could not sync updated user: ${error.message ?? 'Supabase request failed.'}`);
      return;
    }

    if (data && !Array.isArray(data)) {
      this.replaceUser(user.id, toUser(data));
    }
  }

  private async deleteSupabaseUser(userId: string) {
    if (!this.supabaseClient) {
      return;
    }

    const id = toSupabaseId(userId);

    if (id === undefined) {
      return;
    }

    const { error } = await this.supabaseClient.from('users').delete().eq('id', id);

    if (error) {
      this.showSyncError(`Could not sync deleted user: ${error.message ?? 'Supabase request failed.'}`);
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
}

export function createUsersStore(supabaseClient?: UsersSupabaseClient | null) {
  return new UsersStore(supabaseClient);
}
