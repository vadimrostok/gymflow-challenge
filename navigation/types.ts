export type RootStackParamList = {
  Users: undefined;
  NewUser: undefined;
  EditUser: { id: string };
  Settings: undefined;
};

export type AppNavigation = {
  back: () => void;
  canGoBack: () => boolean;
  toEditUser: (id: string) => void;
  toNewUser: () => void;
  toSettings: () => void;
  toUsers: () => void;
};
