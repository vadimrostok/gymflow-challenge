import { createContext, useContext, useRef, type PropsWithChildren } from 'react';

import { createUsersStore, type UsersStore } from '@/features/users/users-store';

const UsersStoreContext = createContext<UsersStore | null>(null);

export function UsersStoreProvider({ children }: PropsWithChildren) {
  const usersStoreRef = useRef<UsersStore | null>(null);

  if (!usersStoreRef.current) {
    usersStoreRef.current = createUsersStore();
  }

  return (
    <UsersStoreContext.Provider value={usersStoreRef.current}>{children}</UsersStoreContext.Provider>
  );
}

export function useUsersStore() {
  const usersStore = useContext(UsersStoreContext);

  if (!usersStore) {
    throw new Error('useUsersStore must be used inside UsersStoreProvider.');
  }

  return usersStore;
}

