import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { UserForm } from '@/components/users/user-form';
import type { UserFormValues } from '@/state/schemas/user-schema';
import { useUsersStore } from '@/state/context/users-context';

export default function NewUserScreen() {
  const router = useRouter();
  const usersStore = useUsersStore();

  function createUser(values: UserFormValues) {
    const newUser = usersStore.createUser(values);
    router.replace(`/users/${newUser.id}`);
  }

  return (
    <View className="flex-1 bg-solarized-base3 dark:bg-solarized-base03">
      <View className="w-full max-w-[860px] self-center gap-[22px] p-5">
        <ThemedText type="title">Create User</ThemedText>
        <UserForm
          mode="create"
          onCancel={() => router.canGoBack() ? router.back() : router.replace('/users')}
          onSubmit={createUser}
        />
      </View>
    </View>
  );
}
