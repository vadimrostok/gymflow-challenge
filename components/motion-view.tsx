import type { PropsWithChildren } from 'react';
import { Fragment } from 'react';
import { View, type ViewProps } from 'react-native';

type MotionFallbackProps = ViewProps &
  PropsWithChildren<{
    animate?: unknown;
    exit?: unknown;
    initial?: unknown;
    layout?: unknown;
    transition?: unknown;
  }>;

export function AnimatePresence({ children }: PropsWithChildren) {
  return <Fragment>{children}</Fragment>;
}

export function MotionView({
  animate,
  exit,
  initial,
  layout,
  transition,
  ...props
}: MotionFallbackProps) {
  return <View {...props} />;
}
