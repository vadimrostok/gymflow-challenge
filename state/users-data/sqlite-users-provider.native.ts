import * as SQLite from 'expo-sqlite';

import { userRoles, type User, type UserRole } from '@/state/schemas/user-schema';
import type { UsersDataProvider } from '@/state/users-data/users-data-provider';

type SQLiteUserRow = {
  id: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  role: string;
  dateOfBirth: string | null;
};

function toUser(row: SQLiteUserRow): User {
  return {
    id: row.id,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    fullName: row.fullName,
    role: userRoles.includes(row.role as UserRole) ? (row.role as UserRole) : 'MEMBER',
    dateOfBirth: row.dateOfBirth ?? '',
  };
}

function toSQLiteParams(user: User) {
  return {
    $createdAt: user.createdAt,
    $dateOfBirth: user.dateOfBirth || null,
    $fullName: user.fullName,
    $id: user.id,
    $role: user.role,
    $updatedAt: user.updatedAt,
  };
}

export function createSQLiteUsersProvider(databaseName = 'gymflow-users.db'): UsersDataProvider {
  let databasePromise: Promise<SQLite.SQLiteDatabase> | undefined;

  async function getDatabase() {
    databasePromise ??= SQLite.openDatabaseAsync(databaseName).then(async (database) => {
      await database.execAsync(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY NOT NULL,
          createdAt TEXT NOT NULL,
          updatedAt TEXT NOT NULL,
          fullName TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'MEMBER',
          dateOfBirth TEXT
        );
      `);

      return database;
    });

    return databasePromise;
  }

  return {
    async loadUsers() {
      const database = await getDatabase();
      const rows = await database.getAllAsync<SQLiteUserRow>(
        'SELECT id, createdAt, updatedAt, fullName, role, dateOfBirth FROM users ORDER BY fullName COLLATE NOCASE ASC;'
      );

      return rows.map(toUser);
    },

    async createUser(user) {
      const database = await getDatabase();

      await database.runAsync(
        `
        INSERT INTO users (id, createdAt, updatedAt, fullName, role, dateOfBirth)
        VALUES ($id, $createdAt, $updatedAt, $fullName, $role, $dateOfBirth);
        `,
        toSQLiteParams(user)
      );

      return user;
    },

    async updateUser(user) {
      const database = await getDatabase();

      await database.runAsync(
        `
        UPDATE users
        SET updatedAt = $updatedAt,
            fullName = $fullName,
            role = $role,
            dateOfBirth = $dateOfBirth
        WHERE id = $id;
        `,
        toSQLiteParams(user)
      );

      return user;
    },

    async deleteUser(userId) {
      const database = await getDatabase();

      await database.runAsync('DELETE FROM users WHERE id = ?;', userId);
    },
  };
}
