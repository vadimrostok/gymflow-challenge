import { createContext, useContext, useRef, type PropsWithChildren } from 'react';
import { createUsersStore, type UsersStore } from '@/state/stores/users-store';
import { preferencesStorage } from '@/state/storage/preferences-storage';
import { defaultUsersStorageSource } from '@/state/users-data/users-data-provider';

type RootStore = {
  users: UsersStore
};
const StoresContext = createContext<RootStore | null>(null);

export function StoresProvider({ children }: PropsWithChildren) {
  const rootStoreRef = useRef<RootStore | null>(null);

  if (!rootStoreRef.current) {
    const preferences = preferencesStorage.getPreferences();

    rootStoreRef.current = {
      users: createUsersStore({
        initialStorageSource: preferences?.usersStorageSource ?? defaultUsersStorageSource,
      })
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
