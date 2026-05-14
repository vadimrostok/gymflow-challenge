import type { ViewStyle } from 'react-native';
import { observer } from 'mobx-react-lite';
import { View } from 'react-native';

import { AnimatePresence } from '@/components/motion-view';
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
      <View className={users.length ? 'p-5' : 'flex-grow justify-center p-5'}>
        {users.length ? (
          <AnimatePresence>
            {users.map((user, index) => (
              <UserListItem
                isLast={index === users.length - 1}
                key={user.id}
                onDelete={() => onDeleteUser(user)}
                user={user}
              />
            ))}
          </AnimatePresence>
        ) : (
          <View className="items-center gap-2">
            <ThemedText type="subtitle">No users yet</ThemedText>
            <ThemedText>Create the first staff or member profile to get started.</ThemedText>
          </View>
        )}
      </View>
    </View>
  );
});
