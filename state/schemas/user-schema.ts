import { DateTime } from 'luxon';
import { z } from 'zod';

export const userRoles = ['STAFF', 'MEMBER'] as const;

export type UserRole = (typeof userRoles)[number];

export const USER_FORM_ERROR_MESSAGES = {
  fullNameMin: 'Full name must be at least 3 characters.',
  fullNameMax: 'Full name must be 50 characters or less.',
  roleRequired: 'Choose Staff or Member role.',
  dateInvalid: 'Date of birthday must be a valid ISO date.',
} as const;

export const userFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, USER_FORM_ERROR_MESSAGES.fullNameMin)
    .max(50, USER_FORM_ERROR_MESSAGES.fullNameMax),
  role: z
    .enum(userRoles, { message: USER_FORM_ERROR_MESSAGES.roleRequired })
    .refine((role) => userRoles.includes(role as UserRole), USER_FORM_ERROR_MESSAGES.roleRequired),
  dateOfBirth: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || DateTime.fromISO(value, { zone: 'utc' }).isValid,
      USER_FORM_ERROR_MESSAGES.dateInvalid
    ),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

export type User = UserFormValues & {
  /**
   * ID stands for identifier. It is generated locally in this iteration and will map to storage
   * records when SQLite/Supabase repositories are added.
   */
  id: string;
  // TODO: should we try Date type here?
  updatedAt: string;
  createdAt: string;
};

export function createTimestamp() {
  return DateTime.utc().toISO();
}

export function createLocalUserId() {
  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}