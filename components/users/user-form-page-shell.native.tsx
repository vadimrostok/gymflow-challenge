import type { ComponentRef, PropsWithChildren } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Image, useWindowDimensions, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { MotionView } from '@/components/motion-view';
import { ThemedText } from '@/components/themed-text';
import { getNextPainting } from '@/constants/paintings';

type UserFormPageShellProps = PropsWithChildren<{
  motionKey: string;
  title: string;
}>;

const AnimatedScrollView = Animated.ScrollView;
const AnimatedView = Animated.View;

export function UserFormPageShell({ children, motionKey, title }: UserFormPageShellProps) {
  const scrollY = useSharedValue(0);
  const scrollRef = useRef<ComponentRef<typeof AnimatedScrollView>>(null);
  const painting = useMemo(() => getNextPainting(), []);
  const [isImageVisible, setIsImageVisible] = useState(Boolean(painting));
  const [imageSize, setImageSize] = useState(
    painting ? { height: painting.height, width: painting.width } : undefined
  );
  const { height, width } = useWindowDimensions();
  const maxExpandedHeaderHeight = Math.max(360, height - 64);
  const collapsedHeaderHeight = Math.max(150, Math.round(height * 0.2));
  const renderedImageHeight = imageSize
    ? Math.round((width * imageSize.height) / imageSize.width)
    : Math.round(height * 0.5);
  const expandedHeaderHeight = Math.min(
    Math.max(renderedImageHeight, collapsedHeaderHeight),
    maxExpandedHeaderHeight
  );
  const initialScrollOffset = isImageVisible ? expandedHeaderHeight - collapsedHeaderHeight : 0;
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });
  const imageStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, expandedHeaderHeight],
            [0, expandedHeaderHeight * 0.45],
            Extrapolation.CLAMP
          ),
        },
      ],
    }),
    [expandedHeaderHeight]
  );

  const hideFailedImage = useCallback(() => {
    setIsImageVisible(false);
    scrollY.value = 0;
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [scrollY]);

  useEffect(() => {
    setIsImageVisible(Boolean(painting));
  }, [painting]);

  useEffect(() => {
    if (!painting) {
      return;
    }

    Image.getSize(
      painting.uri,
      (imageWidth, imageHeight) => {
        setImageSize({ height: imageHeight, width: imageWidth });
        setIsImageVisible(true);
      },
      hideFailedImage
    );
  }, [hideFailedImage, painting]);

  useEffect(() => {
    if (!isImageVisible || initialScrollOffset <= 0) {
      return;
    }

    const timeoutId = setTimeout(() => {
      scrollY.value = initialScrollOffset;
      scrollRef.current?.scrollTo({ y: initialScrollOffset, animated: false });
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [initialScrollOffset, isImageVisible, scrollY]);

  return (
    <AnimatedScrollView
      testID="user-form-scroll"
      ref={scrollRef}
      className="flex-1"
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'space-between',
        paddingBottom: isImageVisible ? collapsedHeaderHeight : 0,
      }}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}>
      <MotionView
        key={motionKey}
        initial={{ opacity: 0, y: -200 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', width: '100%' }}>
        {isImageVisible && painting ? (
          <AnimatedView style={{ height: expandedHeaderHeight, overflow: 'hidden', width: '100%' }}>
            <AnimatedView
              style={[
                {
                  height: expandedHeaderHeight,
                  left: 0,
                  position: 'absolute',
                  right: 0,
                  top: 0,
                },
                imageStyle,
              ]}>
              <Image
                accessibilityIgnoresInvertColors
                onError={hideFailedImage}
                resizeMode="cover"
                source={{ uri: painting.uri }}
                style={{ height: '100%', width: '100%' }}
              />
              <View
                className="bg-solarized-base03/25"
                style={{ bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 }}
              />
            </AnimatedView>
          </AnimatedView>
        ) : null}
        <View
          className="w-full gap-[22px] p-5"
          style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: 860 }}>
          <ThemedText type="title">{title}</ThemedText>
          {children}
        </View>
      </MotionView>
    </AnimatedScrollView>
  );
}
