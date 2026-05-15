import { parsePreferences, preferencesKey } from '@/state/storage/preferences-utils';

describe('parsePreferences', () => {
  it('parses complete preferences', () => {
    expect(
      parsePreferences(
        JSON.stringify({
          isSecureModeEnabled: true,
          showUsersListDeleteButton: true,
          theme: { isAuto: true, mode: 'dark' },
        })
      )
    ).toEqual({
      isSecureModeEnabled: true,
      showUsersListDeleteButton: true,
      theme: { isAuto: true, mode: 'dark' },
    });
  });

  it('returns undefined for missing or malformed preferences', () => {
    expect(parsePreferences(null)).toBeUndefined();
    expect(parsePreferences('not-json')).toBeUndefined();
  });

  it('drops invalid theme preferences without losing other fields', () => {
    expect(
      parsePreferences(
        JSON.stringify({
          isSecureModeEnabled: true,
          showUsersListDeleteButton: true,
          theme: { isAuto: 'yes please', mode: 'midnight' },
        })
      )
    ).toEqual({
      isSecureModeEnabled: true,
      showUsersListDeleteButton: true,
      theme: undefined,
    });
  });

  it('keeps the storage key stable', () => {
    expect(preferencesKey).toBe('gymflow.preferences');
  });
});
