import { ScrollView, View } from 'react-native';

import { AppFooter } from '@/components/app-footer';
import { MotionView } from '@/components/motion-view';
import { ThemedText } from '@/components/themed-text';
import { UserForm } from '@/components/users/user-form';
import { useAppNavigation } from '@/navigation/use-app-navigation';
import { useUsersStore } from '@/state/context/users-context';
import type { UserFormValues } from '@/state/schemas/user-schema';

export function NewUserScreen() {
  const navigation = useAppNavigation();
  const usersStore = useUsersStore();

  function createUser(values: UserFormValues) {
    usersStore.createUser(values);
    navigation.toUsers();
  }

  return (
    <View className="flex-1 bg-solarized-base3 transition-colors duration-500 dark:bg-solarized-base03">
      <View className="absolute left-0 right-0 top-0 h-44 bg-solarized-base2 transition-colors duration-500 dark:bg-solarized-base02" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}
        showsVerticalScrollIndicator={false}>
        <MotionView
          key="users-new-enter"
          initial={{ opacity: 0, y: -64 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          style={{ alignItems: 'center', display: 'flex', width: '100%' }}>
          <View
            className="w-full gap-[22px] p-5"
            style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: 860 }}>
            <ThemedText type="title">Create User</ThemedText>
            <UserForm
              mode="create"
              onCancel={() => (navigation.canGoBack() ? navigation.back() : navigation.toUsers())}
              onSubmit={createUser}
            />
          </View>
        </MotionView>
        <AppFooter />
      </ScrollView>
    </View>
  );
}
