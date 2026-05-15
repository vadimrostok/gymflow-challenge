import { DateTime } from 'luxon';

import { parseDatePickerValue } from '@/components/users/user-form';

describe('parseDatePickerValue', () => {
  it('keeps ISO date strings on the same calendar day', () => {
    expect(parseDatePickerValue('2026-05-14')).toBe('2026-05-14');
  });

  it('converts JavaScript dates to ISO dates', () => {
    expect(parseDatePickerValue(new Date(2026, 4, 14, 12))).toBe('2026-05-14');
  });

  it('converts timestamps to ISO dates', () => {
    expect(parseDatePickerValue(DateTime.fromISO('2026-05-14T12:00:00.000Z').toMillis())).toBe(
      '2026-05-14'
    );
  });

  it('returns an empty string for missing values', () => {
    expect(parseDatePickerValue(undefined)).toBe('');
    expect(parseDatePickerValue(null)).toBe('');
  });
});
