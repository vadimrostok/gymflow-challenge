import type { ViewStyle } from 'react-native';
import { observer } from 'mobx-react-lite';
import { FlatList, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { UserListItem } from '@/components/users/user-list-item';
import type { User } from '@/state/schemas/user-schema';

type UsersListProps = {
  users: User[];
  containerStyle?: ViewStyle;
  onDeleteUser: (user: User) => void;
};

export const UsersList = observer(function UsersList({ containerStyle, users, onDeleteUser }: UsersListProps) {
  return (
    <View className="w-full self-center" style={containerStyle}>
      <FlatList
        contentContainerStyle={users.length ? styles.listContent : styles.emptyContent}
        data={users}
        keyExtractor={(user) => user.id}
        ListEmptyComponent={
          <View className="items-center gap-2">
            <ThemedText type="subtitle">No users yet</ThemedText>
            <ThemedText>Create the first staff or member profile to get started.</ThemedText>
          </View>
        }
        renderItem={({ item }) => <UserListItem onDelete={() => onDeleteUser(item)} user={item} />}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  emptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  listContent: {
    gap: 12,
    padding: 20,
  },
});
