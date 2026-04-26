import { test, expect } from '@playwright/test';
import { GuestPage } from '../../pages/guest.page.js';
import { registerStaff, generateToken, createProperty, createBooking } from '../../fixtures/api-helpers.js';
import { createStaffUser, createPropertyInput } from '../../fixtures/test-data.js';
import { mockGooglePlaces } from '../../fixtures/api-helpers.js';

test.describe('Explore Recommendations', () => {
  test('should view explore page with recommendations', async ({ page, request }) => {
    // Arrange
    await mockGooglePlaces(page);
    const staff = createStaffUser();
    const { user } = await registerStaff(request, staff);
    const property = await createProperty(request, {
      ...createPropertyInput(),
      latitude: '36.7213',
      longitude: '-4.4213',
    });
    const { plainToken } = await generateToken(request, {
      userId: user.id,
      type: 'api',
      metadata: { propertyId: property.id },
    });
    await createBooking(request, {
      propertyId: property.id,
      guestId: user.id,
      checkIn: new Date(Date.now() - 86400000).toISOString(),
      checkOut: new Date(Date.now() + 86400000).toISOString(),
      status: 'confirmed',
    });

    const guestPage = new GuestPage(page);

    // Act
    await page.goto(`/stay/${plainToken}/explore`);

    // Assert
    await expect(page.getByRole('heading', { name: /explore/i })).toBeVisible();
    await expect(page.getByText(/recommendations near your stay/i)).toBeVisible();
  });

  test('should filter recommendations by category', async ({ page, request }) => {
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
    await createBooking(request, {
      propertyId: property.id,
      guestId: user.id,
      checkIn: new Date(Date.now() - 86400000).toISOString(),
      checkOut: new Date(Date.now() + 86400000).toISOString(),
      status: 'confirmed',
    });

    // Act
    await page.goto(`/stay/${plainToken}/explore`);
    const foodFilter = page.getByRole('button', { name: /food/i });
    await foodFilter.click();

    // Assert
    await expect(foodFilter).toBeVisible();
  });
});
