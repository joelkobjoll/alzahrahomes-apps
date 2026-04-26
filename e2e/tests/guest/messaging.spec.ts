import { test, expect } from '@playwright/test';
import { registerStaff, generateToken, createProperty, sendGuestMessage } from '../../fixtures/api-helpers.js';
import { createStaffUser, createPropertyInput } from '../../fixtures/test-data.js';
import { GuestPage } from '../../pages/guest.page.js';

test.describe('Guest Messaging', () => {
  test('should send a message via API', async ({ request }) => {
    // Arrange
    const staff = createStaffUser();
    const { user } = await registerStaff(request, staff);
    const { plainToken } = await generateToken(request, { userId: user.id, type: 'api' });

    // Act
    const message = await sendGuestMessage(request, plainToken, 'Hello host!');

    // Assert
    expect(message.body).toBe('Hello host!');
  });

  test('should send a message from the UI', async ({ page, request }) => {
    // Arrange
    const staff = createStaffUser();
    const { user } = await registerStaff(request, staff);
    await createProperty(request, createPropertyInput());
    const { plainToken } = await generateToken(request, { userId: user.id, type: 'api' });

    const guestPage = new GuestPage(page);

    // Act
    await page.goto(`/stay/${plainToken}/my-flat`);
    await guestPage.sendMessage('Need more towels please');

    // Assert
    await expect(page.getByText('Need more towels please')).toBeVisible();
  });
});
