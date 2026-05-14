import { useRouter } from 'expo-router';

import type { AppNavigation } from '@/navigation/types';

export function useAppNavigation(): AppNavigation {
  const router = useRouter();

  return {
    back: () => router.back(),
    canGoBack: () => router.canGoBack(),
    toEditUser: (id) => router.push(`/users/${id}`),
    toNewUser: () => router.push('/users/new'),
    toSettings: () => router.push('/settings'),
    toUsers: () => router.replace('/users'),
  };
}
