import { createContext, useContext, useMemo, type PropsWithChildren } from 'react';
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

export function EasterEggAnimation({ children }: PropsWithChildren) {
  const barrelRollProgress = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
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

  return (
    <WonkAnimationContext.Provider value={contextValue}>
      <Animated.View
        testID="easter-egg-animation"
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
