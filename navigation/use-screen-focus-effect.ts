import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useRef } from 'react';

export function useScreenFocusEffect(effect: () => void) {
  const effectRef = useRef(effect);

  // Native stack screens can regain focus without remounting, so keep the callback fresh.
  useEffect(() => {
    effectRef.current = effect;
  }, [effect]);

  useFocusEffect(
    useCallback(() => {
      effectRef.current();
    }, [])
  );
}
