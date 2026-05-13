import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { Alert, Platform, Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { UsersList } from '@/components/users/users-list';
import { USER_SCREEN_MAX_WIDTH } from '@/constants/layout';
import type { User } from '@/state/schemas/user-schema';
import { useUsersStore } from '@/state/context/users-context';

const UsersScreen = observer(function UsersScreen() {
  const router = useRouter();
  const usersStore = useUsersStore();

  function requestDeleteUser(user: User) {
    const deleteUser = () => usersStore.deleteUser(user.id);

    if (Platform.OS === 'web') {
      if (globalThis.confirm(`Remove ${user.fullName}?`)) {
        deleteUser();
      }

      return;
    }

    Alert.alert('Remove user?', `${user.fullName} will be removed from the list.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: deleteUser },
    ]);
  }

  return (
    <View className="flex-1 bg-solarized-base3 dark:bg-solarized-base03">
      <View className="w-full max-w-[860px] self-center px-5">
        <View className="w-full flex-row flex-wrap items-start justify-between gap-4 p-5 pb-0">
          <View className="min-w-60 flex-1 gap-1.5">
            <ThemedText type="title">Gymflow Users</ThemedText>
            <ThemedText className="text-solarized-base01 dark:text-solarized-base1">
              Manage staff and member profiles across mobile and web.
            </ThemedText>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/users/new')}
            className="min-h-11 items-center justify-center rounded-lg bg-gymflow-primary px-4 active:opacity-75 dark:bg-gymflow-primaryDark">
            <ThemedText type="defaultSemiBold" lightColor="#ffffff" darkColor="#002b36">
              Add User
            </ThemedText>
          </Pressable>
        </View>
        <UsersList
          containerStyle={{ maxWidth: USER_SCREEN_MAX_WIDTH }}
          onDeleteUser={requestDeleteUser}
          users={usersStore.sortedUsers}
        />
      </View>
    </View>
  );
});

export default UsersScreen;
