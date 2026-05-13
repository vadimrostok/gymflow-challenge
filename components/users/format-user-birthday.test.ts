import { formatUserBirthday } from '@/components/users/format-user-birthday';

describe('formatUserBirthday', () => {
  it('formats birthdays deterministically instead of relying on the runtime locale', () => {
    expect(formatUserBirthday('1918-08-26')).toBe('26 Aug 1918');
  });

  it('falls back when a user has no birthday', () => {
    expect(formatUserBirthday('')).toBe('No birthday set');
    expect(formatUserBirthday()).toBe('No birthday set');
  });
});
