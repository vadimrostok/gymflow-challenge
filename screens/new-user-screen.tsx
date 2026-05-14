import { ScrollView, View } from 'react-native';

import { UserForm } from '@/components/users/user-form';
import { useAppNavigation } from '@/navigation/use-app-navigation';
import { useUsersStore } from '@/state/context/users-context';
import type { UserFormValues } from '@/state/schemas/user-schema';
import { UserFormPageShell } from '@/components/users/user-form-page-shell';

export function NewUserScreen() {
  const navigation = useAppNavigation();
  const usersStore = useUsersStore();

  function createUser(values: UserFormValues) {
    usersStore.createUser(values);
    navigation.toUsers();
  }

  return (
    <View className="flex-1 bg-solarized-base3 transition-colors duration-500 dark:bg-solarized-base03">
      <UserFormPageShell motionKey="users-new-enter" title="Create User">
        <UserForm
          mode="create"
          onCancel={() => (navigation.canGoBack() ? navigation.back() : navigation.toUsers())}
          onSubmit={createUser}
        />
      </UserFormPageShell>
    </View>
  );
}