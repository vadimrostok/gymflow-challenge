import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Alert, Platform, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { DeleteUserDialog } from '@/components/users/delete-user-dialog';
import { UserForm } from '@/components/users/user-form';
import { UserFormPageShell } from '@/components/users/user-form-page-shell';
import { UsersSyncError } from '@/components/users/users-sync-error';
import { useAppNavigation } from '@/navigation/use-app-navigation';
import { useScreenFocusEffect } from '@/navigation/use-screen-focus-effect';
import { useUsersStore } from '@/state/context/users-context';
import type { UserFormValues } from '@/state/schemas/user-schema';

type EditUserScreenProps = {
  userId?: string;
};

export const EditUserScreen = observer(function EditUserScreen({ userId }: EditUserScreenProps) {
  const navigation = useAppNavigation();
  const usersStore = useUsersStore();
  const user = userId ? usersStore.findUser(userId) : undefined;
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);

  useScreenFocusEffect(() => {
    void usersStore.loadUsers();
  });

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-solarized-base3 p-5 dark:bg-solarized-base03">
        <UsersSyncError />
        <ThemedText type="subtitle">User not found</ThemedText>
        <ThemedText className="text-solarized-base01 dark:text-solarized-base1">
          This profile may have already been removed.
        </ThemedText>
      </View>
    );
  }

  const existingUser = user;

  async function saveUser(values: UserFormValues) {
    await usersStore.updateUser(existingUser.id, values);
    navigation.toUsers();
  }

  async function deleteUser() {
    await usersStore.deleteUser(existingUser.id);
    navigation.toUsers();
  }

  function requestDeleteUser() {
    if (Platform.OS === 'web') {
      setIsDeleteDialogVisible(true);
      return;
    }

    Alert.alert('Remove user?', `${existingUser.fullName} will be removed from the list.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: deleteUser },
    ]);
  }

  return (
    <View className="flex-1 bg-solarized-base3 transition-colors duration-500 dark:bg-solarized-base03">
      <UserFormPageShell motionKey={`users-edit-enter-${existingUser.id}`} title="Edit User">
        <UsersSyncError />
        <UserForm
          initialUser={existingUser}
          mode="edit"
          onCancel={() => (navigation.canGoBack() ? navigation.back() : navigation.toUsers())}
          onDelete={requestDeleteUser}
          onSubmit={saveUser}
        />
      </UserFormPageShell>
      <DeleteUserDialog
        isVisible={isDeleteDialogVisible}
        userName={existingUser.fullName}
        onCancel={() => setIsDeleteDialogVisible(false)}
        onConfirm={deleteUser}
      />
    </View>
  );
});
