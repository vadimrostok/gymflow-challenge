import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import type { AppNavigation } from '@/navigation/types';

export function useAppNavigation(): AppNavigation {
  const navigate = useNavigate();
  const canGoBack = useCallback(() => window.history.length > 1, []);

  return {
    back: () => navigate(-1),
    canGoBack,
    toEditUser: (id) => navigate(`/users/${id}`),
    toNewUser: () => navigate('/users/new'),
    toSettings: () => navigate('/settings'),
    toUsers: () => navigate('/users'),
  };
}
