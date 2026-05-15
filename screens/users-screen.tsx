import { MaterialIcons } from '@expo/vector-icons';
import { observer } from 'mobx-react-lite';
import { useRef, useState } from 'react';
import { Alert, Platform, Pressable, type GestureResponderEvent, View } from 'react-native';

import { useWonkAnimation } from '@/components/foreground-resume-animation';
import { MotionView } from '@/components/motion-view';
import { ThemedText } from '@/components/themed-text';
import { DeleteUserDialog } from '@/components/users/delete-user-dialog';
import { UsersList } from '@/components/users/users-list';
import { USER_SCREEN_MAX_WIDTH } from '@/constants/layout';
import { Colors, SharedColors } from '@/constants/theme';
import { useAppNavigation } from '@/navigation/use-app-navigation';
import { useScreenFocusEffect } from '@/navigation/use-screen-focus-effect';
import { useUsersStore } from '@/state/context/users-context';
import type { User } from '@/state/schemas/user-schema';
import { preferencesStorage } from '@/state/storage/preferences-storage';
import { ScreenWithFooter } from '@/components/screen-with-footer';

const FORCE_TOUCH_THRESHOLD = 0.75;

export const UsersScreen = observer(function UsersScreen() {
  const navigation = useAppNavigation();
  const { doBarrelRoll } = useWonkAnimation();
  const usersStore = useUsersStore();
  const shouldSuppressAddUserPressRef = useRef(false);
  const [pendingDeleteUser, setPendingDeleteUser] = useState<User | undefined>();
  const [showUsersListDeleteButton, setShowUsersListDeleteButton] = useState(
    preferencesStorage.getPreferences()?.showUsersListDeleteButton ?? false
  );

  useScreenFocusEffect(() => {
    setShowUsersListDeleteButton(
      preferencesStorage.getPreferences()?.showUsersListDeleteButton ?? false
    );
    void usersStore.loadUsers();
  });

  function requestDeleteUser(user: User) {
    const deleteUser = () => usersStore.deleteUser(user.id);

    if (Platform.OS === 'web') {
      setPendingDeleteUser(user);
      return;
    }

    Alert.alert('Remove user?', `${user.fullName} will be removed from the list.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: deleteUser },
    ]);
  }

  function maybeDoAddUserBarrelRoll(event: GestureResponderEvent) {
    if (Platform.OS !== 'ios' || shouldSuppressAddUserPressRef.current) {
      return;
    }

    const force = event.nativeEvent.force ?? 0;

    if (force < FORCE_TOUCH_THRESHOLD) {
      return;
    }

    shouldSuppressAddUserPressRef.current = doBarrelRoll();
  }

  function handleAddUserPress() {
    if (shouldSuppressAddUserPressRef.current) {
      shouldSuppressAddUserPressRef.current = false;
      return;
    }

    navigation.toNewUser();
  }

  const content = (
    <MotionView
      key="users-index-enter"
      initial={{ opacity: 0, y: -64 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
      style={{ alignItems: 'center', display: 'flex', width: '100%' }}>
      <View
        className="w-full px-5"
        style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: 860 }}>
        <View className="w-full flex-row flex-wrap items-start justify-between gap-4 p-5 pb-0">
          <View className="min-w-60 flex-1 gap-1.5">
            <ThemedText type="title">Gymflow Users</ThemedText>
            <ThemedText className="text-solarized-base01 dark:text-solarized-base1">
              Manage staff and member profiles across mobile and web.
            </ThemedText>
          </View>
          <Pressable
            testID="users-add-button"
            accessibilityLabel="Add User"
            accessibilityRole="button"
            delayLongPress={Platform.OS === 'ios' ? 650 : undefined}
            onLongPress={Platform.OS === 'ios' ? () => {
              if (shouldSuppressAddUserPressRef.current) {
                return;
              }

              shouldSuppressAddUserPressRef.current = doBarrelRoll();
            } : undefined}
            onPress={handleAddUserPress}
            onPressIn={maybeDoAddUserBarrelRoll}
            onTouchMove={maybeDoAddUserBarrelRoll}
            onTouchStart={maybeDoAddUserBarrelRoll}
            className="min-h-11 flex-row items-center gap-2.5 pr-[15px] active:opacity-75">
            <ThemedText
              type="defaultSemiBold"
              lightColor={Colors.light.primaryButtonBackground}
              darkColor={Colors.dark.primaryButtonBackground}
              className="leading-5">
              Add User
            </ThemedText>
            <View
              className="h-10 w-10 items-center justify-center rounded-full border border-gymflow-primary bg-gymflow-primary hover:border-gymflow-primaryHover hover:bg-gymflow-primaryHover dark:border-gymflow-primaryDark dark:bg-gymflow-primaryDark dark:hover:border-gymflow-primaryHoverDark dark:hover:bg-gymflow-primaryHoverDark"
              /* Without pointerEvents=none clicking on the icon (or anything inside
               * this view) would not trigger parent pressable's handler */
              pointerEvents="none"
            >
              <MaterialIcons name="person-add-alt-1" size={20} color={SharedColors.white} />
            </View>
          </Pressable>
        </View>
        <UsersList
          containerStyle={{ maxWidth: USER_SCREEN_MAX_WIDTH }}
          isLoading={usersStore.isLoadingUsers}
          onDeleteUser={requestDeleteUser}
          showDeleteButton={showUsersListDeleteButton}
          users={usersStore.sortedUsers}
        />
      </View>
    </MotionView>
  );

  return (
    <View className="flex-1 bg-solarized-base3 transition-colors duration-500 dark:bg-solarized-base03">
      {Platform.OS === 'web' ? (
        content
      ) : (
        <ScreenWithFooter>
          {content}
        </ScreenWithFooter>
      )}
      <DeleteUserDialog
        isVisible={Boolean(pendingDeleteUser)}
        userName={pendingDeleteUser?.fullName}
        onCancel={() => setPendingDeleteUser(undefined)}
        onConfirm={() => {
          if (pendingDeleteUser) {
            usersStore.deleteUser(pendingDeleteUser.id);
          }
          setPendingDeleteUser(undefined);
        }}
      />
    </View>
  );
});
