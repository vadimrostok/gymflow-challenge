import { DateTime } from 'luxon';
import { z } from 'zod';

export const userRoles = ['STAFF', 'MEMBER'] as const;

export type UserRole = (typeof userRoles)[number];

export const userFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, 'Full name must be at least 3 characters.')
    .max(50, 'Full name must be 50 characters or less.'),
  role: z.enum(userRoles, { message: 'Choose Staff or Member.' }),
  dateOfBirth: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || DateTime.fromISO(value, { zone: 'utc' }).isValid,
      'Date of birthday must be a valid ISO date.'
    ),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

export type User = UserFormValues & {
  /**
   * ID stands for identifier. It is generated locally in this iteration and will map to storage
   * records when SQLite/Supabase repositories are added.
   */
  id: string;
  updatedAt: string;
};

export function createTimestamp() {
  return DateTime.utc().toISO();
}

export function createLocalUserId() {
  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

