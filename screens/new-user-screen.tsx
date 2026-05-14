import { View } from 'react-native';

import { UserForm } from '@/components/users/user-form';
import { UserFormPageShell } from '@/components/users/user-form-page-shell';
import { UsersSyncError } from '@/components/users/users-sync-error';
import { useAppNavigation } from '@/navigation/use-app-navigation';
import { useUsersStore } from '@/state/context/users-context';
import type { UserFormValues } from '@/state/schemas/user-schema';

export function NewUserScreen() {
  const navigation = useAppNavigation();
  const usersStore = useUsersStore();

  async function createUser(values: UserFormValues) {
    await usersStore.createUser(values);
    navigation.toUsers();
  }

  return (
    <View className="flex-1 bg-solarized-base3 transition-colors duration-500 dark:bg-solarized-base03">
      <UserFormPageShell motionKey="users-new-enter" title="Create User">
        <UsersSyncError />
        <UserForm
          mode="create"
          onCancel={() => (navigation.canGoBack() ? navigation.back() : navigation.toUsers())}
          onSubmit={createUser}
        />
      </UserFormPageShell>
    </View>
  );
}
