import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export function useScreenFocusEffect(effect: () => void) {
  const location = useLocation();
  const effectRef = useRef(effect);

  // Web routes are keyed by React Router navigation instead of native focus events.
  useEffect(() => {
    effectRef.current = effect;
  }, [effect]);

  useEffect(() => {
    effectRef.current();
  }, [location.key]);
}
