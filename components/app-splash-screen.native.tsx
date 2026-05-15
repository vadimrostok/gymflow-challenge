import { useEffect, useState, type PropsWithChildren } from 'react';
import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { SharedColors } from '@/constants/theme';

const SPLASH_DURATION_MS = 1500;
const FOUR_DANCERS_ASPECT_RATIO = 2048 / 1714;
const fourDancersImage = require('../assets/paintings/four_dancers_1963.10.122.jpg');

export function AppSplashScreen({ children }: PropsWithChildren) {
  const { height, width } = useWindowDimensions();
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const panProgress = useSharedValue(0);
  const imageWidth = Math.max(width, Math.ceil(height * FOUR_DANCERS_ASPECT_RATIO));
  const overflowWidth = Math.max(0, imageWidth - width);
  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -overflowWidth * panProgress.value }],
  }));

  useEffect(() => {
    panProgress.value = 0;
    panProgress.value = withTiming(1, {
      duration: SPLASH_DURATION_MS,
      easing: Easing.inOut(Easing.cubic),
    });

    const timeoutId = setTimeout(() => {
      setIsSplashVisible(false);
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timeoutId);
  }, [panProgress]);

  return (
    <View style={styles.container}>
      {children}
      {isSplashVisible ? (
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          pointerEvents="none"
          style={styles.overlay}
          testID="app-splash-screen">
          <Animated.View style={[{ height, width: imageWidth }, imageStyle]}>
            <Image
              accessibilityIgnoresInvertColors
              resizeMode="cover"
              source={fourDancersImage}
              style={styles.image}
            />
          </Animated.View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: SharedColors.black,
    overflow: 'hidden',
    zIndex: 1000,
  },
});