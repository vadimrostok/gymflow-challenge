import { observer } from 'mobx-react-lite';
import { FlatList, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { UserListItem } from '@/components/users/user-list-item';
import type { User } from '@/state/schemas/user-schema';

type UsersListProps = {
  users: User[];
  onDeleteUser: (user: User) => void;
};

export const UsersList = observer(function UsersList({ users, onDeleteUser }: UsersListProps) {
  return (
    <FlatList
      contentContainerStyle={users.length ? styles.listContent : styles.emptyContent}
      data={users}
      keyExtractor={(user) => user.id}
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <ThemedText type="subtitle">No users yet</ThemedText>
          <ThemedText>Create the first staff or member profile to get started.</ThemedText>
        </View>
      }
      renderItem={({ item }) => <UserListItem onDelete={() => onDeleteUser(item)} user={item} />}
    />
  );
});

const styles = StyleSheet.create({
  emptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    gap: 8,
  },
  listContent: {
    gap: 12,
    padding: 20,
  },
});