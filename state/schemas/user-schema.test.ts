import {
  User,
  USER_FORM_ERROR_MESSAGES,
  userFormSchema,
} from '@/state/schemas/user-schema';

describe('userFormSchema', () => {
  it('accepts a valid user form payload', () => {
    const result = userFormSchema.safeParse({
      fullName: 'Grace Hopper',
      role: 'STAFF',
      dateOfBirth: '1906-12-09',
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid payloads and returns specific error messages', () => {
    const result = userFormSchema.safeParse({
      fullName: 'Al',
      role: 'OWNER',
      dateOfBirth: 'not-a-date',
    });

    expect(result.success).toBe(false);

    expect(result.error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: ['fullName'], message: USER_FORM_ERROR_MESSAGES.fullNameMin }),
        expect.objectContaining({ path: ['role'], message: USER_FORM_ERROR_MESSAGES.roleRequired }),
        expect.objectContaining({ path: ['dateOfBirth'], message: USER_FORM_ERROR_MESSAGES.dateInvalid }),
      ])
    );
  });

  it('rejects too-long names with reusable max length message', () => {
    const result = userFormSchema.safeParse({
      fullName: 'A'.repeat(51),
      role: 'MEMBER',
      dateOfBirth: '1900-01-01',
    });

    expect(result.success).toBe(false);

    expect(result.error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: ['fullName'], message: USER_FORM_ERROR_MESSAGES.fullNameMax }),
      ])
    );
  });
});