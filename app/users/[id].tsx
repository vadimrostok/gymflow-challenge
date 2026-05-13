import { useLocalSearchParams, useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { Alert, Platform, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { UserForm } from '@/components/users/user-form';
import { USER_SCREEN_MAX_WIDTH } from '@/constants/layout';
import { Colors } from '@/constants/theme';
import type { UserFormValues } from '@/state/schemas/user-schema';
import { useResolvedColorScheme } from '@/state/context/theme-mode';
import { useUsersStore } from '@/state/context/users-context';

const EditUserScreen = observer(function EditUserScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const usersStore = useUsersStore();
  const colorScheme = useResolvedColorScheme();
  const palette = Colors[colorScheme];
  const user = id ? usersStore.findUser(id) : undefined;

  if (!user) {
    return (
      <View style={[styles.screen, styles.centered, { backgroundColor: palette.background }]}>
        <ThemedText type="subtitle">User not found</ThemedText>
        <ThemedText style={{ color: palette.mutedText }}>
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
      if (globalThis.confirm(`Remove ${existingUser.fullName}?`)) {
        deleteUser();
      }

      return;
    }

    Alert.alert('Remove user?', `${existingUser.fullName} will be removed from the list.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: deleteUser },
    ]);
  }

  return (
    <View style={[styles.screen, { backgroundColor: palette.background }]}>
      <View style={styles.content}>
        <ThemedText type="title">Edit User</ThemedText>
        <UserForm
          initialUser={existingUser}
          mode="edit"
          onCancel={() => router.canGoBack() ? router.back() : router.replace('/users')}
          onDelete={requestDeleteUser}
          onSubmit={saveUser}
        />
      </View>
    </View>
  );
});

export default EditUserScreen;

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    alignSelf: 'center',
    gap: 22,
    maxWidth: USER_SCREEN_MAX_WIDTH,
    padding: 20,
    width: '100%',
  },
  screen: {
    flex: 1,
  },
});