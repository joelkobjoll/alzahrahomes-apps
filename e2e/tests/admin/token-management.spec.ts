import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page.js';
import { TokenPage } from '../../pages/token.page.js';
import { registerStaff, generateToken, revokeToken } from '../../fixtures/api-helpers.js';
import { createStaffUser } from '../../fixtures/test-data.js';
import { setupAdminWebRouting } from '../../fixtures/api-helpers.js';

test.describe('Admin Token Management', () => {
  test('should display tokens page', async ({ page, request }) => {
    // Arrange
    await setupAdminWebRouting(page);
    const user = createStaffUser();
    await registerStaff(request, user);
    const loginPage = new LoginPage(page);
    const tokenPage = new TokenPage(page);

    // Act
    await loginPage.goto();
    await loginPage.login(user.email, user.password);
    await tokenPage.goto();

    // Assert
    await tokenPage.expectLoaded();
    await expect(tokenPage.generateButton).toBeVisible();
  });

  test('should generate a token from UI', async ({ page, request }) => {
    // Arrange
    await setupAdminWebRouting(page);
    const user = createStaffUser();
    const { user: registeredUser } = await registerStaff(request, user);
    const loginPage = new LoginPage(page);
    const tokenPage = new TokenPage(page);

    // Act
    await loginPage.goto();
    await loginPage.login(user.email, user.password);
    await tokenPage.goto();
    const tokenValue = await tokenPage.generateToken(registeredUser.id, 'api');

    // Assert
    expect(tokenValue).toBeTruthy();
    expect(tokenValue.length).toBeGreaterThan(10);
  });

  test('should generate and revoke token via API', async ({ request }) => {
    // Arrange
    const staff = createStaffUser();
    const { user } = await registerStaff(request, staff);

    // Act
    const { token, plainToken } = await generateToken(request, { userId: user.id, type: 'api' });
    await revokeToken(request, token.id);

    // Assert
    const res = await request.get('http://localhost:4000/tokens/validate', {
      headers: { 'x-guest-token': plainToken },
    });
    expect(res.status()).toBe(401);
  });
});
