import { makeAutoObservable } from 'mobx';

import {
  createLocalUserId,
  createTimestamp,
  type User,
  type UserFormValues,
} from '@/features/users/user-schema';

const initialUsers: User[] = [
  {
    id: 'demo-ada-lovelace',
    fullName: 'Ada Lovelace',
    role: 'STAFF',
    dateOfBirth: '1815-12-10',
    updatedAt: createTimestamp(),
  },
  {
    id: 'demo-katherine-johnson',
    fullName: 'Katherine Johnson',
    role: 'MEMBER',
    dateOfBirth: '1918-08-26',
    updatedAt: createTimestamp(),
  },
];

export class UsersStore {
  users: User[] = initialUsers;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get sortedUsers() {
    return [...this.users].sort((firstUser, secondUser) =>
      firstUser.fullName.localeCompare(secondUser.fullName)
    );
  }

  findUser(userId: string) {
    return this.users.find((user) => user.id === userId);
  }

  createUser(values: UserFormValues) {
    const newUser: User = {
      ...values,
      id: createLocalUserId(),
      updatedAt: createTimestamp(),
    };

    this.users.push(newUser);
    return newUser;
  }

  updateUser(userId: string, values: UserFormValues) {
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
    return updatedUser;
  }

  deleteUser(userId: string) {
    this.users = this.users.filter((user) => user.id !== userId);
  }
}

export function createUsersStore() {
  return new UsersStore();
}

