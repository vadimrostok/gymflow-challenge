import { useState } from 'react';

import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';

import { AnimatePresence, MotionView } from '@/components/motion-view';
import { ThemedText } from '@/components/themed-text';
import { formatUserBirthday } from '@/components/users/format-user-birthday';
import { FontFamily } from '@/constants/fonts';
import { useAppNavigation } from '@/navigation/use-app-navigation';
import type { User } from '@/state/schemas/user-schema';

type UserListItemProps = {
  user: User;
  isLast?: boolean;
  onDelete: () => void;
};

export function UserListItem({ user, isLast = false, onDelete }: UserListItemProps) {
  const navigation = useAppNavigation();
  const [isDeleteTooltipVisible, setIsDeleteTooltipVisible] = useState(false);
  const birthdayLabel = formatUserBirthday(user.dateOfBirth);

  return (
    <MotionView
      layout
      initial={{ opacity: 0, y: -28 }}
      animate={{ opacity: 1, y: 0, height: 'auto', marginBottom: isLast ? 0 : 12 }}
      exit={{
        opacity: 0,
        height: 0,
        marginBottom: 0,
        transition: {
          opacity: { duration: 0.18 },
          height: { delay: 0.18, duration: 0.32, ease: [0.4, 0, 0.2, 1] },
          marginBottom: { delay: 0.18, duration: 0.32 },
        },
      }}
      transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
      style={{ overflow: 'visible' }}>
      <View className="relative w-full rounded-lg">
        <Pressable
          accessibilityRole="link"
          onPress={() => navigation.toEditUser(user.id)}
          className="min-h-[86px] w-full justify-center gap-1.5 rounded-lg border border-white bg-solarized-base2 py-3.5 pl-3.5 pr-[70px] transition-colors duration-500 active:opacity-80 dark:border-[#31565f] dark:bg-solarized-base02">
          <View className="flex-row flex-wrap items-center gap-2">
            <ThemedText
              type="defaultSemiBold"
              className="shrink leading-[22px]"
              style={{ fontFamily: FontFamily.bold }}>
              {user.fullName}
            </ThemedText>
            <View className="rounded-lg bg-[#f4e7b5] px-2.5 py-1 dark:bg-[#3a3f2c]">
              <ThemedText
                type="defaultSemiBold"
                lightColor="#b58900"
                darkColor="#b58900"
                className="text-[13px] leading-4 text-solarized-yellow"
                style={{ fontFamily: FontFamily.italic }}>
                {user.role === 'STAFF' ? 'Staff' : 'Member'}
              </ThemedText>
            </View>
          </View>
          <ThemedText lightColor="#586e75" darkColor="#93a1a1">
            {birthdayLabel}
          </ThemedText>
        </Pressable>
        <Pressable
          accessibilityLabel={`Remove ${user.fullName}`}
          accessibilityHint="Delete user"
          accessibilityRole="button"
          hitSlop={6}
          onBlur={() => setIsDeleteTooltipVisible(false)}
          onPress={onDelete}
          onFocus={() => setIsDeleteTooltipVisible(true)}
          onHoverIn={() => setIsDeleteTooltipVisible(true)}
          onHoverOut={() => setIsDeleteTooltipVisible(false)}
          className="absolute right-3.5 top-1/2 h-10 w-10 items-center justify-center rounded-full border border-solarized-red bg-solarized-red hover:border-[#b91c1c] hover:bg-[#b91c1c] active:opacity-70"
          style={{ transform: [{ translateY: -20 }] }}>
          <MaterialIcons color="#ffffff" name="delete-outline" size={20} />
          <AnimatePresence>
            {isDeleteTooltipVisible ? (
              <MotionView
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute right-[48px] top-1/2 w-24 -translate-y-1/2 rounded-md bg-solarized-base02 px-2 py-1.5 dark:bg-solarized-base2">
                <ThemedText
                  lightColor="#fdf6e3"
                  darkColor="#002b36"
                  className="text-center text-xs leading-[14px]">
                  Delete user
                </ThemedText>
              </MotionView>
            ) : null}
          </AnimatePresence>
        </Pressable>
      </View>
    </MotionView>
  );
}
