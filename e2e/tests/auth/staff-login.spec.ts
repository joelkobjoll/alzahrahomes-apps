import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page.js';
import { DashboardPage } from '../../pages/dashboard.page.js';
import { registerStaff, loginStaff, logoutStaff } from '../../fixtures/api-helpers.js';
import { createStaffUser } from '../../fixtures/test-data.js';
import { setupAdminWebRouting } from '../../fixtures/api-helpers.js';

test.describe('Staff Login', () => {
  test('should login with valid credentials and redirect to dashboard', async ({ page, request }) => {
    // Arrange
    await setupAdminWebRouting(page);
    const user = createStaffUser();
    await registerStaff(request, user);
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Act
    await loginPage.goto();
    await loginPage.login(user.email, user.password);

    // Assert
    await dashboardPage.expectLoaded();
    await expect(page).toHaveURL('/dashboard');
  });

  test('should show error with invalid credentials', async ({ page }) => {
    // Arrange
    await setupAdminWebRouting(page);
    const loginPage = new LoginPage(page);

    // Act
    await loginPage.goto();
    await loginPage.login('invalid@alzahra.test', 'wrongpassword');

    // Assert
    await loginPage.expectError();
    await expect(page).toHaveURL('/login');
  });

  test('should logout and redirect to login', async ({ page, request }) => {
    // Arrange
    await setupAdminWebRouting(page);
    const user = createStaffUser();
    await registerStaff(request, user);
    const { cookies } = await loginStaff(request, user);

    // Act - set cookie on page context to be authenticated
    await page.context().addCookies(
      cookies.split(',').flatMap((c) => {
        const [name, ...rest] = c.trim().split('=');
        const value = rest.join('=').split(';')[0];
        if (!name || !value) return [];
        return [{ name: name.trim(), value, domain: 'localhost', path: '/' }];
      }),
    );
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();

    // Logout via API and reload
    await logoutStaff(request, cookies);
    await page.reload();

    // Assert
    await expect(page).toHaveURL('/login');
  });
});
