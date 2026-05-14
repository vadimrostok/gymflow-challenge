import { useEffect, useState } from 'react';
import { Modal, Pressable, View } from 'react-native';

import { AnimatePresence, MotionView } from '@/components/motion-view';
import { ThemedText } from '@/components/themed-text';
import { Colors, SharedColors } from '@/constants/theme';

type DeleteUserDialogProps = {
  isVisible: boolean;
  userName?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteUserDialog({
  isVisible,
  userName,
  onCancel,
  onConfirm,
}: DeleteUserDialogProps) {
  const [isMounted, setIsMounted] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setIsMounted(true);
      return;
    }

    const timeoutId = setTimeout(() => setIsMounted(false), 180);

    return () => clearTimeout(timeoutId);
  }, [isVisible]);

  return (
    <Modal transparent visible={isMounted} animationType="none" onRequestClose={onCancel}>
      <AnimatePresence>
        {isVisible ? (
          <MotionView
            key="delete-user-dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            style={{ height: '100%', width: '100%' }}>
            <View
              className="items-center justify-center bg-black/25 px-5 transition-colors duration-500"
              style={{
                backdropFilter: 'blur(6px)',
                bottom: 0,
                left: 0,
                position: 'absolute',
                right: 0,
                top: 0,
              }}>
              <MotionView
                initial={{ opacity: 0, scale: 0.96, y: -16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -16 }}
                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                style={{ width: '100%', maxWidth: 380 }}>
                <View className="w-full gap-4 rounded-lg border border-white bg-solarized-base3 p-5 shadow-lg transition-colors duration-500 dark:bg-solarized-base02">
                  <View className="gap-2">
                    <ThemedText type="subtitle">Remove user?</ThemedText>
                    <ThemedText lightColor={Colors.light.mutedText} darkColor={Colors.dark.mutedText}>
                      {userName
                        ? `${userName} will disappear from the user list.`
                        : 'This user will disappear from the user list.'}
                    </ThemedText>
                  </View>
                  <View className="flex-row flex-wrap justify-end gap-3">
                    <Pressable
                      testID="delete-user-dialog-cancel"
                      accessibilityRole="button"
                      onPress={onCancel}
                      className="min-h-11 items-center justify-center rounded-lg border border-solarized-base1 px-4 hover:bg-gymflow-mutedHover active:opacity-75 dark:border-solarized-base01 dark:hover:bg-gymflow-mutedHoverDark">
                      <ThemedText type="defaultSemiBold">Cancel</ThemedText>
                    </Pressable>
                    <Pressable
                      testID="delete-user-dialog-confirm"
                      accessibilityRole="button"
                      onPress={onConfirm}
                      className="min-h-11 items-center justify-center rounded-lg bg-solarized-red px-4 hover:bg-gymflow-dangerHover active:opacity-75">
                      <ThemedText
                        type="defaultSemiBold"
                        lightColor={SharedColors.white}
                        darkColor={SharedColors.white}>
                        Remove
                      </ThemedText>
                    </Pressable>
                  </View>
                </View>
              </MotionView>
            </View>
          </MotionView>
        ) : null}
      </AnimatePresence>
    </Modal>
  );
}
