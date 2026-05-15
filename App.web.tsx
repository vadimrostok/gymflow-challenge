import 'react-native-reanimated';
import './global.css';

import { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { View } from 'react-native';

import { AppHeader } from '@/components/app-header.web';
import { AppFooter } from '@/components/app-footer';
import { AppProviders } from '@/components/app-providers';
import { PageScrollProvider } from '@/components/page-scroll-context';
import { WEB_BASE_PATH } from '@/constants/web-paths';
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
    <BrowserRouter basename={WEB_BASE_PATH || undefined}>
      <AppProviders>
        <WebRouter />
      </AppProviders>
    </BrowserRouter>
  );
}

function WebRouter() {
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [location.pathname, location.search]);

  return (
    <View
      className="bg-solarized-base3 transition-colors duration-500 dark:bg-solarized-base03"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        width: '100vw',
      }}>
      <WebHeader />
      <PageScrollProvider scrollRef={scrollRef}>
        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            minHeight: 0,
            overflowX: 'hidden',
            overflowY: 'auto',
            scrollbarWidth: 'none',
          }}>
          <View style={{ flexGrow: 1, flexShrink: 0 }}>
            <Routes>
              <Route path="/" element={<Navigate to="/users" replace />} />
              <Route path="/users" element={<UsersScreen />} />
              <Route path="/users/new" element={<NewUserScreen />} />
              <Route path="/users/:id" element={<WebEditUserScreen />} />
              <Route path="/settings" element={<SettingsScreen />} />
              <Route path="*" element={<Navigate to="/users" replace />} />
            </Routes>
          </View>
          <AppFooter />
        </div>
      </PageScrollProvider>
      <StatusBar style="auto" />
    </View>
  );
}

function WebHeader() {
  const location = useLocation();
  const title = routeTitles.get(
    routeTitles.keys().find(regexp => regexp.test(location.pathname)) ?? undefined as never
  ) ?? '';

  return (
    <AppHeader
      canGoBack={location.pathname !== '/users'}
      hideSettings={location.pathname === '/settings'}
      title={title}
    />
  );
}

function WebEditUserScreen() {
  const { id } = useParams();

  return <EditUserScreen userId={id} />;
}