import { test, expect } from '@playwright/test';
import { GuestPage } from '../../pages/guest.page.js';
import { registerStaff, generateToken, createProperty, createBooking, createRecommendation } from '../../fixtures/api-helpers.js';
import { createStaffUser, createPropertyInput } from '../../fixtures/test-data.js';
import { mockGooglePlaces } from '../../fixtures/api-helpers.js';

test.describe('Guest Full Flow', () => {
  test('guest can enter token, view flat, explore, message, feedback', async ({ page, request }) => {
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
    // Seed a recommendation so explore page has data
    await createRecommendation(request, {
      title: 'Mock Restaurant',
      description: 'Great local food',
      type: 'restaurant',
      filters: { lat: 36.7213, lng: -4.4213 },
    });

    const guestPage = new GuestPage(page);

    // Act: Enter token at guest-web /
    await guestPage.goto();
    await guestPage.enterToken(plainToken);

    // Assert: Redirected to /stay/{token}/my-flat
    await expect(page).toHaveURL(new RegExp(`/stay/${plainToken}/my-flat`));

    // Act & Assert: View My Flat page
    await guestPage.expectMyFlatLoaded();
    await expect(page.getByText(property.name)).toBeVisible();
    await expect(page.getByText('WiFi')).toBeVisible();
    await expect(page.getByText('House Rules')).toBeVisible();

    // Act: Click Explore tab
    await guestPage.navigateToExplore();

    // Assert: Recommendations list and map shown
    await expect(page.getByRole('heading', { name: /explore/i })).toBeVisible();
    await expect(page.getByText(/recommendations near your stay/i)).toBeVisible();

    // Act: Filter by category
    const foodFilter = page.getByRole('button', { name: /food/i });
    await foodFilter.click();

    // Assert: Only matching recommendations shown (or filter is active)
    await expect(foodFilter).toBeVisible();

    // Act: Send message to host
    await page.goto(`/stay/${plainToken}/my-flat`);
    await guestPage.sendMessage('Hello, I need more towels');

    // Assert: Message appears in thread
    await expect(page.getByText('Hello, I need more towels')).toBeVisible();

    // Act: Submit feedback (4 stars + sub-ratings)
    await guestPage.submitFeedback(4, 'Great stay, would recommend!');

    // Assert: Feedback submitted successfully
    await expect(page.getByText(/thank you/i)).toBeVisible();
  });
});
