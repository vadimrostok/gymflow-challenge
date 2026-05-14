import type { ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';

import { AnimatePresence } from '@/components/motion-view';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useResolvedColorScheme } from '@/state/context/theme-mode';
import { UserListItem } from '@/components/users/user-list-item';
import type { User } from '@/state/schemas/user-schema';

type UsersListProps = {
  users: User[];
  containerStyle?: ViewStyle;
  isLoading?: boolean;
  onDeleteUser: (user: User) => void;
  showDeleteButton: boolean;
};

function UsersLoadingSpinner() {
  const colorScheme = useResolvedColorScheme();
  const palette = Colors[colorScheme];
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotation, {
        duration: 900,
        easing: Easing.linear,
        toValue: 1,
        useNativeDriver: true,
      })
    );

    animation.start();

    return () => animation.stop();
  }, [rotation]);

  return (
    <View accessibilityLabel="Loading users" className="items-center justify-center py-12">
      <Animated.View
        style={{
          transform: [
            {
              rotate: rotation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ],
        }}>
        <MaterialIcons color={palette.text} name="sync" size={28} />
      </Animated.View>
    </View>
  );
}

export const UsersList = observer(function UsersList({
  containerStyle,
  isLoading = false,
  showDeleteButton,
  users,
  onDeleteUser,
}: UsersListProps) {
  return (
    <View className="w-full self-center" style={containerStyle}>
      <View className={users.length ? 'p-5' : 'flex-grow justify-center p-5'}>
        {isLoading ? (
          <UsersLoadingSpinner />
        ) : users.length ? (
          <AnimatePresence>
            {users.map((user, index) => (
              <UserListItem
                isLast={index === users.length - 1}
                key={user.id}
                onDelete={() => onDeleteUser(user)}
                user={user}
                showDeleteButton={showDeleteButton}
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
