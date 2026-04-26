import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page.js';
import { DashboardPage } from '../../pages/dashboard.page.js';
import { registerStaff, loginStaff } from '../../fixtures/api-helpers.js';
import { createStaffUser } from '../../fixtures/test-data.js';
import { setupAdminWebRouting } from '../../fixtures/api-helpers.js';

test.describe('Admin Dashboard', () => {
  test('should display dashboard after login', async ({ page, request }) => {
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
    await expect(dashboardPage.propertiesCard).toBeVisible();
    await expect(dashboardPage.tokensCard).toBeVisible();
    await expect(dashboardPage.bookingsCard).toBeVisible();
    await expect(dashboardPage.messagesCard).toBeVisible();
  });

  test('should navigate to properties from dashboard', async ({ page, request }) => {
    // Arrange
    await setupAdminWebRouting(page);
    const user = createStaffUser();
    await registerStaff(request, user);
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Act
    await loginPage.goto();
    await loginPage.login(user.email, user.password);
    await dashboardPage.navigateToProperties();

    // Assert
    await expect(page).toHaveURL('/properties');
    await expect(page.getByRole('heading', { name: /properties/i })).toBeVisible();
  });

  test('should navigate to tokens from dashboard', async ({ page, request }) => {
    // Arrange
    await setupAdminWebRouting(page);
    const user = createStaffUser();
    await registerStaff(request, user);
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Act
    await loginPage.goto();
    await loginPage.login(user.email, user.password);
    await dashboardPage.navigateToTokens();

    // Assert
    await expect(page).toHaveURL('/tokens');
    await expect(page.getByRole('heading', { name: /tokens/i })).toBeVisible();
  });
});
