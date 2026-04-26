import { test, expect } from '@playwright/test';
import { registerStaff, generateToken, validateToken, revokeToken } from '../../fixtures/api-helpers.js';
import { createStaffUser } from '../../fixtures/test-data.js';

test.describe('Guest Token Flow', () => {
  test('should validate a generated token', async ({ request }) => {
    // Arrange
    const staff = createStaffUser();
    const { user } = await registerStaff(request, staff);
    const { plainToken } = await generateToken(request, { userId: user.id, type: 'api' });

    // Act
    const token = await validateToken(request, plainToken);

    // Assert
    expect(token.userId).toBe(user.id);
    expect(token.revokedAt).toBeNull();
  });

  test('should fail validation after token is revoked', async ({ request }) => {
    // Arrange
    const staff = createStaffUser();
    const { user } = await registerStaff(request, staff);
    const { token, plainToken } = await generateToken(request, { userId: user.id, type: 'api' });
    await revokeToken(request, token.id);

    // Act
    const res = await request.get('http://localhost:4000/tokens/validate', {
      headers: { 'x-guest-token': plainToken },
    });

    // Assert
    expect(res.status()).toBe(401);
  });

  test('should fail validation with random token', async ({ request }) => {
    // Act
    const res = await request.get('http://localhost:4000/tokens/validate', {
      headers: { 'x-guest-token': 'not-a-real-token' },
    });

    // Assert
    expect(res.status()).toBe(401);
  });
});
