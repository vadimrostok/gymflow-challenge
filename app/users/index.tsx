import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Alert, Platform, Pressable, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { DeleteUserDialog } from '@/components/users/delete-user-dialog';
import { UsersList } from '@/components/users/users-list';
import { USER_SCREEN_MAX_WIDTH } from '@/constants/layout';
import type { User } from '@/state/schemas/user-schema';
import { useUsersStore } from '@/state/context/users-context';

const UsersScreen = observer(function UsersScreen() {
  const router = useRouter();
  const usersStore = useUsersStore();
  const [pendingDeleteUser, setPendingDeleteUser] = useState<User | undefined>();

  function requestDeleteUser(user: User) {
    const deleteUser = () => usersStore.deleteUser(user.id);

    if (Platform.OS === 'web') {
      setPendingDeleteUser(user);
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
        <Animated.View entering={FadeInDown.duration(220)}>
          <View className="w-full flex-row flex-wrap items-start justify-between gap-4 p-5 pb-0">
            <View className="min-w-60 flex-1 gap-1.5">
              <ThemedText type="title">Gymflow Users</ThemedText>
              <ThemedText className="text-solarized-base01 dark:text-solarized-base1">
                Manage staff and member profiles across mobile and web.
              </ThemedText>
            </View>
            <Pressable
              accessibilityLabel="Add User"
              accessibilityRole="button"
              onPress={() => router.push('/users/new')}
              className="min-h-11 flex-row items-center gap-2.5 pr-[15px] active:opacity-75">
              <ThemedText
                type="defaultSemiBold"
                lightColor="#2f855a"
                darkColor="#6ee7a8"
                className="leading-5">
                Add User
              </ThemedText>
              <View className="h-10 w-10 items-center justify-center rounded-full border border-gymflow-primary bg-gymflow-primary dark:border-gymflow-primaryDark dark:bg-gymflow-primaryDark">
                <MaterialIcons name="person-add-alt-1" size={20} color="#ffffff" />
              </View>
            </Pressable>
          </View>
        </Animated.View>
        <UsersList
          containerStyle={{ maxWidth: USER_SCREEN_MAX_WIDTH }}
          onDeleteUser={requestDeleteUser}
          users={usersStore.sortedUsers}
        />
      </View>
      <DeleteUserDialog
        isVisible={Boolean(pendingDeleteUser)}
        userName={pendingDeleteUser?.fullName}
        onCancel={() => setPendingDeleteUser(undefined)}
        onConfirm={() => {
          if (pendingDeleteUser) {
            usersStore.deleteUser(pendingDeleteUser.id);
          }
          setPendingDeleteUser(undefined);
        }}
      />
    </View>
  );
});

export default UsersScreen;
