import { observer } from 'mobx-react-lite';
import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useUsersStore } from '@/state/context/users-context';

type UsersSyncErrorProps = {
  containerClassName?: string;
};

export const UsersSyncError = observer(function UsersSyncError({
  containerClassName,
}: UsersSyncErrorProps) {
  const usersStore = useUsersStore();

  if (!usersStore.syncErrorMessage) {
    return null;
  }

  return (
    <View
      className={[
        'rounded-lg border border-solarized-red/40 bg-solarized-red/10 px-3 py-2',
        containerClassName,
      ]
        .filter(Boolean)
        .join(' ')}>
      <ThemedText lightColor="#dc322f" darkColor="#ff8f8f" className="text-sm leading-5">
        {usersStore.syncErrorMessage}
      </ThemedText>
    </View>
  );
});
