import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Alert, Platform, ScrollView, View } from 'react-native';

import { AppFooter } from '@/components/app-footer';
import { MotionView } from '@/components/motion-view';
import { ThemedText } from '@/components/themed-text';
import { DeleteUserDialog } from '@/components/users/delete-user-dialog';
import { UserForm } from '@/components/users/user-form';
import { useAppNavigation } from '@/navigation/use-app-navigation';
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
    navigation.toUsers();
  }

  function deleteUser() {
    usersStore.deleteUser(existingUser.id);
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
      <View className="absolute left-0 right-0 top-0 h-44 bg-solarized-base2 transition-colors duration-500 dark:bg-solarized-base02" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}
        showsVerticalScrollIndicator={false}>
        <MotionView
          key={`users-edit-enter-${existingUser.id}`}
          initial={{ opacity: 0, y: -64 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          style={{ alignItems: 'center', display: 'flex', width: '100%' }}>
          <View
            className="w-full gap-[22px] p-5"
            style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: 860 }}>
            <ThemedText type="title">Edit User</ThemedText>
            <UserForm
              initialUser={existingUser}
              mode="edit"
              onCancel={() => (navigation.canGoBack() ? navigation.back() : navigation.toUsers())}
              onDelete={requestDeleteUser}
              onSubmit={saveUser}
            />
          </View>
        </MotionView>
        <AppFooter />
      </ScrollView>
      <DeleteUserDialog
        isVisible={isDeleteDialogVisible}
        userName={existingUser.fullName}
        onCancel={() => setIsDeleteDialogVisible(false)}
        onConfirm={deleteUser}
      />
    </View>
  );
});
