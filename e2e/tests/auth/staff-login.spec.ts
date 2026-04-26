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
    await loginPage.expectLoginError();
    await expect(page).toHaveURL('/login');
  });

  test('should logout and redirect to login', async ({ page, request }) => {
    // Arrange
    await setupAdminWebRouting(page);
    const user = createStaffUser();
    await registerStaff(request, user);
    const { cookies } = await loginStaff(request, user);
    const loginPage = new LoginPage(page);

    // Act
    await page.goto('/dashboard');
    await logoutStaff(request, cookies);
    await page.reload();

    // Assert
    await expect(page).toHaveURL('/login');
  });
});
