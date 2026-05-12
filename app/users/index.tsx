import { Link } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { Alert, Platform, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { UsersList } from '@/components/users/users-list';
import { Colors } from '@/constants/theme';
import type { User } from '@/features/users/user-schema';
import { useResolvedColorScheme } from '@/state/theme-mode';
import { useUsersStore } from '@/state/users-context';

const UsersScreen = observer(function UsersScreen() {
  const usersStore = useUsersStore();
  const colorScheme = useResolvedColorScheme();
  const palette = Colors[colorScheme];

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
    <View style={[styles.screen, { backgroundColor: palette.background }]}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <ThemedText type="title">Gymflow Users</ThemedText>
          <ThemedText style={{ color: palette.mutedText }}>
            Manage staff and member profiles across mobile and web.
          </ThemedText>
        </View>
        <Link href="/users/new" asChild>
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.addButton,
              { backgroundColor: palette.tint, opacity: pressed ? 0.74 : 1 },
            ]}>
            <ThemedText type="defaultSemiBold" style={{ color: palette.onTint }}>
              Add User
            </ThemedText>
          </Pressable>
        </Link>
      </View>
      <UsersList onDeleteUser={requestDeleteUser} users={usersStore.sortedUsers} />
    </View>
  );
});

export default UsersScreen;

const styles = StyleSheet.create({
  addButton: {
    alignItems: 'center',
    borderRadius: 8,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 0,
  },
  headerText: {
    flex: 1,
    gap: 6,
    minWidth: 240,
  },
  screen: {
    flex: 1,
  },
});

