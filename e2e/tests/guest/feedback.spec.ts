import { test, expect } from '@playwright/test';
import { registerStaff, generateToken, createProperty, submitGuestFeedback } from '../../fixtures/api-helpers.js';
import { createStaffUser, createPropertyInput } from '../../fixtures/test-data.js';
import { GuestPage } from '../../pages/guest.page.js';

test.describe('Guest Feedback', () => {
  test('should submit feedback via API', async ({ request }) => {
    // Arrange
    const staff = createStaffUser();
    const { user } = await registerStaff(request, staff);
    const property = await createProperty(request, createPropertyInput());
    const { plainToken } = await generateToken(request, { userId: user.id, type: 'api' });

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
    await createProperty(request, createPropertyInput());
    const { plainToken } = await generateToken(request, { userId: user.id, type: 'api' });

    const guestPage = new GuestPage(page);

    // Act
    await page.goto(`/stay/${plainToken}/my-flat`);
    await guestPage.submitFeedback(4, 'Great place, quiet neighborhood');

    // Assert
    await expect(page.getByText(/thank you/i)).toBeVisible();
  });
});
