import * as LocalAuthentication from 'expo-local-authentication';
import { AppState, AppStateStatus, Button, Text, View } from 'react-native';
import { Fragment, PropsWithChildren, useEffect, useRef, useState } from 'react';
import { preferencesStorage } from '@/state/storage/preferences-storage';

export function AppLock({ children }: PropsWithChildren) {
  const [isUnlocked, setIsUnlocked] = useState(false);

  const appState = useRef<AppStateStatus>(AppState.currentState);

  async function authenticate() {
    const preferences = preferencesStorage.getPreferences();
    if (!preferences?.isSecureModeEnabled) {
      setIsUnlocked(true);
      return;
    }
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate',
      fallbackLabel: 'Use passcode',
    });

    setIsUnlocked(result.success);
  }

  useEffect(() => {
    void authenticate(); // app start (but need to avoid triggering from settings
    const subscription = AppState.addEventListener(
      'change',
      async nextState => {
        const prevState = appState.current;

        const returningToForeground =
          prevState === 'background' &&
          nextState === 'active';

        if (returningToForeground) {
          setIsUnlocked(false);

          await authenticate();
        }

        appState.current = nextState;
      }
    );

    return () => subscription.remove();
  }, []);

  if (!isUnlocked) {
    return (
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
        <Text className="font-bold" style={{marginTop: '40pt', textAlignVertical: "center",textAlign: "center"}}>UH OH</Text>
        <Text className="text-lg">Nope, you are not allowed</Text>
        <Text className="text-xl font-bold">ಠ__ಠ</Text>
        <Button title="Try again" onPress={authenticate} />
      </View>
    );
  }

  return children;
}