import { Link } from 'expo-router';
import { DateTime } from 'luxon';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import type { User } from '@/state/schemas/user-schema';
import { useResolvedColorScheme } from '@/state/context/theme-mode';

type UserListItemProps = {
  user: User;
  onDelete: () => void;
};

export function UserListItem({ user, onDelete }: UserListItemProps) {
  const colorScheme = useResolvedColorScheme();
  const palette = Colors[colorScheme];
  const birthdayLabel = user.dateOfBirth
    ? DateTime.fromISO(user.dateOfBirth).toLocaleString(DateTime.DATE_MED)
    : 'No birthday set';

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
        accessibilityRole="button"
        onPress={onDelete}
        style={({ pressed }) => [
          styles.deleteButton,
          { borderColor: palette.danger, opacity: pressed ? 0.72 : 1 },
        ]}>
        <ThemedText type="defaultSemiBold" style={{ color: palette.danger }}>
          Remove
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
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
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: 12,
  },
  name: {
    flex: 1,
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
});