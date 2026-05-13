import { useState } from 'react';

import { MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { formatUserBirthday } from '@/components/users/format-user-birthday';
import { Colors } from '@/constants/theme';
import type { User } from '@/state/schemas/user-schema';
import { useResolvedColorScheme } from '@/state/context/theme-mode';

type UserListItemProps = {
  user: User;
  onDelete: () => void;
};

export function UserListItem({ user, onDelete }: UserListItemProps) {
  const [isDeleteTooltipVisible, setIsDeleteTooltipVisible] = useState(false);
  const colorScheme = useResolvedColorScheme();
  const palette = Colors[colorScheme];
  const birthdayLabel = formatUserBirthday(user.dateOfBirth);

  return (
    <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.border }]}>
      <Link href={`/users/${user.id}`} asChild>
        <Pressable accessibilityRole="link" style={styles.content}>
          <View style={styles.nameRow}>
            <ThemedText type="defaultSemiBold" style={styles.name}>
              {user.fullName}
            </ThemedText>
            <View style={[styles.rolePill, { backgroundColor: palette.accentSoft }]}>
              <ThemedText type="defaultSemiBold" style={[styles.roleText, { color: palette.accent }]}>
                {user.role === 'STAFF' ? 'Staff' : 'Member'}
              </ThemedText>
            </View>
          </View>
          <ThemedText style={{ color: palette.mutedText }}>{birthdayLabel}</ThemedText>
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
        style={({ pressed }) => [
          styles.deleteButton,
          { backgroundColor: palette.danger, borderColor: palette.danger, opacity: pressed ? 0.72 : 1 },
        ]}>
        <MaterialIcons color="#ffffff" name="delete-outline" size={20} />
        {isDeleteTooltipVisible ? (
          <View style={[styles.tooltip, { backgroundColor: palette.text }]}>
            <ThemedText style={[styles.tooltipText, { color: palette.background }]}>delete user</ThemedText>
          </View>
        ) : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  content: {
    flex: 1,
    gap: 6,
  },
  deleteButton: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 8,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    position: 'relative',
    width: 40,
  },
  name: {
    flexShrink: 1,
    lineHeight: 22,
  },
  nameRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  rolePill: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  roleText: {
    fontSize: 13,
    lineHeight: 16,
  },
  tooltip: {
    borderRadius: 6,
    bottom: 46,
    paddingHorizontal: 8,
    paddingVertical: 5,
    position: 'absolute',
    right: 0,
    width: 82,
  },
  tooltipText: {
    fontSize: 12,
    lineHeight: 14,
    textAlign: 'center',
  },
});