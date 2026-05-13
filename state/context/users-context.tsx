import { createContext, useContext, useRef, type PropsWithChildren } from 'react';
import { createUsersStore, type UsersStore } from '@/state/stores/users-store';

type RootStore = {
  users: UsersStore
};
const StoresContext = createContext<RootStore | null>(null);

export function StoresProvider({ children }: PropsWithChildren) {
  const rootStoreRef = useRef<RootStore | null>(null);

  if (!rootStoreRef.current) {
    rootStoreRef.current = {
      users: createUsersStore()
    }
  }

  return (
    <StoresContext.Provider value={rootStoreRef.current}>{children}</StoresContext.Provider>
  );
}

export function useUsersStore() {
  const rootStore = useContext(StoresContext);

  if (!rootStore) {
    throw new Error('useUsersStore must be used inside StoresProvider.');
  }

  return rootStore.users;
}