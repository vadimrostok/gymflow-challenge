import { useLocalSearchParams, useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Alert, Platform, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { DeleteUserDialog } from '@/components/users/delete-user-dialog';
import { UserForm } from '@/components/users/user-form';
import { UserFormPageShell } from '@/components/users/user-form-page-shell';
import type { UserFormValues } from '@/state/schemas/user-schema';
import { useUsersStore } from '@/state/context/users-context';

const EditUserScreen = observer(function EditUserScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const usersStore = useUsersStore();
  const user = id ? usersStore.findUser(id) : undefined;
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-solarized-base3 p-5 dark:bg-solarized-base03">
        <ThemedText type="subtitle">User not found</ThemedText>
        <ThemedText className="text-solarized-base01 dark:text-solarized-base1">
          This profile may have already been removed.
        </ThemedText>
      </View>
    );
  }

  const existingUser = user;

  function saveUser(values: UserFormValues) {
    usersStore.updateUser(existingUser.id, values);
    router.replace('/users');
  }

  function deleteUser() {
    usersStore.deleteUser(existingUser.id);
    router.replace('/users');
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
        <UserForm
          initialUser={existingUser}
          mode="edit"
          onCancel={() => router.canGoBack() ? router.back() : router.replace('/users')}
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

export default EditUserScreen;
