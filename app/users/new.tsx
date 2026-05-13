import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { UserForm } from '@/components/users/user-form';
import { Colors } from '@/constants/theme';
import type { UserFormValues } from '@/state/schemas/user-schema';
import { useResolvedColorScheme } from '@/state/context/theme-mode';
import { useUsersStore } from '@/state/context/users-context';

export default function NewUserScreen() {
  const router = useRouter();
  const usersStore = useUsersStore();
  const colorScheme = useResolvedColorScheme();
  const palette = Colors[colorScheme];

  function createUser(values: UserFormValues) {
    const newUser = usersStore.createUser(values);
    router.replace(`/users/${newUser.id}`);
  }

  return (
    <View style={[styles.screen, { backgroundColor: palette.background }]}>
      <View style={styles.content}>
        <ThemedText type="title">Create User</ThemedText>
        <UserForm mode="create" onCancel={() => router.back()} onSubmit={createUser} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    alignSelf: 'center',
    gap: 22,
    maxWidth: 720,
    padding: 20,
    width: '100%',
  },
  screen: {
    flex: 1,
  },
});