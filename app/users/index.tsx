import { useRouter } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { Alert, Platform, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { UsersList } from '@/components/users/users-list';
import { USER_SCREEN_MAX_WIDTH } from '@/constants/layout';
import { Colors } from '@/constants/theme';
import type { User } from '@/state/schemas/user-schema';
import { useResolvedColorScheme } from '@/state/context/theme-mode';
import { useUsersStore } from '@/state/context/users-context';

const UsersScreen = observer(function UsersScreen() {
  const router = useRouter();
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
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <ThemedText type="title">Gymflow Users</ThemedText>
            <ThemedText style={{ color: palette.mutedText }}>
              Manage staff and member profiles across mobile and web.
            </ThemedText>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/users/new')}
            style={({ pressed }) => [
              styles.addButton,
              { backgroundColor: palette.primaryButtonBackground, opacity: pressed ? 0.74 : 1 },
            ]}>
            <ThemedText type="defaultSemiBold" style={{ color: palette.primaryButtonText }}>
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
    width: '100%',
  },
  headerText: {
    flex: 1,
    gap: 6,
    minWidth: 240,
  },
  content: {
    alignItems: 'center',
    alignSelf: 'center',
    maxWidth: USER_SCREEN_MAX_WIDTH,
    paddingHorizontal: 20,
    width: '100%',
  },
  screen: {
    flex: 1,
  },
});
