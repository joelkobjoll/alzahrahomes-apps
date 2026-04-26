import { test, expect } from '@playwright/test';
import { registerStaff, generateToken, validateToken, revokeToken } from '../../fixtures/api-helpers.js';
import { createStaffUser } from '../../fixtures/test-data.js';

test.describe('Token Lifecycle', () => {
  test('admin generates token → guest uses token → token is valid', async ({ request }) => {
    // Arrange
    const staff = createStaffUser();
    const { user } = await registerStaff(request, staff);

    // Act
    const { token, plainToken } = await generateToken(request, { userId: user.id, type: 'api' });
    const validated = await validateToken(request, plainToken);

    // Assert
    expect(token.id).toBeDefined();
    expect(validated.userId).toBe(user.id);
    expect(validated.revokedAt).toBeNull();
  });

  test('admin revokes token → guest token no longer works', async ({ request }) => {
    // Arrange
    const staff = createStaffUser();
    const { user } = await registerStaff(request, staff);
    const { token, plainToken } = await generateToken(request, { userId: user.id, type: 'api' });
    await validateToken(request, plainToken);

    // Act
    await revokeToken(request, token.id);

    // Assert
    const res = await request.get('http://localhost:4000/tokens/validate', {
      headers: { 'x-guest-token': plainToken },
    });
    expect(res.status()).toBe(401);
    const body = (await res.json()) as { error: { code: string } };
    expect(body.error.code).toMatch(/TOKEN_REVOKED|INVALID_TOKEN/);
  });

  test('expired token should be rejected', async ({ request }) => {
    // Arrange
    const staff = createStaffUser();
    const { user } = await registerStaff(request, staff);
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { plainToken } = await generateToken(request, { userId: user.id, type: 'api', expiresAt: yesterday });

    // Act
    const res = await request.get('http://localhost:4000/tokens/validate', {
      headers: { 'x-guest-token': plainToken },
    });

    // Assert
    expect(res.status()).toBe(401);
  });
});
