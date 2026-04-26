import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page.js';
import { DashboardPage } from '../../pages/dashboard.page.js';
import { PropertyPage } from '../../pages/property.page.js';
import { TokenPage } from '../../pages/token.page.js';
import { registerStaff } from '../../fixtures/api-helpers.js';
import { createStaffUser, createPropertyInput } from '../../fixtures/test-data.js';
import { setupAdminWebRouting } from '../../fixtures/api-helpers.js';

test.describe('Staff Full Flow', () => {
  test('staff can signup, login, create property, generate token, view dashboard', async ({ page, request }) => {
    // Arrange
    await setupAdminWebRouting(page);
    const user = createStaffUser();
    const { user: registeredUser } = await registerStaff(request, user);
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const propertyPage = new PropertyPage(page);
    const tokenPage = new TokenPage(page);
    const propertyInput = createPropertyInput();

    // Act: Login
    await loginPage.goto();
    await loginPage.login(user.email, user.password);

    // Assert: Redirected to dashboard
    await dashboardPage.expectLoaded();
    await expect(page).toHaveURL('/dashboard');

    // Act: Create property
    await propertyPage.gotoNew();
    await propertyPage.fillForm({
      name: propertyInput.name,
      slug: propertyInput.slug,
      description: propertyInput.description ?? '',
      city: propertyInput.city ?? '',
      country: propertyInput.country ?? '',
      price: propertyInput.pricePerNight ?? '',
      bedrooms: propertyInput.bedrooms?.toString() ?? '',
      bathrooms: propertyInput.bathrooms ?? '',
      maxGuests: propertyInput.maxGuests?.toString() ?? '',
    });
    await propertyPage.submitForm();

    // Assert: Property appears in list
    await propertyPage.goto();
    await propertyPage.expectPropertyInList(propertyInput.name);

    // Act: Generate token
    await tokenPage.goto();
    const tokenValue = await tokenPage.generateToken(registeredUser.id, 'api');

    // Assert: Token created
    expect(tokenValue).toBeTruthy();
    expect(tokenValue.length).toBeGreaterThan(10);

    // Act: View dashboard
    await dashboardPage.goto();

    // Assert: Stats show at least 1 property, 1 token
    const stats = await dashboardPage.getStats();
    expect(stats.properties).toBeGreaterThanOrEqual(1);
    expect(stats.tokens).toBeGreaterThanOrEqual(1);

    // Act: Logout
    await page.getByRole('button', { name: /logout/i }).click();

    // Assert: Redirected to login
    await expect(page).toHaveURL('/login');
  });
});
