import { zodResolver } from '@hookform/resolvers/zod';
import RNPickerSelect from 'react-native-picker-select';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useRef } from 'react';
import DateTimePicker, { DateType, useDefaultStyles, useDefaultClassNames } from 'react-native-ui-datepicker';
import { z } from 'zod';
import { DateTime } from 'luxon';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import {
  userFormSchema,
  USER_FORM_ERROR_MESSAGES,
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

const emptyUserFormValues: UserFormInputValues = {
  fullName: '',
  role: '',
  dateOfBirth: '',
};

type UserFormInputValues = Omit<UserFormValues, 'role'> & {
  role: UserRole | '';
};

const userFormInputSchema = userFormSchema.extend({
  role: z
    .string()
    .refine((role) => userRoles.includes(role as UserRole), USER_FORM_ERROR_MESSAGES.roleRequired),
});

function getDefaultDatePickerValue(value: string) {
  return value || undefined;
}

function parseDatePickerValue(date: DateType) {
  if (!date) {
    return '';
  }

  if (typeof date === 'string') {
    const parsedDate = DateTime.fromISO(date, { zone: 'utc' });

    return parsedDate.isValid ? parsedDate.toISODate() ?? '' : date;
  }

  if (typeof date === 'number') {
    return DateTime.fromMillis(date, { zone: 'utc' }).toISODate() ?? '';
  }

  if (date instanceof Date) {
    return DateTime.fromJSDate(date, { zone: 'utc' }).toISODate() ?? '';
  }

  if (!('toDate' in date) || typeof date.toDate !== 'function') {
    return '';
  }

  return DateTime.fromJSDate(date.toDate(), { zone: 'utc' }).toISODate() ?? '';
}

export function UserForm({ mode, initialUser, onSubmit, onCancel, onDelete }: UserFormProps) {
  const colorScheme = useResolvedColorScheme();
  const palette = Colors[colorScheme];
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormInputValues>({
    defaultValues: initialUser ?? emptyUserFormValues,
    resolver: zodResolver(userFormInputSchema),
  });

  const now = useRef<Date>(new Date());
  const datePickerStyles = useDefaultStyles();
  const defaultClassNames = useDefaultClassNames();

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
            <RNPickerSelect
              items={userRoles.map((role) => ({
                label: role === 'STAFF' ? 'Staff' : 'Member',
                value: role,
              }))}
              onValueChange={(selectedRole) => {
                onChange(selectedRole ?? '');
              }}
              placeholder={
                mode === 'create'
                  ? { label: 'Choose role', value: '', color: palette.mutedText }
                  : {}
              }
              style={{
                inputIOS: [
                  styles.pickerInput,
                  { color: palette.text, backgroundColor: palette.surface, borderColor: palette.border },
                ],
                inputAndroid: [
                  styles.pickerInput,
                  { color: palette.text, backgroundColor: palette.surface, borderColor: palette.border },
                ],
                inputWeb: [
                  styles.pickerInput,
                  { color: palette.text, backgroundColor: palette.surface, borderColor: palette.border },
                ],
                placeholder: { color: palette.mutedText, fontStyle: 'italic' },
              }}
              testID="role-picker"
              value={value}
            />
          )}
        />
        {errors.role ? <ThemedText style={styles.error}>{errors.role.message}</ThemedText> : null}
      </View>

      <View style={styles.narrowFieldGroup}>
        <ThemedText type="defaultSemiBold">Date of Birthday</ThemedText>
        <Controller
          control={control}
          name="dateOfBirth"
          render={({ field: { onChange, value } }) => (
            <DateTimePicker
              mode="single"
              date={getDefaultDatePickerValue(value)}
              timeZone="UTC"
              onChange={({ date }) => onChange(parseDatePickerValue(date))}
              styles={datePickerStyles}
              maxDate={now.current}
              classNames={{
                today: 'border-amber-500', // Add a border to today's date
                selected: 'bg-amber-500 border-amber-500', // Highlight the selected day
                selected_label: "text-white", // Highlight the selected day label
                day: `${defaultClassNames.day} hover:bg-amber-100`, // Change background color on hover
                disabled: 'opacity-50', // Make disabled dates appear more faded
              }}
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
          onPress={handleSubmit((values) => onSubmit({ ...values, role: values.role as UserRole }))}
          style={({ pressed }) => [
            styles.primaryButton,
            { backgroundColor: palette.primaryButtonBackground, opacity: pressed ? 0.74 : 1 },
          ]}>
          <ThemedText style={[styles.primaryButtonText, { color: palette.primaryButtonText }]}>
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
  narrowFieldGroup: {
    maxWidth: '50%',
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
    fontWeight: '700',
  },
  pickerInput: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12,
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
