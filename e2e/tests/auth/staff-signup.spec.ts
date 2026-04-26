import { test, expect } from '@playwright/test';
import { registerStaff, loginStaff, getMe } from '../../fixtures/api-helpers.js';
import { createStaffUser } from '../../fixtures/test-data.js';

test.describe('Staff Signup', () => {
  test('should register a new staff user via API', async ({ request }) => {
    // Arrange
    const user = createStaffUser();

    // Act
    const result = await registerStaff(request, user);

    // Assert
    expect(result.user.email).toBe(user.email);
    expect(result.user.firstName).toBe(user.firstName);
    expect(result.user.lastName).toBe(user.lastName);
    expect(result.user.role).toBe('staff');
  });

  test('should login after registration', async ({ request }) => {
    // Arrange
    const user = createStaffUser();
    await registerStaff(request, user);

    // Act
    const { cookies } = await loginStaff(request, user);
    const me = await getMe(request, cookies);

    // Assert
    expect(me).not.toBeNull();
    expect(me!.email).toBe(user.email);
  });

  test('should reject duplicate email registration', async ({ request }) => {
    // Arrange
    const user = createStaffUser();
    await registerStaff(request, user);

    // Act
    const duplicate = { ...user, firstName: 'Different' };
    const res = await request.post('http://localhost:4001/register', { data: duplicate });

    // Assert
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  test('should reject invalid email format', async ({ request }) => {
    // Arrange
    const user = createStaffUser({ email: 'not-an-email' });

    // Act
    const res = await request.post('http://localhost:4001/register', { data: user });

    // Assert
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  test('should reject weak password', async ({ request }) => {
    // Arrange
    const user = createStaffUser({ password: 'weak' });

    // Act
    const res = await request.post('http://localhost:4001/register', { data: user });

    // Assert
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });
});
