import { Modal, Pressable, View } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';

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
  return (
    <Modal transparent visible={isVisible} animationType="none" onRequestClose={onCancel}>
      <Animated.View
        entering={FadeIn.duration(120)}
        exiting={FadeOut.duration(100)}
        style={{ flex: 1 }}>
        <View className="flex-1 items-center justify-center bg-black/25 px-5">
          <Animated.View entering={ZoomIn.duration(160)} exiting={ZoomOut.duration(100)}>
            <View className="w-full max-w-[380px] gap-4 rounded-lg border border-white bg-solarized-base3 p-5 shadow-lg dark:bg-solarized-base02">
              <View className="gap-2">
                <ThemedText type="subtitle">Remove user?</ThemedText>
                <ThemedText lightColor="#586e75" darkColor="#93a1a1">
                  {userName
                    ? `${userName} will disappear from the user list.`
                    : 'This user will disappear from the user list.'}
                </ThemedText>
              </View>
              <View className="flex-row flex-wrap justify-end gap-3">
                <Pressable
                  accessibilityRole="button"
                  onPress={onCancel}
                  className="min-h-11 items-center justify-center rounded-lg border border-solarized-base1 px-4 active:opacity-75 dark:border-solarized-base01">
                  <ThemedText type="defaultSemiBold">Cancel</ThemedText>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={onConfirm}
                  className="min-h-11 items-center justify-center rounded-lg bg-solarized-red px-4 active:opacity-75">
                  <ThemedText type="defaultSemiBold" lightColor="#ffffff" darkColor="#ffffff">
                    Remove
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          </Animated.View>
        </View>
      </Animated.View>
    </Modal>
  );
}
