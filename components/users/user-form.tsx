import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import {
  userFormSchema,
  userRoles,
  type User,
  type UserFormValues,
  type UserRole,
} from '@/state/schemas/user-schema';
import { useResolvedColorScheme } from '@/state/context/theme-mode';

type UserFormProps = {
  mode: 'create' | 'edit';
  initialUser?: User;
  onSubmit: (values: UserFormValues) => void;
  onCancel: () => void;
  onDelete?: () => void;
};

const emptyUserFormValues: UserFormValues = {
  fullName: '',
  role: 'MEMBER',
  dateOfBirth: '',
};

export function UserForm({ mode, initialUser, onSubmit, onCancel, onDelete }: UserFormProps) {
  const colorScheme = useResolvedColorScheme();
  const palette = Colors[colorScheme];
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormValues>({
    defaultValues: initialUser ?? emptyUserFormValues,
    resolver: zodResolver(userFormSchema),
  });

  return (
    <View style={styles.container}>
      <View style={styles.fieldGroup}>
        <ThemedText type="defaultSemiBold">Full Name</ThemedText>
        <Controller
          control={control}
          name="fullName"
          render={({ field: { onBlur, onChange, value } }) => (
            <TextInput
              accessibilityLabel="Full Name"
              autoCapitalize="words"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Jane Smith"
              placeholderTextColor={palette.mutedText}
              style={[
                styles.input,
                { borderColor: palette.border, color: palette.text, backgroundColor: palette.surface },
              ]}
              value={value}
            />
          )}
        />
        {errors.fullName ? <ThemedText style={styles.error}>{errors.fullName.message}</ThemedText> : null}
      </View>

      <View style={styles.fieldGroup}>
        <ThemedText type="defaultSemiBold">Role</ThemedText>
        <Controller
          control={control}
          name="role"
          render={({ field: { onChange, value } }) => (
            <View style={styles.roleRow}>
              {userRoles.map((role) => (
                <RoleButton
                  isSelected={value === role}
                  key={role}
                  onPress={() => onChange(role)}
                  role={role}
                />
              ))}
            </View>
          )}
        />
        {errors.role ? <ThemedText style={styles.error}>{errors.role.message}</ThemedText> : null}
      </View>

      <View style={styles.fieldGroup}>
        <ThemedText type="defaultSemiBold">Date of Birthday</ThemedText>
        <Controller
          control={control}
          name="dateOfBirth"
          render={({ field: { onBlur, onChange, value } }) => (
            <TextInput
              accessibilityLabel="Date of Birthday"
              inputMode="numeric"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={palette.mutedText}
              style={[
                styles.input,
                { borderColor: palette.border, color: palette.text, backgroundColor: palette.surface },
              ]}
              value={value}
            />
          )}
        />
        {errors.dateOfBirth ? (
          <ThemedText style={styles.error}>{errors.dateOfBirth.message}</ThemedText>
        ) : null}
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          onPress={handleSubmit(onSubmit)}
          style={({ pressed }) => [
            styles.primaryButton,
            { backgroundColor: palette.tint, opacity: pressed ? 0.74 : 1 },
          ]}>
          <ThemedText style={styles.primaryButtonText}>
            {mode === 'create' ? 'Create User' : 'Save Changes'}
          </ThemedText>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onCancel}
          style={({ pressed }) => [
            styles.secondaryButton,
            { borderColor: palette.border, opacity: pressed ? 0.74 : 1 },
          ]}>
          <ThemedText type="defaultSemiBold">Cancel</ThemedText>
        </Pressable>
      </View>

      {mode === 'edit' && onDelete ? (
        <Pressable
          accessibilityRole="button"
          onPress={onDelete}
          style={({ pressed }) => [
            styles.deleteButton,
            { borderColor: palette.danger, opacity: pressed ? 0.74 : 1 },
          ]}>
          <ThemedText type="defaultSemiBold" style={{ color: palette.danger }}>
            Remove User
          </ThemedText>
        </Pressable>
      ) : null}
    </View>
  );
}

type RoleButtonProps = {
  isSelected: boolean;
  onPress: () => void;
  role: UserRole;
};

function RoleButton({ isSelected, onPress, role }: RoleButtonProps) {
  const colorScheme = useResolvedColorScheme();
  const palette = Colors[colorScheme];

  return (
    <Pressable
      accessibilityLabel={role === 'STAFF' ? 'Staff' : 'Member'}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.roleButton,
        {
          backgroundColor: isSelected ? palette.tint : palette.surface,
          borderColor: isSelected ? palette.tint : palette.border,
          opacity: pressed ? 0.74 : 1,
        },
      ]}>
      <ThemedText type="defaultSemiBold" style={{ color: isSelected ? palette.onTint : palette.text }}>
        {role === 'STAFF' ? 'Staff' : 'Member'}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  container: {
    gap: 18,
    width: '100%',
  },
  deleteButton: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 48,
    justifyContent: 'center',
    marginTop: 10,
    paddingHorizontal: 18,
  },
  error: {
    color: '#dc322f',
    fontSize: 14,
    lineHeight: 20,
  },
  fieldGroup: {
    gap: 8,
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  primaryButton: {
    alignItems: 'center',
    borderRadius: 8,
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  roleButton: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minHeight: 44,
    justifyContent: 'center',
    minWidth: 120,
    paddingHorizontal: 14,
  },
  roleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  secondaryButton: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
});