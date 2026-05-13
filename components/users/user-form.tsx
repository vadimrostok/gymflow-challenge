import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialIcons } from '@expo/vector-icons';
import { DateTime } from 'luxon';
import { Controller, useForm } from 'react-hook-form';
import { Platform, Pressable, TextInput, View } from 'react-native';
import { useMemo, useRef, useState } from 'react';
import RNPickerSelect, { type PickerStyle } from 'react-native-picker-select';
import DateTimePicker, { DateType, useDefaultStyles, useDefaultClassNames } from 'react-native-ui-datepicker';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import {
  userFormSchema,
  userRoleOptions,
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

export function UserForm({ mode, initialUser, onSubmit, onCancel, onDelete }: UserFormProps) {
  const colorScheme = useResolvedColorScheme();
  const palette = Colors[colorScheme];
  const [isDeleteTooltipVisible, setIsDeleteTooltipVisible] = useState(false);
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
  const datePickerEmphasisColor = colorScheme === 'dark' ? palette.accent : '#6c71c4';
  const datePickerSelectorBackground = colorScheme === 'dark' ? '#002f3b' : '#e2dcc9';
  const formBorderColor = colorScheme === 'dark' ? '#31565f' : '#ffffff';
  const datePickerStyles = useMemo(
    () => ({
      ...defaultDatePickerStyles,
      button_next_image: { tintColor: palette.text },
      button_prev_image: { tintColor: palette.text },
      day_label: { color: palette.text },
      disabled_label: { color: palette.mutedText },
      month_label: {
        color: palette.text,
        fontWeight: '600',
      },
      month_selector: {
        backgroundColor: datePickerSelectorBackground,
        borderRadius: 8,
        marginRight: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
      },
      month_selector_label: {
        color: datePickerEmphasisColor,
        fontSize: 17,
        fontWeight: '700',
      },
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
      selected_month_label: {
        color: palette.primaryButtonText,
        fontWeight: '700',
      },
      active_year_label: {
        color: datePickerEmphasisColor,
        fontWeight: '700',
      },
      selected_year: {
        backgroundColor: palette.primaryButtonBackground,
        borderColor: palette.primaryButtonBackground,
      },
      selected_year_label: {
        color: palette.primaryButtonText,
        fontWeight: '700',
      },
      time_label: { color: palette.text },
      today_label: { color: palette.accent },
      weekday_label: { color: palette.mutedText },
      year_label: {
        color: palette.text,
        fontWeight: '600',
      },
      year_selector: {
        backgroundColor: datePickerSelectorBackground,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
      },
      year_selector_label: {
        color: datePickerEmphasisColor,
        fontSize: 17,
        fontWeight: '700',
      },
    }),
    [datePickerEmphasisColor, datePickerSelectorBackground, defaultDatePickerStyles, palette]
  );
  const pickerStyles = useMemo<PickerStyle>(() => {
    const pickerInput = {
      backgroundColor: palette.surface,
      borderColor: formBorderColor,
      borderRadius: 8,
      borderWidth: 1,
      color: palette.text,
      fontSize: 16,
      minHeight: 48,
      paddingHorizontal: 14,
      paddingRight: 42,
      paddingVertical: 12,
      width: '100%',
    };

    return {
      viewContainer: {
        alignSelf: 'stretch',
        width: '100%',
      },
      inputIOS: pickerInput,
      inputAndroid: pickerInput,
      inputWeb: {
        ...pickerInput,
        outlineColor: palette.primaryButtonBackground,
      },
      placeholder: {
        color: palette.mutedText,
      },
      iconContainer: {
        pointerEvents: 'none' as const,
        right: 12,
        top: 13,
      },
    };
  }, [formBorderColor, palette]);

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
              className="min-h-12 rounded-lg border border-white bg-solarized-base2 px-3.5 text-base text-solarized-base02 dark:border-[#31565f] dark:bg-solarized-base02 dark:text-solarized-base2"
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
              Icon={
                Platform.OS === 'web'
                  ? undefined
                  : () => (
                      <MaterialIcons
                        color={palette.mutedText}
                        name="keyboard-arrow-down"
                        size={22}
                      />
                    )
              }
              items={userRoleOptions}
              onValueChange={(selectedRole) => {
                onChange(selectedRole ?? '');
              }}
              placeholder={
                mode === 'create'
                  ? { label: 'Choose role', value: '', color: palette.mutedText }
                  : {}
              }
              pickerProps={{ testID: 'role-picker' }}
              style={pickerStyles}
              useNativeAndroidPickerStyle={false}
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
              className="rounded-lg border border-white bg-solarized-base2 p-3 dark:border-[#31565f] dark:bg-solarized-base02"
              mode="single"
              date={getDefaultDatePickerValue(value ?? '')}
              timeZone="UTC"
              onChange={({ date }) => onChange(parseDatePickerValue(date))}
              styles={datePickerStyles}
              maxDate={now.current}
              classNames={{
                ...defaultClassNames,
                day: `${defaultClassNames.day} hover:bg-[#f4e7b5] dark:hover:bg-[#3a3f2c]`,
                day_label: `${defaultClassNames.day_label} text-solarized-base02 dark:text-solarized-base2`,
                disabled: 'opacity-40',
                disabled_label: 'text-solarized-base1 dark:text-solarized-base01',
                month_label: 'font-semibold',
                month_selector: 'mr-2 rounded-lg bg-[#e2dcc9] px-2.5 py-1 dark:bg-[#002f3b]',
                month_selector_label: 'text-xl font-bold',
                outside_label: 'text-solarized-base1 dark:text-solarized-base01',
                selected: 'border-gymflow-primary bg-gymflow-primary dark:border-gymflow-primaryDark dark:bg-gymflow-primaryDark',
                selected_label: 'font-bold',
                selected_month_label: 'font-bold',
                selected_year_label: 'font-bold',
                time_label: 'text-solarized-base02 dark:text-solarized-base2',
                time_selected_indicator: 'bg-solarized-base2 dark:bg-solarized-base02',
                today: 'border-solarized-yellow',
                today_label: 'text-solarized-yellow',
                weekday_label: 'text-sm uppercase text-solarized-base01 dark:text-solarized-base1',
                year_label: 'font-semibold',
                year_selector: 'rounded-lg bg-[#e2dcc9] px-2.5 py-1 dark:bg-[#002f3b]',
                year_selector_label: 'text-xl font-bold',
                active_year_label: 'font-semibold',
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
          className="min-h-12 items-center justify-center rounded-lg bg-gymflow-primary px-[18px] active:opacity-75 dark:bg-gymflow-primaryDark">
          <ThemedText lightColor="#ffffff" darkColor="#002b36" className="font-bold">
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
            onBlur={() => setIsDeleteTooltipVisible(false)}
            onFocus={() => setIsDeleteTooltipVisible(true)}
            onHoverIn={() => setIsDeleteTooltipVisible(true)}
            onHoverOut={() => setIsDeleteTooltipVisible(false)}
            onPress={onDelete}
            className="relative min-h-12 flex-row items-center justify-center gap-2 rounded-lg bg-solarized-red px-[18px] active:opacity-75">
            <MaterialIcons color="#ffffff" name="delete-outline" size={18} />
            <ThemedText type="defaultSemiBold" lightColor="#ffffff" darkColor="#ffffff">
              Remove User
            </ThemedText>
            {isDeleteTooltipVisible ? (
              <View
                className="absolute bottom-[56px] left-1/2 w-24 rounded-md bg-solarized-base02 px-2 py-1.5 dark:bg-solarized-base2"
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
        ) : null}
      </View>
    </View>
  );
}