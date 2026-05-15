import { supabase } from '@/state/supabase-utils';
import { userRoles, type User, type UserRole } from '@/state/schemas/user-schema';
import type { UsersDataProvider } from '@/state/users-data/users-data-provider';

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

function toSupabaseRow(user: User): SupabaseUserRow {
  const id = toSupabaseId(user.id);

  if (id === undefined) {
    throw new Error('Local ID is not compatible with Supabase.');
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

function assertSupabaseError(error: SupabaseMutationResult['error'] | SupabaseQueryResult['error']) {
  if (error) {
    throw new Error(error.message ?? 'Supabase request failed.');
  }
}

export function createSupabaseUsersProvider(
  supabaseClient: UsersSupabaseClient | null = supabase as UsersSupabaseClient | null
): UsersDataProvider {
  return {
    async loadUsers() {
      if (!supabaseClient) {
        return [];
      }

      const { data, error } = await supabaseClient
        .from('users')
        .select()
        .order('fullName', { ascending: true });

      assertSupabaseError(error);

      return (data ?? []).map(toUser);
    },

    async createUser(user) {
      if (!supabaseClient) {
        return undefined;
      }

      const { data, error } = await supabaseClient
        .from('users')
        .insert(toSupabaseRow(user))
        .select()
        .single();

      assertSupabaseError(error);

      return data && !Array.isArray(data) ? toUser(data) : undefined;
    },

    async updateUser(user) {
      if (!supabaseClient) {
        return undefined;
      }

      const id = toSupabaseId(user.id);

      if (id === undefined) {
        throw new Error('Local ID is not compatible with Supabase.');
      }

      const { data, error } = await supabaseClient
        .from('users')
        .update(toSupabaseUpdate(user))
        .eq('id', id)
        .select()
        .single();

      assertSupabaseError(error);

      return data && !Array.isArray(data) ? toUser(data) : undefined;
    },

    async deleteUser(userId) {
      if (!supabaseClient) {
        return;
      }

      const id = toSupabaseId(userId);

      if (id === undefined) {
        return;
      }

      const { error } = await supabaseClient.from('users').delete().eq('id', id);

      assertSupabaseError(error);
    },
  };
}
