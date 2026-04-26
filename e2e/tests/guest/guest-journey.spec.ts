import { test, expect } from '@playwright/test';
import { GuestPage } from '../../pages/guest.page.js';
import { registerStaff, generateToken, createProperty } from '../../fixtures/api-helpers.js';
import { createStaffUser, createPropertyInput } from '../../fixtures/test-data.js';
import { mockGooglePlaces } from '../../fixtures/api-helpers.js';

test.describe('Guest Journey', () => {
  test('should enter token and view My Flat with WiFi and House Rules', async ({ page, request }) => {
    // Arrange
    await mockGooglePlaces(page);
    const staff = createStaffUser();
    const { user } = await registerStaff(request, staff);
    const property = await createProperty(request, createPropertyInput());
    const { plainToken } = await generateToken(request, {
      userId: user.id,
      type: 'api',
      metadata: { propertyId: property.id },
    });

    const guestPage = new GuestPage(page);

    // Act
    await guestPage.goto();
    await guestPage.enterToken(plainToken);

    // Assert
    await guestPage.expectMyFlatLoaded();
    await expect(page).toHaveURL(new RegExp(`/stay/${plainToken}/my-flat`));
    await expect(guestPage.wifiCard).toBeVisible();
    await expect(guestPage.houseRules).toBeVisible();
  });

  test('should show error for invalid token', async ({ page }) => {
    // Arrange
    const guestPage = new GuestPage(page);

    // Act
    await guestPage.goto();
    await guestPage.enterToken('invalid-token-12345');

    // Assert
    await guestPage.expectTokenError();
  });
});
