import { MaterialIcons } from '@expo/vector-icons';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, View } from 'react-native';

import { MotionView } from '@/components/motion-view';
import { ThemedText } from '@/components/themed-text';
import { DeleteUserDialog } from '@/components/users/delete-user-dialog';
import { UsersSyncError } from '@/components/users/users-sync-error';
import { UsersList } from '@/components/users/users-list';
import { USER_SCREEN_MAX_WIDTH } from '@/constants/layout';
import { useAppNavigation } from '@/navigation/use-app-navigation';
import { useScreenFocusEffect } from '@/navigation/use-screen-focus-effect';
import { useUsersStore } from '@/state/context/users-context';
import type { User } from '@/state/schemas/user-schema';

export const UsersScreen = observer(function UsersScreen() {
  const navigation = useAppNavigation();
  const usersStore = useUsersStore();
  const [pendingDeleteUser, setPendingDeleteUser] = useState<User | undefined>();

  useScreenFocusEffect(() => {
    void usersStore.loadUsers();
  });

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

  const content = (
    <MotionView
      key="users-index-enter"
      initial={{ opacity: 0, y: -64 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
      style={{ alignItems: 'center', display: 'flex', width: '100%' }}>
      <View
        className="w-full px-5"
        style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: 860 }}>
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
            onPress={navigation.toNewUser}
            className="min-h-11 flex-row items-center gap-2.5 pr-[15px] active:opacity-75">
            <ThemedText
              type="defaultSemiBold"
              lightColor="#2f855a"
              darkColor="#6ee7a8"
              className="leading-5">
              Add User
            </ThemedText>
            <View className="h-10 w-10 items-center justify-center rounded-full border border-gymflow-primary bg-gymflow-primary hover:border-[#276f4b] hover:bg-[#276f4b] dark:border-gymflow-primaryDark dark:bg-gymflow-primaryDark dark:hover:border-[#52c98d] dark:hover:bg-[#52c98d]">
              <MaterialIcons name="person-add-alt-1" size={20} color="#ffffff" />
            </View>
          </Pressable>
        </View>
        <UsersList
          containerStyle={{ maxWidth: USER_SCREEN_MAX_WIDTH }}
          onDeleteUser={requestDeleteUser}
          users={usersStore.sortedUsers}
        />
      </View>
    </MotionView>
  );

  return (
    <View className="flex-1 bg-solarized-base3 transition-colors duration-500 dark:bg-solarized-base03">
      {Platform.OS === 'web' ? (
        content
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}>
          {content}
        </ScrollView>
      )}
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
