import { test, expect } from '@playwright/test';
import { registerStaff, generateToken, createProperty, createBooking, submitGuestFeedback } from '../../fixtures/api-helpers.js';
import { createStaffUser, createPropertyInput } from '../../fixtures/test-data.js';
import { GuestPage } from '../../pages/guest.page.js';

test.describe('Guest Feedback', () => {
  test('should submit feedback via API', async ({ request }) => {
    // Arrange
    const staff = createStaffUser();
    const { user } = await registerStaff(request, staff);
    const property = await createProperty(request, createPropertyInput());
    const { plainToken } = await generateToken(request, { userId: user.id, type: 'api' });
    await createBooking(request, {
      propertyId: property.id,
      guestId: user.id,
      checkIn: new Date(Date.now() - 86400000).toISOString(),
      checkOut: new Date(Date.now() + 86400000).toISOString(),
      status: 'confirmed',
    });

    // Act
    const feedback = await submitGuestFeedback(request, plainToken, {
      rating: 5,
      cleanliness: 5,
      communication: 4,
      location: 5,
      value: 4,
      comment: 'Amazing stay!',
    });

    // Assert
    expect(feedback.rating).toBe(5);
    expect(feedback.comment).toBe('Amazing stay!');
  });

  test('should submit feedback from the UI', async ({ page, request }) => {
    // Arrange
    const staff = createStaffUser();
    const { user } = await registerStaff(request, staff);
    const property = await createProperty(request, createPropertyInput());
    const { plainToken } = await generateToken(request, { userId: user.id, type: 'api' });
    await createBooking(request, {
      propertyId: property.id,
      guestId: user.id,
      checkIn: new Date(Date.now() - 86400000).toISOString(),
      checkOut: new Date(Date.now() + 86400000).toISOString(),
      status: 'confirmed',
    });

    const guestPage = new GuestPage(page);

    // Act
    await page.goto(`/stay/${plainToken}/my-flat`);
    await guestPage.submitFeedback(4, 'Great place, quiet neighborhood');

    // Assert
    await expect(page.getByText(/thank you/i)).toBeVisible();
  });
});
