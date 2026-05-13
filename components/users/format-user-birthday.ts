import { DateTime } from 'luxon';

/**
 * Hardcoded UK locale to awoid flickering locale switching when user list loads.
 */
const userBirthdayLocale = 'UTC';

export function formatUserBirthday(dateOfBirth?: string) {
  if (!dateOfBirth) {
    return 'No birthday set';
  }

  return DateTime
    .fromISO(dateOfBirth)
    .toFormat('dd LLL yyyy', { locale: userBirthdayLocale });
}