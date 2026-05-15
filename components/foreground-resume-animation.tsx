import { createContext, useContext, useEffect, useMemo, useRef, type PropsWithChildren } from 'react';
import { AppState, Platform, type AppStateStatus } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type WonkAnimationContextValue = {
  doBarrelRoll: () => boolean;
};

const WonkAnimationContext = createContext<WonkAnimationContextValue>({
  doBarrelRoll: () => false,
});

export function ForegroundResumeAnimation({ children }: PropsWithChildren) {
  const previousAppState = useRef<AppStateStatus>(AppState.currentState);
  const foregroundProgress = useSharedValue(1);
  const barrelRollProgress = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    borderRadius: interpolate(
      foregroundProgress.value,
      [0, 0.82, 1],
      [36, 10, 0],
      Extrapolation.CLAMP
    ),
    opacity: interpolate(foregroundProgress.value, [0, 0.32, 1], [0.2, 1, 1], Extrapolation.CLAMP),
    transform: [
      {
        translateY: interpolate(
          foregroundProgress.value,
          [0, 0.72, 1],
          [72, -8, 0],
          Extrapolation.CLAMP
        ),
      },
      {
        scale: interpolate(
          foregroundProgress.value,
          [0, 0.72, 1],
          [0.82, 1.025, 1],
          Extrapolation.CLAMP
        ),
      },
      {
        rotateZ: `${interpolate(barrelRollProgress.value, [0, 1], [0, 360])}deg`,
      },
      {
        scale: interpolate(
          barrelRollProgress.value,
          [0, 0.5, 1],
          [1, 0.9, 1],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));
  const contextValue = useMemo<WonkAnimationContextValue>(
    () => ({
      doBarrelRoll: () => {
        if (Platform.OS === 'web') {
          return false;
        }

        barrelRollProgress.value = 0;
        barrelRollProgress.value = withTiming(1, {
          duration: 900,
          easing: Easing.inOut(Easing.cubic),
        });

        return true;
      },
    }),
    [barrelRollProgress]
  );

  useEffect(() => {
    if (Platform.OS === 'web') {
      return undefined;
    }

    const subscription = AppState.addEventListener('change', (nextState) => {
      const wasAwayFromForeground =
        previousAppState.current === 'background' || previousAppState.current === 'inactive';

      if (wasAwayFromForeground && nextState === 'active') {
        foregroundProgress.value = 0;
        foregroundProgress.value = withTiming(1, {
          duration: 620,
          easing: Easing.out(Easing.back(1.18)),
        });
      }

      previousAppState.current = nextState;
    });

    return () => subscription.remove();
  }, [foregroundProgress]);

  return (
    <WonkAnimationContext.Provider value={contextValue}>
      <Animated.View
        testID="foreground-resume-animation"
        style={[
          {
            flex: 1,
            overflow: 'hidden',
          },
          animatedStyle,
        ]}>
        {children}
      </Animated.View>
    </WonkAnimationContext.Provider>
  );
}

export function useWonkAnimation() {
  return useContext(WonkAnimationContext);
}
