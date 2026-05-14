import type { PropsWithChildren } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { motion, useSpring, useScroll, useTransform } from 'motion/react';

import { usePageScroll } from '@/components/page-scroll-context';
import { ThemedText } from '@/components/themed-text';
import { getNextPainting } from '@/constants/paintings';

type UserFormPageShellProps = PropsWithChildren<{
  motionKey: string;
  title: string;
}>;

export function UserFormPageShell({ children, motionKey, title }: UserFormPageShellProps) {
  const pageScroll = usePageScroll();
  const painting = useMemo(() => getNextPainting(), []);
  const [isImageVisible, setIsImageVisible] = useState(Boolean(painting));
  const { height, width } = useWindowDimensions();
  const maxExpandedHeaderHeight = Math.max(360, height - 64);
  const collapsedHeaderHeight = Math.max(150, Math.round(height * 0.2));
  const renderedImageHeight = painting
    ? Math.round((width * painting.height) / painting.width)
    : Math.round(height * 0.5);
  const expandedHeaderHeight = Math.min(
    Math.max(renderedImageHeight, collapsedHeaderHeight),
    maxExpandedHeaderHeight
  );
  const initialScrollOffset = isImageVisible ? expandedHeaderHeight - collapsedHeaderHeight : 0;
  const { scrollY } = useScroll(
    pageScroll?.scrollRef ? { container: pageScroll.scrollRef } : undefined
  );
  const stiffImageY = useTransform(scrollY, [0, expandedHeaderHeight], [0, expandedHeaderHeight * 0.45]);
  const imageY = useSpring(stiffImageY, {
    stiffness: 100,
    damping: 20,
  });

  useEffect(() => {
    setIsImageVisible(Boolean(painting));
  }, [painting]);

  useEffect(() => {
    if (!isImageVisible || initialScrollOffset <= 0) {
      return;
    }

    const frameId = requestAnimationFrame(() => {
      if (pageScroll?.scrollRef.current) {
        pageScroll.scrollRef.current.scrollTop = initialScrollOffset;
        return;
      }

      window.scrollTo({ top: initialScrollOffset });
    });

    return () => cancelAnimationFrame(frameId);
  }, [initialScrollOffset, isImageVisible, pageScroll?.scrollRef]);

  function hideFailedImage() {
    setIsImageVisible(false);

    if (pageScroll?.scrollRef.current) {
      pageScroll.scrollRef.current.scrollTop = 0;
      return;
    }

    window.scrollTo({ top: 0 });
  }

  return (
    <div
      style={{
        minHeight: '100%',
        width: '100%',
      }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: '100%',
          paddingBottom: isImageVisible ? collapsedHeaderHeight : 0,
        }}>
        <motion.div
          key={motionKey}
          initial={{ opacity: 0, y: -200 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', width: '100%' }}>
          {isImageVisible && painting ? (
            <div
              style={{
                height: expandedHeaderHeight,
                overflow: 'hidden',
                position: 'relative',
                width: '100%',
              }}>
              <motion.div
                style={{
                  height: expandedHeaderHeight,
                  inset: 0,
                  position: 'absolute',
                  willChange: 'transform',
                  y: imageY,
                }}>
                <img
                  alt=""
                  onError={hideFailedImage}
                  src={painting.uri}
                  style={{
                    display: 'block',
                    height: '100%',
                    objectFit: 'cover',
                    width: '100%',
                  }}
                />
                <div
                  className="bg-solarized-base03/25"
                  style={{ inset: 0, position: 'absolute' }}
                />
              </motion.div>
            </div>
          ) : null}
          <View
            className="w-full gap-[22px] p-5"
            style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: 860 }}>
            <ThemedText type="title">{title}</ThemedText>
            {children}
          </View>
        </motion.div>
      </div>
    </div>
  );
}
