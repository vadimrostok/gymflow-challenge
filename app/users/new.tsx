import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { UserForm } from '@/components/users/user-form';
import { UserFormPageShell } from '@/components/users/user-form-page-shell';
import type { UserFormValues } from '@/state/schemas/user-schema';
import { useUsersStore } from '@/state/context/users-context';

export default function NewUserScreen() {
  const router = useRouter();
  const usersStore = useUsersStore();

  function createUser(values: UserFormValues) {
    usersStore.createUser(values);
    router.replace('/users');
  }

  return (
    <View className="flex-1 bg-solarized-base3 transition-colors duration-500 dark:bg-solarized-base03">
      <UserFormPageShell motionKey="users-new-enter" title="Create User">
        <UserForm
          mode="create"
          onCancel={() => router.canGoBack() ? router.back() : router.replace('/users')}
          onSubmit={createUser}
        />
      </UserFormPageShell>
    </View>
  );
}
