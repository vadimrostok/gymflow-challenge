import { useState } from 'react';

import { MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Pressable, View } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft, LinearTransition } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { formatUserBirthday } from '@/components/users/format-user-birthday';
import { FontFamily } from '@/constants/fonts';
import type { User } from '@/state/schemas/user-schema';

type UserListItemProps = {
  user: User;
  onDelete: () => void;
};

export function UserListItem({ user, onDelete }: UserListItemProps) {
  const [isDeleteTooltipVisible, setIsDeleteTooltipVisible] = useState(false);
  const birthdayLabel = formatUserBirthday(user.dateOfBirth);

  return (
    <Animated.View
      entering={FadeInRight.duration(220)}
      exiting={FadeOutLeft.duration(160)}
      layout={LinearTransition.springify().damping(18)}>
      <View className="w-full flex-row gap-3 rounded-lg border border-white bg-solarized-base2 p-3.5 dark:bg-solarized-base02">
        <Link href={`/users/${user.id}`} asChild>
          <Pressable accessibilityRole="link" className="min-h-14 flex-1 justify-center gap-1.5">
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
        </Link>
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
          className="relative h-10 w-10 items-center justify-center self-center rounded-lg border border-solarized-red bg-solarized-red active:opacity-70">
          <MaterialIcons color="#ffffff" name="delete-outline" size={20} />
          {isDeleteTooltipVisible ? (
            <View
              className="absolute bottom-[48px] left-1/2 w-24 rounded-md bg-solarized-base02 px-2 py-1.5 dark:bg-solarized-base2"
              style={{ transform: [{ translateX: -48 }] }}>
              <ThemedText
                lightColor="#fdf6e3"
                darkColor="#002b36"
                className="text-center text-xs leading-[14px]">
                delete user
              </ThemedText>
            </View>
          ) : null}
        </Pressable>
      </View>
    </Animated.View>
  );
}
