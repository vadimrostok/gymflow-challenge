import type { PropsWithChildren } from 'react';
import { Fragment, useEffect, useMemo } from 'react';
import { StyleSheet, type ViewProps } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type NativeMotionViewProps = ViewProps &
  PropsWithChildren<{
    animate?: MotionTarget;
    exit?: unknown;
    initial?: MotionTarget;
    layout?: unknown;
    transition?: MotionTransition;
  }>;

type MotionTarget = {
  height?: number | string;
  marginBottom?: number;
  opacity?: number;
  scale?: number;
  y?: number;
};

type MotionTransition = {
  duration?: number;
  ease?: unknown;
};

export function AnimatePresence({ children }: PropsWithChildren) {
  return <Fragment>{children}</Fragment>;
}

export function MotionView({
  animate,
  exit,
  initial,
  layout,
  style,
  transition,
  ...props
}: NativeMotionViewProps) {
  const flattenedStyle = useMemo(() => StyleSheet.flatten(style) ?? {}, [style]);
  const opacity = useSharedValue(
    getInitialNumber(initial?.opacity, animate?.opacity, flattenedStyle.opacity, 1)
  );
  const translateY = useSharedValue(getInitialNumber(initial?.y, animate?.y, undefined, 0));
  const scale = useSharedValue(getInitialNumber(initial?.scale, animate?.scale, undefined, 1));
  const marginBottom = useSharedValue(
    getInitialNumber(initial?.marginBottom, animate?.marginBottom, flattenedStyle.marginBottom, 0)
  );
  const duration = Math.round((transition?.duration ?? 0.3) * 1000);
  const animatedStyle = useAnimatedStyle(() => ({
    marginBottom: marginBottom.value,
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  useEffect(() => {
    const timingConfig = {
      duration,
      easing: Easing.out(Easing.cubic),
    };

    opacity.value = withTiming(
      getTargetNumber(animate?.opacity, flattenedStyle.opacity, 1),
      timingConfig
    );
    translateY.value = withTiming(getTargetNumber(animate?.y, undefined, 0), timingConfig);
    scale.value = withTiming(getTargetNumber(animate?.scale, undefined, 1), timingConfig);
    marginBottom.value = withTiming(
      getTargetNumber(animate?.marginBottom, flattenedStyle.marginBottom, 0),
      timingConfig
    );
  }, [
    animate,
    duration,
    flattenedStyle.marginBottom,
    flattenedStyle.opacity,
    marginBottom,
    opacity,
    scale,
    translateY,
  ]);

  return <Animated.View {...props} style={[style, animatedStyle]} />;
}

function getInitialNumber(
  initialValue: unknown,
  animatedValue: unknown,
  styleValue: unknown,
  fallback: number
) {
  if (typeof initialValue === 'number') {
    return initialValue;
  }

  if (typeof animatedValue === 'number') {
    return fallback;
  }

  if (typeof styleValue === 'number') {
    return styleValue;
  }

  return fallback;
}

function getTargetNumber(animatedValue: unknown, styleValue: unknown, fallback: number) {
  if (typeof animatedValue === 'number') {
    return animatedValue;
  }

  if (typeof styleValue === 'number') {
    return styleValue;
  }

  return fallback;
}