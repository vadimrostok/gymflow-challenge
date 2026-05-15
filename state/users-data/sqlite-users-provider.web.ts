import { userRoles, type User, type UserRole } from '@/state/schemas/user-schema';
import type { UsersDataProvider } from '@/state/users-data/users-data-provider';

const localUsersKey = 'gymflow.sqlite-users';

function isUser(value: Partial<User> | null | undefined): value is User {
  return (
    value !== undefined &&
    value !== null &&
    typeof value.id === 'string' &&
    typeof value.createdAt === 'string' &&
    typeof value.updatedAt === 'string' &&
    typeof value.fullName === 'string' &&
    typeof value.dateOfBirth === 'string' &&
    userRoles.includes(value.role as UserRole)
  );
}

function readUsers(): User[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    // TODO: maybe we should use indexdb here?
    const parsedValue = JSON.parse(window.localStorage.getItem(localUsersKey) ?? '[]') as Partial<User>[];

    return Array.isArray(parsedValue) ? parsedValue.filter(isUser) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: User[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(localUsersKey, JSON.stringify(users));
}

function sortUsers(users: User[]) {
  return [...users].sort((firstUser, secondUser) => firstUser.fullName.localeCompare(secondUser.fullName));
}

export function createSQLiteUsersProvider(): UsersDataProvider {
  return {
    async loadUsers() {
      return sortUsers(readUsers());
    },

    async createUser(user) {
      writeUsers([...readUsers(), user]);

      return user;
    },

    async updateUser(user) {
      writeUsers(readUsers().map((storedUser) => (storedUser.id === user.id ? user : storedUser)));

      return user;
    },

    async deleteUser(userId) {
      writeUsers(readUsers().filter((storedUser) => storedUser.id !== userId));
    },
  };
}