import { userFormSchema } from '@/features/users/user-schema';

describe('userFormSchema', () => {
  it('accepts a valid user form payload', () => {
    const result = userFormSchema.safeParse({
      fullName: 'Grace Hopper',
      role: 'STAFF',
      dateOfBirth: '1906-12-09',
    });

    expect(result.success).toBe(true);
  });

  it('rejects invalid full name, role, and date values', () => {
    const result = userFormSchema.safeParse({
      fullName: 'Al',
      role: 'OWNER',
      dateOfBirth: 'not-a-date',
    });

    expect(result.success).toBe(false);
  });
});

