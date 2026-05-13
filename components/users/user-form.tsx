import { zodResolver } from '@hookform/resolvers/zod';
import { DateTime } from 'luxon';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, TextInput, View } from 'react-native';
import { useMemo, useRef } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker, { DateType, useDefaultStyles, useDefaultClassNames } from 'react-native-ui-datepicker';
import { z } from 'zod';

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

const emptyUserFormValues: UserFormValues = {
  fullName: '',
  role: '' as UserRole, // Disabled for new users to showcase validation
  dateOfBirth: '',
};

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

function toISODate(date: DateType) {
  if (!date) {
    return '';
  }

  if (date instanceof Date) {
    return DateTime.fromJSDate(date, { zone: 'utc' }).toISODate() ?? '';
  }

  if (typeof date === 'number') {
    return DateTime.fromMillis(date, { zone: 'utc' }).toISODate() ?? '';
  }

  if (typeof date === 'string') {
    return DateTime.fromISO(date, { zone: 'utc' }).toISODate() ?? '';
  }

  return DateTime.fromISO(date.format('YYYY-MM-DD'), { zone: 'utc' }).toISODate() ?? '';
}

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

  const now = useRef<Date>(new Date());
  const defaultDatePickerStyles = useDefaultStyles();
  const defaultClassNames = useDefaultClassNames();
  const datePickerStyles = useMemo(
    () => ({
      ...defaultDatePickerStyles,
      button_next_image: { tintColor: palette.text },
      button_prev_image: { tintColor: palette.text },
      day_label: { color: palette.text },
      disabled_label: { color: palette.mutedText },
      month_label: { color: palette.text },
      month_selector_label: { color: palette.text },
      outside_label: { color: palette.mutedText },
      selected: {
        backgroundColor: palette.primaryButtonBackground,
        borderColor: palette.primaryButtonBackground,
      },
      selected_label: { color: palette.primaryButtonText },
      selected_month: {
        backgroundColor: palette.primaryButtonBackground,
        borderColor: palette.primaryButtonBackground,
      },
      selected_month_label: { color: palette.primaryButtonText },
      selected_year: {
        backgroundColor: palette.primaryButtonBackground,
        borderColor: palette.primaryButtonBackground,
      },
      selected_year_label: { color: palette.primaryButtonText },
      time_label: { color: palette.text },
      today_label: { color: palette.accent },
      weekday_label: { color: palette.mutedText },
      year_label: { color: palette.text },
      year_selector_label: { color: palette.text },
    }),
    [defaultDatePickerStyles, palette]
  );

  return (
    <View className="w-full gap-6">
      <View className="gap-2">
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
              className="min-h-12 rounded-lg border border-solarized-base1 bg-solarized-base2 px-3.5 text-base text-solarized-base02 dark:border-solarized-base01 dark:bg-solarized-base02 dark:text-solarized-base2"
              value={value}
            />
          )}
        />
        {errors.fullName ? (
          <ThemedText lightColor="#dc322f" darkColor="#dc322f" className="text-sm leading-5">
            {errors.fullName.message}
          </ThemedText>
        ) : null}
      </View>

      <View className="gap-2">
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
              /*style={{
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
              }}*/
              testID="role-picker"
              value={value}
            />
          )}
        />
        {errors.role ? (
          <ThemedText lightColor="#dc322f" darkColor="#dc322f" className="text-sm leading-5">
            {errors.role.message}
          </ThemedText>
        ) : null}
      </View>

      <View className="w-full gap-2 lg:max-w-[50%]">
        <ThemedText type="defaultSemiBold">Date of Birthday</ThemedText>
        <Controller
          control={control}
          name="dateOfBirth"
          render={({ field: { onChange, value } }) => (
            <DateTimePicker
              className="rounded-lg border border-solarized-base1 bg-solarized-base2 p-3 dark:border-solarized-base01 dark:bg-solarized-base02"
              mode="single"
              date={getDefaultDatePickerValue(value)}
              timeZone="UTC"
              onChange={({ date }) => onChange(parseDatePickerValue(date))}
              styles={datePickerStyles}
              maxDate={now.current}
              classNames={{
                ...defaultClassNames,
                active_year_label: 'text-solarized-base02 dark:text-solarized-base2',
                day: `${defaultClassNames.day} hover:bg-[#f4e7b5] dark:hover:bg-[#3a3f2c]`,
                day_label: `${defaultClassNames.day_label} text-solarized-base02 dark:text-solarized-base2`,
                disabled: 'opacity-40',
                disabled_label: 'text-solarized-base1 dark:text-solarized-base01',
                month_label: 'text-solarized-base02 dark:text-solarized-base2',
                month_selector_label: 'text-lg font-semibold text-solarized-base02 dark:text-solarized-base2',
                outside_label: 'text-solarized-base1 dark:text-solarized-base01',
                selected: 'border-gymflow-primary bg-gymflow-primary dark:border-gymflow-primaryDark dark:bg-gymflow-primaryDark',
                selected_label: 'font-bold text-white dark:text-solarized-base03',
                selected_month_label: 'font-bold text-white dark:text-solarized-base03',
                selected_year_label: 'font-bold text-white dark:text-solarized-base03',
                time_label: 'text-solarized-base02 dark:text-solarized-base2',
                time_selected_indicator: 'bg-solarized-base2 dark:bg-solarized-base02',
                today: 'border-solarized-yellow',
                today_label: 'text-solarized-yellow',
                weekday_label: 'text-sm uppercase text-solarized-base01 dark:text-solarized-base1',
                year_label: 'text-solarized-base02 dark:text-solarized-base2',
                year_selector_label: 'text-lg font-semibold text-solarized-base02 dark:text-solarized-base2',
              }}
            />
          )}
        />
        {errors.dateOfBirth ? (
          <ThemedText lightColor="#dc322f" darkColor="#dc322f" className="text-sm leading-5">
            {errors.dateOfBirth.message}
          </ThemedText>
        ) : null}
      </View>

      <View className="mt-2 flex-row flex-wrap gap-3">
        <Pressable
          accessibilityRole="button"
          onPress={handleSubmit((values) => onSubmit({ ...values, role: values.role as UserRole }))}
          className="min-h-12 items-center justify-center rounded-lg bg-gymflow-primary px-[18px] active:opacity-75 dark:bg-gymflow-primaryDark"
          /*style={({ pressed }) => [
            styles.primaryButton,
            { backgroundColor: palette.primaryButtonBackground, opacity: pressed ? 0.74 : 1 },
          ]}>*/
        >
          <ThemedText
            /*style={[styles.primaryButtonText, { color: palette.primaryButtonText }]}*/
            lightColor="#ffffff" darkColor="#002b36" className="font-bold">
            {mode === 'create' ? 'Create User' : 'Save Changes'}
          </ThemedText>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onCancel}
          className="min-h-12 items-center justify-center rounded-lg border border-solarized-base1 px-[18px] active:opacity-75 dark:border-solarized-base01">
          <ThemedText type="defaultSemiBold">Cancel</ThemedText>
        </Pressable>
        {mode === 'edit' && onDelete ? (
          <Pressable
            accessibilityRole="button"
            onPress={onDelete}
            className="min-h-12 items-center justify-center rounded-lg bg-solarized-red px-[18px] active:opacity-75">
            <ThemedText type="defaultSemiBold" lightColor="#ffffff" darkColor="#ffffff">
              Remove User
            </ThemedText>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

/*
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
});*/