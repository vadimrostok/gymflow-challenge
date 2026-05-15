import type { User } from '@/state/schemas/user-schema';

export const usersStorageSources = ['supabase', 'sqlite'] as const;

export type UsersStorageSource = (typeof usersStorageSources)[number];

export type UsersDataProvider = {
  loadUsers: () => Promise<User[]>;
  createUser: (user: User) => Promise<User | undefined>;
  updateUser: (user: User) => Promise<User | undefined>;
  deleteUser: (userId: string) => Promise<void>;
};

export const usersStorageSourceOptions: { value: UsersStorageSource; label: string }[] = [
  { value: 'supabase', label: 'Supabase (remote)' },
  { value: 'sqlite', label: 'SQLite (local)' },
];

export const defaultUsersStorageSource: UsersStorageSource = 'supabase';

export function isUsersStorageSource(value: unknown): value is UsersStorageSource {
  return usersStorageSources.includes(value as UsersStorageSource);
}
