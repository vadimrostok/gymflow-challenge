import 'react-native-reanimated';
import './global.css';

import { StatusBar } from 'expo-status-bar';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { View } from 'react-native';

import { AppHeader } from '@/components/app-header';
import { AppProviders } from '@/components/app-providers';
import { EditUserScreen } from '@/screens/edit-user-screen';
import { NewUserScreen } from '@/screens/new-user-screen';
import { SettingsScreen } from '@/screens/settings-screen';
import { UsersScreen } from '@/screens/users-screen';

const routeTitles = new Map<RegExp, string>();
// Order is important here, wildcard in the end
routeTitles.set(/\/settings*/gi, 'Settings');
routeTitles.set(/\/users\/new\/?/gi, 'New User');
routeTitles.set(/\/users\/\w+/gi, 'Edit User');
routeTitles.set(/\/users.*/gi, 'Users');
routeTitles.set(/.*/gi, 'Home');

export default function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <WebRouter />
      </AppProviders>
    </BrowserRouter>
  );
}

function WebRouter() {
  return (
    <View
      className="bg-solarized-base3 transition-colors duration-500 dark:bg-solarized-base03"
      style={{ minHeight: '100vh', width: '100vw' }}>
      <WebHeader />
      <Routes>
        <Route path="/" element={<Navigate to="/users" replace />} />
        <Route path="/users" element={<UsersScreen />} />
        <Route path="/users/new" element={<NewUserScreen />} />
        <Route path="/users/:id" element={<WebEditUserScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="*" element={<Navigate to="/users" replace />} />
      </Routes>
      <StatusBar style="auto" />
    </View>
  );
}

function WebHeader() {
  const location = useLocation();
  const title = routeTitles.get(
    routeTitles.keys().find(regexp => regexp.test(location.pathname)) ?? undefined as never
  ) ?? '';

  return <AppHeader canGoBack={location.pathname !== '/users'} title={title} />;
}

function WebEditUserScreen() {
  const { id } = useParams();

  return <EditUserScreen userId={id} />;
}